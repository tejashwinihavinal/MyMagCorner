import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UploadMagazine = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading magazine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative"
      style={{
        backgroundImage: "url('/src/assets/images/bcphoto5.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>

      {/* Form Container with Animation */}
      <motion.div
        className="bg-white/20 backdrop-blur-md text-white p-8 rounded-lg shadow-lg w-96 relative z-10 border border-white/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Upload Magazine
        </motion.h1>

        <motion.form
          onSubmit={handleUpload}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-3 border rounded bg-white/20 text-white placeholder-gray-300"
            whileFocus={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <motion.textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="p-3 border rounded bg-white/20 text-white placeholder-gray-300"
            whileFocus={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <motion.input
            type="text"
            placeholder="Categories (comma-separated)"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            required
            className="p-3 border rounded bg-white/20 text-white placeholder-gray-300"
            whileFocus={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <div>
            <label className="block text-gray-300 mb-1">Cover Image</label>
            <input
              type="file"
              onChange={(e) => setCoverImage(e.target.files[0])}
              required
              accept=".jpg,.jpeg,.png"
              className="p-2 border rounded bg-white/20 text-white file:text-white file:bg-green-600 file:border-none"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">PDF File</label>
            <input
              type="file"
              onChange={(e) => setPdfFile(e.target.files[0])}
              required
              accept=".pdf"
              className="p-2 border rounded bg-white/20 text-white file:text-white file:bg-green-600 file:border-none"
            />
          </div>
          <motion.button
            type="submit"
            className={`p-3 rounded text-white font-bold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default UploadMagazine;
