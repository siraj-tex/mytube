import Ad from '../models/Ad.js';

// @desc    Upload an Ad
// @route   POST /api/ads
// @access  Private/Admin
export const uploadAd = async (req, res) => {
  try {
    const { title, type } = req.body;

    if (!req.files || !req.files.media) {
      return res.status(400).json({ message: 'Please provide media file' });
    }

    const mediaFile = req.files.media[0];
    const mediaUrl = `http://localhost:5000/uploads/${mediaFile.filename}`;

    const ad = await Ad.create({
      title,
      type,
      mediaUrl,
      uploader: req.user._id,
    });

    res.status(201).json(ad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get random Ad
// @route   GET /api/ads/random
// @access  Public
export const getRandomAd = async (req, res) => {
  try {
    const count = await Ad.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No ads available' });
    }

    const random = Math.floor(Math.random() * count);
    const ad = await Ad.findOne().skip(random);

    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Ads
// @route   GET /api/ads
// @access  Private/Admin
export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find().populate('uploader', 'username');
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Ad
// @route   DELETE /api/ads/:id
// @access  Private/Admin
export const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (ad) {
      await Ad.deleteOne({ _id: ad._id });
      res.json({ message: 'Ad removed' });
    } else {
      res.status(404).json({ message: 'Ad not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
