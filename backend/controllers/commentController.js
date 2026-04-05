import Comment from '../models/Comment.js';

// @desc    Get comments for a video
// @route   GET /api/comments/:videoId
// @access  Public
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    const comment = await Comment.create({
      videoId,
      userId: req.user._id,
      text,
    });

    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username avatar');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author or an admin
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
