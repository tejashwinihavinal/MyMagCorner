import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
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
    };

    fetchData();
  }, []);

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
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: "url('/src/assets/images/bcphoto1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 px-4 py-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold">Welcome, {user.name}</h1>
          <p className="text-gray-200 text-lg">Email: {user.email}</p>
        </motion.div>

        <motion.h2
          className="text-3xl font-semibold text-center text-white mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your Magazines
        </motion.h2>

        {magazines.length === 0 ? (
          <motion.div
            className="text-center text-gray-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            You have not uploaded any magazines yet.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magazines.map((magazine, idx) => (
              <motion.div
                key={magazine._id}
                className="relative bg-white/20 backdrop-blur-md text-white p-4 rounded-lg shadow-xl border border-white/30 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="relative group">
                  <img
                    src={magazine.coverImageUrl}
                    alt={`${magazine.title} Cover`}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-4">
                    <h2 className="text-xl font-bold mb-2">{magazine.title}</h2>
                    <p className="text-gray-200 text-sm">{magazine.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(magazine)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 rounded-lg text-white font-semibold shadow-md"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(magazine._id)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 px-5 py-2 rounded-lg text-white font-semibold shadow-md"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <motion.div
              className="bg-white/20 backdrop-blur-lg text-white p-6 rounded-lg shadow-xl w-96 border border-white/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center">Edit Magazine</h2>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="p-2 border rounded bg-white/10 text-white placeholder-gray-300"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="p-2 border rounded bg-white/10 text-white placeholder-gray-300"
                />
                <input
                  type="text"
                  placeholder="Categories"
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  className="p-2 border rounded bg-white/10 text-white placeholder-gray-300"
                />
                <div>
                  <p className="text-gray-300">Current Cover Image:</p>
                  <img
                    src={formData.coverImageUrl}
                    alt="Current Cover"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <input
                    type="file"
                    onChange={(e) => setNewCoverImage(e.target.files[0])}
                    className="p-2 border rounded bg-white/10 text-white"
                  />
                </div>
                <div>
                  <p className="text-gray-300">Current File:</p>
                  <a
                    href={formData.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 underline"
                  >
                    View Current File
                  </a>
                  <input
                    type="file"
                    onChange={(e) => setNewFile(e.target.files[0])}
                    className="p-2 border rounded bg-white/10 text-white mt-2"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded hover:scale-105 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded hover:scale-105 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default Profile;
