import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Slow down the video playback speed
  useEffect(() => {
    if(localStorage.getItem('isLogin')) {
      navigate('/dashboard')
    }
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
      
      // Set loaded state when video is ready
      videoRef.current.onloadeddata = () => {
        setLoaded(true);
      };
    }
  }, []);

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

  // Split text for letter animation - now using two separate lines
  const titleLine1 = "Ignite Your Curiosity.";
  const titleLine2 = "Share Your Story.";
  const titleArray1 = titleLine1.split("");
  const titleArray2 = titleLine2.split("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/src/assets/images/bc2.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>

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
            className="relative z-10 px-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Brand Logo */}
            <motion.div
              className="flex justify-center mb-8"
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

            {/* Animated Two-Line Heading */}
            <div className="text-5xl md:text-6xl font-extrabold mb-8 text-center">
              {/* First Line */}
              <div className="overflow-hidden py-2 mb-2">
                <div className="flex justify-center flex-wrap">
                  {titleArray1.map((letter, index) => (
                    <motion.span
                      key={`line1-${index}`}
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
              
              {/* Second Line */}
              <div className="overflow-hidden py-2">
                <div className="flex justify-center flex-wrap">
                  {titleArray2.map((letter, index) => (
                    <motion.span
                      key={`line2-${index}`}
                      custom={index + titleArray1.length} // Add delay based on first line length
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

            {/* Animated Paragraph with Staggered Lines */}
            <motion.div
              className="space-y-2 mb-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <p className="text-lg text-gray-200">
                Explore a universe of user-powered magazines and effortlessly publish your own.
              </p>
              <p className="text-lg text-gray-200">
                Join our vibrant community to discover diverse voices and contribute your unique perspective.
              </p>
            </motion.div>

            {/* Enhanced Buttons with Hover Effects */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="group relative flex items-center justify-center bg-white/10 backdrop-blur-md w-48 px-6 py-4 rounded-xl overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative font-medium text-lg z-10">Login</span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="group relative flex items-center justify-center bg-yellow-400 w-48 px-6 py-4 rounded-xl overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative font-medium text-lg text-gray-900 z-10">Register</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ 
                opacity: { delay: 2.5, duration: 1 },
                y: { delay: 2.5, duration: 1.5, repeat: Infinity }
              }}
            >
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with Animated Reveal */}
      <motion.div
        className="absolute bottom-4 w-full text-center text-sm text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.5 }}
      >
      </motion.div>
    </div>
  );
};

export default Home;