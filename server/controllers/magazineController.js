import Magazine from '../models/Magazine.js';

// Upload a new magazine
export const uploadMagazine = async (req, res) => {
  const { title, description, categories, fileUrl, coverImageUrl } = req.body;

  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const magazine = new Magazine({
      title,
      description,
      categories,
      fileUrl,
      coverImageUrl,
      uploadedBy: req.user._id,
    });

    await magazine.save();
    res.status(201).json({ message: 'Magazine uploaded successfully', magazine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading magazine', error: err.message });
  }
};

// Get all magazines (with optional search and category filters)
export const getAllMagazines = async (req, res) => {
  const { category, search } = req.query;

  try {
    const query = {};

    // Filter by category if provided
    if (category) {
      query.categories = { $in: [category] };
    }

    // Search by title or description if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch magazines and populate likes and comments.user fields
    const magazines = await Magazine.find(query)
      .populate('uploadedBy', 'name email') // Populate uploader details
      .populate('likes', 'name') // Populate likes with user names
      .populate('comments.user', 'name'); // Populate comments with user names

    res.status(200).json(magazines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching magazines', error: err.message });
  }
};

// Get all magazines uploaded by the logged-in user
export const getUserMagazines = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const magazines = await Magazine.find({ uploadedBy: req.user._id });
    res.status(200).json(magazines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user magazines', ecccccrror: err.message });
  }
};

//like a magazine
export const likeMagazine = async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);
    if (!magazine) return res.status(404).json({ message: 'Magazine not found' });

    const userId = req.user._id; // Assuming user ID is available in req.user
    const isLiked = magazine.likes.includes(userId);

    if (isLiked) {
      // Unlike the magazine
      magazine.likes = magazine.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like the magazine
      magazine.likes.push(userId);
    }

    await magazine.save();

    // Populate the likes field with user details
    const updatedMagazine = await Magazine.findById(req.params.id).populate('likes', 'name');
    res.status(200).json({ likes: updatedMagazine.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error liking magazine', error: err.message });
  }
};


//add a comment to a magazine
export const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const magazine = await Magazine.findById(req.params.id);
    if (!magazine) return res.status(404).json({ message: 'Magazine not found' });

    // Add the comment to the magazine
    magazine.comments.push({ user: req.user._id, text });
    await magazine.save();

    // Populate the comments with user details
    const updatedMagazine = await Magazine.findById(req.params.id).populate('comments.user', 'name');
    res.status(201).json({ message: 'Comment added', comments: updatedMagazine.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};