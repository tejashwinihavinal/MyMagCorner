import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0]?.value;
        if (!email) {
          return done(null, false, { message: 'Google account does not have an email.' });
        }

        // 1. Try to find user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        // 2. If not found, try to find user by email
        if (!user) {
          user = await User.findOne({ email });

          if (user) {
            // Link Google account if not already linked
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            // Optionally, ensure the user is verified before allowing login
            if (!user.isVerified) {
              return done(null, false, { message: 'Please verify your email before logging in.' });
            }
          } else {
            // No user found with this email, do NOT create a new user
            return done(null, false, { message: 'User not registered. Please register first.' });
          }
        }

        // User found (by googleId or by email), proceed with login
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'No user found with this email' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});




