import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const videoRef = useRef(null);

  // Slow down the video playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Adjust the speed (0.5 = half speed)
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/src/assets/images/bc2.mp4"
        autoPlay
        loop
        muted
      ></video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Animated Heading */}
        <motion.h1
          className="text-5xl font-extrabold mb-6 text-center drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
         <span className="text-yellow-300">Ignite Your Curiosity. Share Your Story.</span>
        </motion.h1>

        {/* Animated Paragraph */}
        <motion.p
          className="text-lg mb-8 text-center max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
        Explore a universe of user-powered magazines and effortlessly publish your own. Join our vibrant community to discover diverse voices and contribute your unique perspective to the world of online publications.
        </motion.p>

        {/* Enhanced Buttons */}
        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link
              to="/login"
              className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-lg border border-white/30 hover:bg-white/30 hover:shadow-xl transition-all duration-300"
            >
              Login
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link
              to="/register"
              className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-lg border border-white/30 hover:bg-white/30 hover:shadow-xl transition-all duration-300"
            >
              Register
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Footer */}
      <motion.div
        className="absolute bottom-4 text-sm text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        © {new Date().getFullYear()} Magazine Management System. All rights reserved.
      </motion.div>
    </div>
  );
};

export default Home;