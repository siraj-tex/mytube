import Video from '../models/Video.js';

// @desc    Upload video & thumbnail
// @route   POST /api/videos
// @access  Private
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, tags, isShort } = req.body;
    
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
      isShort: isShort === 'true' || isShort === true,
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

// @desc    Dislike a video
// @route   PUT /api/videos/:id/dislike
// @access  Private
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.dislikes.includes(req.user._id)) {
      // Remove dislike
      video.dislikes = video.dislikes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Add dislike
      video.dislikes.push(req.user._id);
      // Remove from likes if present
      video.likes = video.likes.filter((id) => id.toString() !== req.user._id.toString());
    }

    await video.save();
    res.status(200).json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get liked videos
// @route   GET /api/videos/liked
// @access  Private
export const getLikedVideos = async (req, res) => {
  try {
    const videos = await Video.find({ likes: req.user._id }).populate('uploader', 'username avatar');
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subscriptions videos
// @route   GET /api/videos/subscriptions
// @access  Private
export const getSubscriptionsVideos = async (req, res) => {
  try {
    const user = await import('../models/User.js').then(m => m.default).then(User => User.findById(req.user._id));
    const videos = await Video.find({ uploader: { $in: user.subscribedChannels } })
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shorts
// @route   GET /api/videos/shorts
// @access  Public
export const getShortsVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isShort: true })
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle monetization for a video
// @route   PUT /api/videos/:id/monetize
// @access  Private
export const toggleMonetize = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Ensure the requester is the uploader
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to change this video' });
    }

    video.isMonetized = !video.isMonetized;
    await video.save();

    res.status(200).json({ isMonetized: video.isMonetized });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register an ad view and update earnings
// @route   POST /api/videos/:id/ad-view
// @access  Public
export const registerAdView = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.isMonetized) {
      const SystemConfig = (await import('../models/SystemConfig.js')).default;
      const User = (await import('../models/User.js')).default;

      let config = await SystemConfig.findOne();
      const currentRPM = config ? config.rpm : 1;

      const earned = currentRPM / 10;

      // Increment video monetizedViews
      video.monetizedViews += 1;
      await video.save();

      // Update uploader earnings
      await User.findByIdAndUpdate(video.uploader, {
        $inc: { accumulatedEarnings: earned }
      });
    }

    res.status(200).json({ message: 'Ad view registered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
