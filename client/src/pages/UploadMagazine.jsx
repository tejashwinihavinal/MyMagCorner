import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UploadMagazine = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Set loaded state after a small delay to trigger animations
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pdfFormData = new FormData();
      pdfFormData.append('file', pdfFile);

      const pdfUploadRes = await axios.post('http://localhost:5000/upload', pdfFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const fileUrl = pdfUploadRes.data.fileUrl;

      const imageFormData = new FormData();
      imageFormData.append('file', coverImage);

      const imageUploadRes = await axios.post('http://localhost:5000/upload', imageFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const coverImageUrl = imageUploadRes.data.fileUrl;

      const res = await axios.post(
        'http://localhost:5000/magazines/upload',
        {
          title,
          description,
          categories: categories.split(',').map((cat) => cat.trim()),
          fileUrl,
          coverImageUrl,
        },
        {
          withCredentials: true,
        }
      );

      alert(res.data.message);
      setTitle('');
      setDescription('');
      setCategories('');
      setPdfFile(null);
      setCoverImage(null);

      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading magazine');
    } finally {
      setLoading(false);
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
  const uploadTitle = "Upload Magazine.";
  const uploadTitleArray = uploadTitle.split("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/bcphoto5.jpg')",
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
            {/* Upload Form Container */}
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
                    {uploadTitleArray.map((letter, index) => (
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
                Share your magazine with our community.
              </motion.p>

              {/* Form */}
              <motion.form
                onSubmit={handleUpload}
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
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300"
                  />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 min-h-24"
                  />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <input
                    type="text"
                    placeholder="Categories (comma-separated)"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                    required
                    className="p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300"
                  />
                </motion.div>
                
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <label className="block text-gray-300 text-sm ml-1">Cover Image</label>
                  <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                    <input
                      type="file"
                      onChange={(e) => setCoverImage(e.target.files[0])}
                      required
                      accept=".jpg,.jpeg,.png"
                      className="p-3 w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-yellow-500 file:cursor-pointer hover:file:bg-yellow-600"
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <label className="block text-gray-300 text-sm ml-1">PDF File</label>
                  <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                    <input
                      type="file"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      required
                      accept=".pdf"
                      className="p-3 w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-yellow-500 file:cursor-pointer hover:file:bg-yellow-600"
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  className="mt-2"
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
                    {loading ? 'Uploading...' : 'Upload Magazine'}
                  </button>
                </motion.div>
              </motion.form>
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

export default UploadMagazine;