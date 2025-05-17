// Dashboard.jsx
import React, { useState, useEffect } from 'react';
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
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [showCommentSlide, setShowCommentSlide] = useState(false);
  const [commentMagazine, setCommentMagazine] = useState(null);

  const navigate = useNavigate();
  const categories = ['Fiction', 'Science', 'Art', 'Technology', 'Fashion'];

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
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (err) {
      toast.error('Logout failed');
    }
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

  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('/src/assets/images/bcphoto2.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <ToastContainer />
      <div className="relative z-10 px-4 py-6 max-w-7xl mx-auto">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-4 py-4 bg-white/20 backdrop-blur-md rounded-lg mb-6 shadow-md">
          <Link to="/" className="text-2xl font-bold text-yellow-300">
            Magazines
          </Link>
          <div className="flex space-x-6 text-white font-medium">
            <Link to="/upload-magazine" className="hover:text-yellow-300">
              Upload
            </Link>
            <Link to="/profile" className="hover:text-yellow-300">
              Profile
            </Link>
            <button onClick={handleLogout} className="hover:text-yellow-300">
              Logout
            </button>
          </div>
        </nav>

        {/* Search + Category */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6 z-20 relative">
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search magazines..."
              className="w-full px-10 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg backdrop-blur-md focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3.5 text-white" />
          </div>

          <div className="relative w-full md:w-1/3 z-30">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full px-4 py-3 bg-white/20 text-white rounded-lg backdrop-blur-md flex justify-between items-center"
            >
              {category || 'All Categories'} <FaAngleDown />
            </button>
            <AnimatePresence>
              {showCategoryDropdown && (
                <motion.div
                  className="absolute w-full mt-2 bg-white/20 text-white rounded-lg backdrop-blur-md shadow-xl z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button
                    onClick={() => {
                      setCategory('');
                      setShowCategoryDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-white/10"
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
                      className="block w-full text-left px-4 py-2 hover:bg-white/10"
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {magazines.map((mag, idx) => (
            <motion.div
              key={mag._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: idx * 0.1 }}
              className="relative bg-white/20 backdrop-blur-md text-white p-4 rounded-lg shadow-xl border border-white/30 overflow-hidden"
            >
              <div className="relative group">
                <img
                  src={mag.coverImageUrl}
                  alt={mag.title}
                  className="w-full h-64 object-cover rounded"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-4">
                  <h2 className="text-xl font-bold mb-2">{mag.title}</h2>
                  <p className="text-gray-200 text-sm">{mag.description}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => {
                    if (mag.fileUrl) {
                      window.open(mag.fileUrl, '_blank');
                    } else {
                      toast.error('PDF file not found');
                    }
                  }}
                  className="bg-white/10 px-4 py-2 rounded hover:bg-white/20 transition"
                >
                  View
                </button>

                <div className="flex items-center gap-4">
                  <div
                    className="relative"
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
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => openCommentSlide(mag)}
                      className="flex items-center gap-1 hover:text-blue-400 transition"
                    >
                      <FaRegComment />
                      <span>{mag.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Likes Slide Modal */}
        <AnimatePresence>
          {showLikesModal && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed top-0 left-0 w-80 h-full bg-white text-black shadow-lg z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Liked by:</h2>
                <button onClick={() => setShowLikesModal(false)}>
                  <FaTimes />
                </button>
              </div>
              {likesList.length > 0 ? (
                likesList.map((user, index) => (
                  <p key={index}>{user.name || 'User'}</p>
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
              className="fixed top-0 right-0 w-96 h-full bg-white text-black shadow-lg z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Comments</h2>
                <button onClick={() => setShowCommentSlide(false)}>
                  <FaTimes />
                </button>
              </div>
              {commentMagazine.comments?.length > 0 ? (
                commentMagazine.comments.map((comment, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-bold">
                      {comment.user?.name || 'Anonymous'}
                    </p>
                    <p>{comment.text}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 text-black"
              />
              <button
                onClick={() => handleComment(commentMagazine._id)}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
