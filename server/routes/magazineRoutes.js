import express from 'express';
import {
  uploadMagazine,
  getAllMagazines,
  getUserMagazines,
  likeMagazine,
  addComment,
} from '../controllers/magazineController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import Magazine from '../models/Magazine.js'; // Import the Magazine model

const router = express.Router();

// Upload a new magazine
router.post('/upload', isAuthenticated, uploadMagazine);

// Get all magazines
router.get('/', getAllMagazines);

// Get all magazines uploaded by the logged-in user
router.get('/user-magazines', isAuthenticated, async (req, res) => {
  try {
    const magazines = await Magazine.find({ uploadedBy: req.user._id });
    res.status(200).json(magazines); // Return the magazines
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user magazines', error: err.message });
  }
});

// Like a magazine
router.post('/:id/like', isAuthenticated, likeMagazine);

// Add a comment to a magazine
router.post('/:id/comment', isAuthenticated, addComment);


// Update a magazine
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const magazine = await Magazine.findOne({ _id: req.params.id, uploadedBy: req.user._id });
    if (!magazine) {
      return res.status(404).json({ message: 'Magazine not found or not authorized to update' });
    }

    const { title, description, categories, fileUrl, coverImageUrl } = req.body;
    magazine.title = title || magazine.title;
    magazine.description = description || magazine.description;
    magazine.categories = categories || magazine.categories;
    magazine.fileUrl = fileUrl || magazine.fileUrl;
    magazine.coverImageUrl = coverImageUrl || magazine.coverImageUrl;

    await magazine.save();
    res.status(200).json({ message: 'Magazine updated successfully', magazine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating magazine', error: err.message });
  }
});

// Delete a magazine
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const magazine = await Magazine.findOneAndDelete({ _id: req.params.id, uploadedBy: req.user._id });
    if (!magazine) {
      return res.status(404).json({ message: 'Magazine not found or not authorized to delete' });
    }

    res.status(200).json({ message: 'Magazine deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting magazine', error: err.message });
  }
});

export default router;