import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  // Text animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
      }
    })
  };

  // Split text for letter animation
  const otpTitle = "Verify OTP.";
  const otpTitleArray = otpTitle.split("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/auth/verify-otp', {
        email,
        otp,
      });

      // Success animation then redirect
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setLoading(false);
      // Create a toast notification-like alert
      const alertBox = document.createElement('div');
      alertBox.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
      alertBox.textContent = err.response?.data?.message || 'OTP verification failed';
      document.body.appendChild(alertBox);
      setTimeout(() => alertBox.remove(), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/otpbc.jpg')",
        }}
      ></div>

      {/* Modern Gradient Overlay with Animation */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Animated Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-white/20 backdrop-blur-xl"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 0.3, 
                scale: 1, 
                x: Math.random() * 40 - 20,
                y: Math.random() * 40 - 20,
                transition: { 
                  duration: 4 + index * 2, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* OTP Verification Form */}
      <div className="relative z-10 flex items-center justify-center flex-grow px-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Animated Letter-by-Letter Heading */}
          <div className="text-4xl font-extrabold mb-8 text-center">
            <div className="overflow-hidden py-2">
              <div className="flex justify-center flex-wrap">
                {otpTitleArray.map((letter, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className={letter === " " ? "mr-2" : letter === "." ? "text-yellow-300 mr-2" : "text-yellow-300"}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.4
            }}
          >
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center mb-6"
              >
                <h2 className="text-xl font-semibold mb-2">
                  Enter the verification code
                </h2>
                <p className="text-gray-300">
                  We've sent a code to <span className="text-yellow-300">{email || "your email"}</span>
                </p>
              </motion.div>

              <form onSubmit={handleVerify} className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="space-y-2"
                >
                  <label className="block text-sm text-gray-200">Verification Code</label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 text-center text-xl tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 rounded-xl text-white font-medium shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div 
                      animate={{ 
                        rotate: 360,
                      }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    "Verify Code"
                  )}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-6 text-center"
              >
                <p className="text-gray-300 text-sm">
                  Didn't receive the code? <button className="text-yellow-300 hover:underline">Resend</button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: 0
                }}
                transition={{ 
                  duration: 2,
                  times: [0, 0.5, 1],
                  repeat: Infinity
                }}
                className="text-6xl mb-4"
              >
                ✨
              </motion.div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">Success!</h3>
              <p className="text-gray-300">OTP verified successfully. Redirecting to login...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        className="relative z-10 py-6 w-full text-center text-sm text-gray-300 mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
      </motion.div>
    </div>
  );
};

export default OtpVerification;