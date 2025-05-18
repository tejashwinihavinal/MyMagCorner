import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaAngleDown,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [magazines, setMagazines] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [showCommentSlide, setShowCommentSlide] = useState(false);
  const [commentMagazine, setCommentMagazine] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();
  const categories = ['Fiction', 'Science', 'Art', 'Technology', 'Fashion'];

  // Set loaded state after a small delay to trigger animations
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const res = await axios.get('http://localhost:5000/magazines', {
          params: { category, search },
        });
        setMagazines(res.data);
      } catch (err) {
        toast.error('Failed to load magazines');
      }
    };
    fetchMagazines();
  }, [category, search]);

  const handleLogout = async () => {
    localStorage.clear()
    alert('Logout Successfull!')
    navigate('/')

  };

  const handleLike = async (magazineId, isLiked) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/magazines/${magazineId}/like`,
        {},
        { withCredentials: true }
      );
      setMagazines((prev) =>
        prev.map((mag) =>
          mag._id === magazineId
            ? { ...mag, likes: res.data.likes, isLiked: !isLiked }
            : mag
        )
      );
    } catch (err) {
      toast.error('Error liking magazine');
    }
  };

  const handleComment = async (magazineId) => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/magazines/${magazineId}/comment`,
        { text: newComment },
        { withCredentials: true }
      );
      setMagazines((prev) =>
        prev.map((mag) =>
          mag._id === magazineId
            ? { ...mag, comments: res.data.comments }
            : mag
        )
      );
      setNewComment('');
      setShowCommentSlide(false);
    } catch (err) {
      toast.error('Error posting comment');
    }
  };

  const handleShowLikes = (magazine) => {
    setLikesList(magazine.likes || []);
    setShowLikesModal(true);
  };

  const openCommentSlide = (magazine) => {
    setCommentMagazine(magazine);
    setShowCommentSlide(true);
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
  const dashboardTitle = "Your Magazines.";
  const dashboardTitleArray = dashboardTitle.split("");

  return (
    <div className="min-h-screen flex flex-col items-center text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/src/assets/images/bcphoto2.jpg')",
        }}
      ></div>

      {/* Modern Gradient Overlay with Animation */}
      <motion.div 
        className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60"
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

      <ToastContainer />

      <AnimatePresence>
        {loaded && (
          <motion.div 
            className="relative z-10 px-6 w-full max-w-7xl mx-auto pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Navbar */}
            <motion.nav 
              className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl mb-8 shadow-lg border border-white/20"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.2
              }}
            >
              <Link to="/" className="text-2xl font-bold text-yellow-300">
                Magazines
              </Link>
              <div className="flex space-x-6 text-white font-medium">
                <Link 
                  to="/upload-magazine" 
                  className="hover:text-yellow-300 transition-colors duration-300"
                >
                  Upload
                </Link>
                <Link 
                  to="/profile" 
                  className="hover:text-yellow-300 transition-colors duration-300"
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="hover:text-yellow-300 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            </motion.nav>

            {/* Page Title with Letter Animation */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-3xl font-extrabold mb-2">
                <div className="overflow-hidden py-2">
                  <div className="flex justify-center flex-wrap">
                    {dashboardTitleArray.map((letter, index) => (
                      <motion.span
                        key={index}
                        custom={index}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        className={letter === " " ? "mr-2" : letter === "." ? "text-yellow-300" : "text-yellow-300"}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
              <motion.p
                className="text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Browse through your collection or discover new reading material
              </motion.p>
            </motion.div>

            {/* Search + Category */}
            <motion.div 
              className="flex flex-col md:flex-row gap-4 justify-between mb-8 z-20 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div 
                className="relative w-full md:w-2/3"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search magazines..."
                  className="w-full px-10 py-4 bg-white/10 text-white placeholder-gray-300 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20"
                />
                <FaSearch className="absolute left-4 top-5 text-gray-300" />
              </motion.div>

              <motion.div 
                className="relative w-full md:w-1/3 z-30"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-6 py-4 bg-white/10 text-white rounded-xl backdrop-blur-md flex justify-between items-center border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                >
                  {category || 'All Categories'} <FaAngleDown />
                </button>
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      className="absolute w-full mt-2 bg-white/20 text-white rounded-xl backdrop-blur-md shadow-xl z-50 border border-white/20 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <button
                        onClick={() => {
                          setCategory('');
                          setShowCategoryDropdown(false);
                        }}
                        className="block w-full text-left px-6 py-3 hover:bg-white/10 transition-colors"
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategory(cat);
                            setShowCategoryDropdown(false);
                          }}
                          className="block w-full text-left px-6 py-3 hover:bg-white/10 transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Magazine Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {magazines.map((mag, idx) => (
                <motion.div
                  key={mag._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative bg-white/10 backdrop-blur-md text-white p-4 rounded-xl shadow-xl border border-white/20 overflow-hidden"
                >
                  <div className="relative group">
                    <img
                      src={mag.coverImageUrl}
                      alt={mag.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end items-center text-center p-6">
                      <h2 className="text-xl font-bold mb-2">{mag.title}</h2>
                      <p className="text-gray-200 text-sm">{mag.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <motion.button
                      onClick={() => {
                        if (mag.fileUrl) {
                          window.open(mag.fileUrl, '_blank');
                        } else {
                          toast.error('PDF file not found');
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2 rounded-lg hover:shadow-lg font-medium transition"
                    >
                      View
                    </motion.button>

                    <div className="flex items-center gap-6">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        onMouseEnter={() => handleShowLikes(mag)}
                      >
                        <button
                          onClick={() => handleLike(mag._id, mag.isLiked)}
                          className="flex items-center gap-1 hover:text-red-400 transition"
                        >
                          {mag.isLiked ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart />
                          )}
                          <span>{mag.likes?.length || 0}</span>
                        </button>
                      </motion.div>

                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                      >
                        <button
                          onClick={() => openCommentSlide(mag)}
                          className="flex items-center gap-1 hover:text-blue-400 transition"
                        >
                          <FaRegComment />
                          <span>{mag.comments?.length || 0}</span>
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        className="relative z-10 w-full text-center text-sm text-gray-300 pb-4 mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
      </motion.div>

      {/* Likes Slide Modal */}
      <AnimatePresence>
        {showLikesModal && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed top-0 left-0 w-80 h-full bg-white/20 backdrop-blur-xl text-white shadow-lg z-50 p-6 overflow-y-auto border-r border-white/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-yellow-300">Liked by:</h2>
              <motion.button 
                onClick={() => setShowLikesModal(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <FaTimes />
              </motion.button>
            </div>
            {likesList.length > 0 ? (
              likesList.map((user, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="py-2 border-b border-white/10"
                >
                  {user.name || 'User'}
                </motion.div>
              ))
            ) : (
              <p>No likes yet.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Slide Modal */}
      <AnimatePresence>
        {showCommentSlide && commentMagazine && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-0 right-0 w-96 h-full bg-white/20 backdrop-blur-xl text-white shadow-lg z-50 p-6 overflow-y-auto border-l border-white/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-yellow-300">Comments</h2>
              <motion.button 
                onClick={() => setShowCommentSlide(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <FaTimes />
              </motion.button>
            </div>
            {commentMagazine.comments?.length > 0 ? (
              commentMagazine.comments.map((comment, index) => (
                <motion.div 
                  key={index} 
                  className="mb-4 bg-white/10 p-4 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="font-bold text-yellow-300">
                    {comment.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-gray-200">{comment.text}</p>
                </motion.div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 mt-4 bg-white/10 text-white placeholder-gray-300 backdrop-blur-md border-white/20"
                rows={4}
              />
              <motion.button
                onClick={() => handleComment(commentMagazine._id)}
                className="mt-3 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:shadow-lg font-medium w-full"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Submit
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;