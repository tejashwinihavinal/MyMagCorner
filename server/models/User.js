import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for users who register via email/password
    },
    name: String,
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for users who register via Google
    },
    password: String, // Hashed password for email/password registration
    otp: String, // OTP for email verification
    otpExpiresAt: Date, // Expiration time for OTP
    isVerified: {
      type: Boolean,
      default: false, // Default to false for email/password users
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const User = mongoose.model('User', userSchema);
export default User;