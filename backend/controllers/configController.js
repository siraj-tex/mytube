import SystemConfig from '../models/SystemConfig.js';

// @desc    Get Current RPM
// @route   GET /api/config/rpm
// @access  Private/Admin
export const getRPM = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({ rpm: 1 });
    }
    res.json({ rpm: config.rpm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update RPM
// @route   PUT /api/config/rpm
// @access  Private/Admin
export const updateRPM = async (req, res) => {
  try {
    const { rpm } = req.body;
    let config = await SystemConfig.findOne();
    
    if (!config) {
      config = await SystemConfig.create({ rpm: rpm || 1 });
    } else {
      config.rpm = rpm !== undefined ? rpm : config.rpm;
      await config.save();
    }
    
    res.json({ message: 'RPM updated', rpm: config.rpm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
