import User from '../models/User.js';

// @desc    Toggle Subscribe to a channel
// @route   PUT /api/users/subscribe/:id
// @access  Private
export const toggleSubscribe = async (req, res) => {
  try {
    const userToSubscribeTo = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToSubscribeTo) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.params.id === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot subscribe to yourself' });
    }

    if (currentUser.subscribedChannels.includes(req.params.id)) {
      // Unsubscribe
      currentUser.subscribedChannels = currentUser.subscribedChannels.filter(
        (id) => id.toString() !== req.params.id
      );
      userToSubscribeTo.subscribers -= 1;
    } else {
      // Subscribe
      currentUser.subscribedChannels.push(req.params.id);
      userToSubscribeTo.subscribers += 1;
    }

    await currentUser.save();
    await userToSubscribeTo.save();

    res.status(200).json({ 
        subscribers: userToSubscribeTo.subscribers,
        subscribedChannels: currentUser.subscribedChannels 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add video to watch history
// @route   PUT /api/users/history/:videoId
// @access  Private
export const addHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Remove if already in history to move to top
    user.history = user.history.filter(h => h.videoId.toString() !== req.params.videoId);
    
    user.history.unshift({ videoId: req.params.videoId, watchedAt: Date.now() });

    // Optional: limit history size
    if (user.history.length > 50) {
      user.history.pop();
    }

    await user.save();
    res.status(200).json({ message: 'History updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user history
// @route   GET /api/users/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
        path: 'history.videoId',
        populate: { path: 'uploader', select: 'username avatar' }
    });
    // Filter out null videos (in case a video was deleted)
    const validHistory = user.history.filter(h => h.videoId !== null);
    res.status(200).json(validHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Save a video
// @route   PUT /api/users/save/:videoId
// @access  Private
export const toggleSaveVideo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.savedVideos.includes(req.params.videoId)) {
      // Unsave
      user.savedVideos = user.savedVideos.filter(id => id.toString() !== req.params.videoId);
    } else {
      // Save
      user.savedVideos.push(req.params.videoId);
    }

    await user.save();
    res.status(200).json({ savedVideos: user.savedVideos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get saved videos
// @route   GET /api/users/saved
// @access  Private
export const getSavedVideos = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
        path: 'savedVideos',
        populate: { path: 'uploader', select: 'username avatar' }
    });
    // Return only the valid populated videos
    const validSaved = user.savedVideos.filter(v => v !== null);
    res.status(200).json(validSaved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
