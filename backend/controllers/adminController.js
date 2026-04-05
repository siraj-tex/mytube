import User from '../models/User.js';
import Video from '../models/Video.js';
import Comment from '../models/Comment.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalComments = await Comment.countDocuments();

    const videos = await Video.find({}, 'views');
    const totalViews = videos.reduce((acc, video) => acc + video.views, 0);

    // Simple traffic generation mock - Last 30 days based on views/videos if possible, or just mock it
    const last30DaysTraffic = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      views: Math.floor(Math.random() * 50) + 10, // Mocked traffic points
    }));

    res.json({
      totalUsers,
      totalVideos,
      totalViews,
      totalComments,
      last30DaysTraffic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ban or Unban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot ban an admin' });
      }
      user.isBanned = !user.isBanned;
      const updatedUser = await user.save();
      res.json({ message: `User ${updatedUser.isBanned ? 'banned' : 'unbanned'}`, isBanned: updatedUser.isBanned });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete an admin' });
    }

    await User.findByIdAndDelete(req.params.id);
    await Video.deleteMany({ uploader: req.params.id });
    await Comment.deleteMany({ userId: req.params.id });

    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all videos
// @route   GET /api/admin/videos
// @access  Private/Admin
export const getAdminVideos = async (req, res) => {
  try {
    const videos = await Video.find({}).populate('uploader', 'username');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a video
// @route   DELETE /api/admin/videos/:id
// @access  Private/Admin
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    await Video.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ videoId: req.params.id });
    res.json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
