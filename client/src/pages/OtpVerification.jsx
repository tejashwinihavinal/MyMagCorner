import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/verify-otp', {
        email,
        otp,
      });

      alert('OTP verified. Registration complete.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data || 'OTP verification failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative"
      style={{
        backgroundImage: "url('/src/assets/images/otpbc.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>

      {/* Transparent OTP Verification Form */}
      <motion.div
        className="bg-white/20 backdrop-blur-md text-white p-8 rounded-lg shadow-lg w-96 relative z-10 border border-white/30"
        style={{ marginTop: '300px' }} // Adjusted to move the form slightly downward
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h2
          className="text-2xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Enter OTP sent to your email
        </motion.h2>
        <motion.form
          onSubmit={handleVerify}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.input
            type="text"
            placeholder="Enter OTP"
            className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-gray-300"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <motion.button
            type="submit"
            className="p-3 rounded text-white font-bold bg-blue-500 hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Verify OTP
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default OtpVerification;