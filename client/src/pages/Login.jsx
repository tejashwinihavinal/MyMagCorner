import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Set loaded state after a small delay to trigger animations
  useState(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/auth/login',
        { email, password },
        { withCredentials: true }
      );

      // Store the token in localStorage
      localStorage.setItem('token', res.data.token);

      alert('Login successful');
      localStorage.setItem('isLogin', true);
      navigate('/dashboard'); // Redirect to the dashboard after login
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Redirect to the backend Google OAuth route
      window.location.href = 'http://localhost:5000/auth/google';
    } catch (err) {
      console.error('Google Login Failed:', err);
    }
  };

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
  const loginTitle = "Welcome Back.";
  const loginTitleArray = loginTitle.split("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/bcphoto2.jpg')",
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

      {/* Content */}
      <AnimatePresence>
        {loaded && (
          <motion.div 
            className="relative z-10 px-6 w-full max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Brand Logo */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2
              }}
            >
            </motion.div>

            {/* Login Form Container */}
            <motion.div
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.4
              }}
            >
              {/* Animated Letter-by-Letter Heading */}
              <div className="text-3xl font-extrabold mb-6 text-center">
                <div className="overflow-hidden py-2">
                  <div className="flex justify-center flex-wrap">
                    {loginTitleArray.map((letter, index) => (
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

              {/* Form Description */}
              <motion.p
                className="text-center text-gray-300 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Sign in to access your magazines and continue your journey.
              </motion.p>

              {/* Form */}
              <motion.form
                onSubmit={handleLogin}
                className="flex flex-col gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <button
                    type="submit"
                    className={`w-full p-4 rounded-xl text-white font-medium relative overflow-hidden ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-lg'
                    }`}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </motion.div>
              </motion.form>

              {/* Forgot Password */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <p
                  className="text-yellow-300 cursor-pointer hover:underline"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div 
                className="flex items-center my-6"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div className="flex-grow h-px bg-white/20"></div>
                <span className="px-4 text-gray-400 text-sm">or continue with</span>
                <div className="flex-grow h-px bg-white/20"></div>
              </motion.div>

              {/* Google Login */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <div className="mt-2">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      console.error('Google Login Failed');
                    }}
                  />
                </div>
              </motion.div>

              {/* Register Link */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                <p className="text-gray-300">
                  Don't have an account?{' '}
                  <span
                    className="text-yellow-300 cursor-pointer hover:underline"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </span>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        className="absolute bottom-4 w-full text-center text-sm text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
      </motion.div>
    </div>
  );
};

export default Login;