import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Get the current user
export const getCurrentUser = (req, res) => {
  try {
    res.send(req.user || null);
  } catch (err) {
    res.status(500).send("Error retrieving user");
  }
};

// Logout the user
export const logoutUser = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send("Logout error");
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.send({ success: true, message: "User logged out successfully" });
    });
  });
};

// Register user with email and password
export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "Existing user. Please log in." });
      }

      if (existingUser.otp && existingUser.otpExpiresAt > Date.now()) {
        return res.status(200).json({ message: "OTP already sent. Please verify your email.", email });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      existingUser.otp = otp;
      existingUser.otpExpiresAt = otpExpiresAt;
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Registration',
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      });

      return res.status(200).json({ message: 'A new OTP has been sent to your email.', email });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      isVerified: false,
      name: name || email.split('@')[0],
    });
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to your email. Please verify.', email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user', error: err });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error verifying OTP", error: err });
  }
};

// Login with email and password
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found. Please register." });
    }

    if (!user.googleId && !user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    if (!user.googleId) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    if (user.googleId) {
      console.log("User has a Google account linked:", user.googleId);
    }

    // Create a JWT token
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name || null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Optionally log the user in for session-based authentication
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "An error occurred during login", error: err });
      }

      // Return both the JWT token and session-based user
      return res.status(200).json({ message: "Login successful", token, user: payload });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Forgot Password: Generate OTP and send to user's email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

// Reset Password: Verify OTP and update password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};