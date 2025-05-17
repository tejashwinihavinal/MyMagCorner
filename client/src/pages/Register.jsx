import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle registration with email and password
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/auth/register',
        { email, password },
        { withCredentials: true }
      );

      alert(res.data.message);
      navigate('/verify-otp', { state: { email: res.data.email } }); // Navigate to OTP verification page
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-Up success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      window.location.href = 'http://localhost:5000/auth/google'; // Redirect to backend for Google OAuth
      navigate('/login'); // Redirect to login page after Google Sign-Up
    } catch (err) {
      console.error('Google Login Failed:', err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative"
      style={{
        backgroundImage: "url('/src/assets/images/bcphoto4.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>

      {/* Transparent Registration Form */}
      <motion.div
        className="bg-white/20 backdrop-blur-md text-white p-8 rounded-lg shadow-lg w-96 relative z-10 border border-white/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Create an Account
        </motion.h1>
        <motion.p
          className="text-center text-gray-300 mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Register with your email and password or use Google to sign up.
        </motion.p>
        <motion.form
          onSubmit={handleRegister}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.input
            type="email"
            placeholder="Enter your email"
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <motion.input
            type="password"
            placeholder="Enter your password"
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <motion.button
            type="submit"
            className={`p-3 rounded text-white font-bold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {loading ? 'Registering...' : 'Register with Email'}
          </motion.button>
        </motion.form>
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-300">or sign up using Google</p>
          <div className="mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.error('Google Login Failed');
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;