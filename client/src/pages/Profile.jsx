import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMagazine, setCurrentMagazine] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: '',
    coverImageUrl: '',
    fileUrl: '',
  });
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/user', { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    const fetchMagazines = async () => {
      try {
        const res = await axios.get('http://localhost:5000/magazines/user-magazines', {
          withCredentials: true,
        });
        setMagazines(res.data);
      } catch (err) {
        console.error('Error fetching user magazines:', err);
      }
    };

    const fetchData = async () => {
      await fetchUser();
      await fetchMagazines();
      setLoading(false);
      // Set loaded state after a small delay to trigger animations
      setTimeout(() => setLoaded(true), 100);
    };

    fetchData();
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

  // Split text for letter animation
  const profileTitle = "Your Profile.";
  const profileTitleArray = profileTitle.split("");

  const handleEdit = (magazine) => {
    setCurrentMagazine(magazine);
    setFormData({
      title: magazine.title,
      description: magazine.description,
      categories: magazine.categories,
      coverImageUrl: magazine.coverImageUrl,
      fileUrl: magazine.fileUrl,
    });
    setNewCoverImage(null);
    setNewFile(null);
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { ...formData };

    if (newCoverImage) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedImageTypes.includes(newCoverImage.type)) {
        toast.error('Invalid cover image format. Please upload a JPG or PNG file.');
        return;
      }

      const coverImageData = new FormData();
      coverImageData.append('file', newCoverImage);
      const coverImageRes = await axios.post('http://localhost:5000/upload', coverImageData, {
        withCredentials: true,
      });
      updatedData.coverImageUrl = coverImageRes.data.fileUrl;
    }

    if (newFile) {
      const allowedFileTypes = ['application/pdf'];
      if (!allowedFileTypes.includes(newFile.type)) {
        toast.error('Invalid file format. Please upload a PDF file.');
        return;
      }

      const fileData = new FormData();
      fileData.append('file', newFile);
      const fileRes = await axios.post('http://localhost:5000/upload', fileData, {
        withCredentials: true,
      });
      updatedData.fileUrl = fileRes.data.fileUrl;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/magazines/${currentMagazine._id}`,
        updatedData,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setMagazines((prevMagazines) =>
        prevMagazines.map((m) => (m._id === currentMagazine._id ? { ...m, ...updatedData } : m))
      );
      setIsEditing(false);
      setCurrentMagazine(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating magazine');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this magazine?')) {
      try {
        const res = await axios.delete(`http://localhost:5000/magazines/${id}`, {
          withCredentials: true,
        });
        toast.success(res.data.message);
        setMagazines((prevMagazines) => prevMagazines.filter((m) => m._id !== id));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting magazine');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black/80">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/bcphoto1.jpg')",
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
            className="relative z-10 px-6 pt-16 pb-24 w-full mx-auto max-w-7xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Profile Header */}
            <motion.div
              className="flex flex-col items-center justify-center mb-12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.2
              }}
            >
              {/* Animated Letter-by-Letter Heading */}
              <div className="text-4xl font-extrabold mb-3 text-center">
                <div className="overflow-hidden py-2">
                  <div className="flex justify-center flex-wrap">
                    {profileTitleArray.map((letter, index) => (
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-8 py-4 text-center shadow-lg"
              >
                <h2 className="text-2xl font-semibold">Welcome, {user.name}</h2>
                <p className="text-gray-300 mt-1">{user.email}</p>
              </motion.div>
            </motion.div>

            {/* Magazines Section Header */}
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-yellow-300">Your Magazine Collection</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mt-4 rounded-full"></div>
              <p className="text-gray-300 mt-4">
                Manage your published magazines and make updates when needed
              </p>
            </motion.div>

            {/* Magazines Grid */}
            {magazines.length === 0 ? (
              <motion.div
                className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  className="text-6xl mb-4 inline-block"
                >
                  📚
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">No Magazines Yet</h3>
                <p className="text-gray-300">
                  You haven't uploaded any magazines. Head over to the upload section to publish your first magazine!
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {magazines.map((magazine, idx) => (
                  <motion.div
                    key={magazine._id}
                    className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-xl h-full"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="relative aspect-[4/3] group overflow-hidden">
                      <motion.img
                        src={magazine.coverImageUrl}
                        alt={`${magazine.title} Cover`}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <motion.h3 
                          className="text-xl font-bold mb-1 text-yellow-300"
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {magazine.title}
                        </motion.h3>
                        <motion.p 
                          className="text-sm text-gray-200 line-clamp-2"
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {magazine.description}
                        </motion.p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-yellow-300">{magazine.title}</h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{magazine.description}</p>
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(magazine)}
                          className="flex-1 bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 rounded-lg text-white font-semibold shadow-lg"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(magazine._id)}
                          className="flex-1 bg-gradient-to-r from-red-400 to-red-600 px-4 py-2 rounded-lg text-white font-semibold shadow-lg"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Edit Magazine Modal - Updated to be scrollable and fit within viewport */}
            <AnimatePresence>
              {isEditing && (
                <motion.div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsEditing(false)}
                >
                  <motion.div
                    className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl w-full max-w-md my-8 max-h-[90vh] flex flex-col"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6 border-b border-white/10">
                      <h2 className="text-2xl font-bold text-center text-yellow-300">Edit Magazine</h2>
                    </div>
                    
                    <div className="overflow-y-auto p-6 flex-grow custom-scrollbar">
                      <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <input
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300"
                          />
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 min-h-[80px] max-h-[120px]"
                          />
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <input
                            type="text"
                            placeholder="Categories (comma separated)"
                            value={formData.categories}
                            onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                            className="p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300"
                          />
                        </motion.div>
                        
                        <div className="space-y-1">
                          <label className="text-gray-200 text-sm font-medium">Cover Image</label>
                          <div className="mb-2 overflow-hidden rounded-lg h-32">
                            <img
                              src={formData.coverImageUrl}
                              alt="Cover Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <input
                            type="file"
                            onChange={(e) => setNewCoverImage(e.target.files[0])}
                            className="p-2 rounded-xl w-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-white file:text-sm"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-gray-200 text-sm font-medium">PDF File</label>
                          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                            <a
                              href={formData.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-300 hover:underline flex items-center gap-2 text-sm"
                            >
                              <span>Current File</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                          <input
                            type="file"
                            onChange={(e) => setNewFile(e.target.files[0])}
                            className="p-2 rounded-xl w-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-white file:text-sm"
                          />
                        </div>
                      </form>
                    </div>
                    
                    <div className="p-6 border-t border-white/10 mt-auto">
                      <div className="flex gap-4">
                        <motion.button
                          type="submit"
                          onClick={handleEditSubmit}
                          className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-xl text-white font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          Save Changes
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-white font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
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

      {/* For custom scrollbar styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
};

export default Profile;