import express from 'express';
import passport from 'passport';
import { getCurrentUser, logoutUser } from '../controllers/authController.js';
import { registerUser, verifyOtp } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from '../controllers/authController.js';
import { loginUser } from "../controllers/authController.js";
import { isAuthenticated } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Google login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      // Redirect to the dashboard after successful Google login
      res.redirect('http://localhost:5173/dashboard');
    } catch (err) {
      res.status(500).send('Error during Google authentication');
    }
  }
);

// Email/password registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// OTP verification route
router.post('/verify-otp', verifyOtp);

// Get current user
router.get('/user', getCurrentUser);

// Logout
router.post('/logout', logoutUser);

// Get the currently logged-in user's details
router.get('/user', isAuthenticated, (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
});


router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;