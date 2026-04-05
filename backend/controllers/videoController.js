import Video from '../models/Video.js';

// @desc    Upload video & thumbnail
// @route   POST /api/videos
// @access  Private
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    // Expecting req.files to contain 'video' and 'thumbnail'
    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({ message: 'Please provide both video and thumbnail files' });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    // Build the URLs for local static files
    const videoUrl = `http://localhost:5000/uploads/${videoFile.filename}`;
    const thumbnailUrl = `http://localhost:5000/uploads/${thumbnailFile.filename}`;

    const parsedTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      uploader: req.user._id,
      tags: parsedTags,
    });

    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          title: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};

    const videos = await Video.find({ ...keyword })
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploader', 'username avatar subscribers');
    
    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment view count
// @route   PUT /api/videos/:id/view
// @access  Public
export const incrementView = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (video) {
      res.status(200).json({ message: 'View incremented' });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a video
// @route   PUT /api/videos/:id/like
// @access  Private
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.likes.includes(req.user._id)) {
      // Unlike
      video.likes = video.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Like
      video.likes.push(req.user._id);
      // Remove from dislikes if present
      video.dislikes = video.dislikes.filter((id) => id.toString() !== req.user._id.toString());
    }

    await video.save();
    res.status(200).json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
