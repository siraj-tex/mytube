import express from 'express';
import {
  toggleSubscribe,
  addHistory,
  getHistory,
  toggleSaveVideo,
  getSavedVideos,
  getUserProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/subscribe/:id', protect, toggleSubscribe);

router.get('/profile/:id', getUserProfile);

router.route('/history')
  .get(protect, getHistory);
router.put('/history/:videoId', protect, addHistory);

router.route('/saved')
  .get(protect, getSavedVideos);
router.put('/save/:videoId', protect, toggleSaveVideo);

export default router;
