import express from 'express';
import {
  toggleSubscribe,
  addHistory,
  getHistory,
  toggleSaveVideo,
  getSavedVideos,
  getUserProfile,
  updateProfile,
  createCommunityPost,
  getCommunityPosts
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.put('/subscribe/:id', protect, toggleSubscribe);

router.route('/profile')
  .put(protect, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateProfile);

router.get('/profile/:id', getUserProfile);

router.route('/community')
  .post(protect, createCommunityPost);
router.get('/community/:userId', getCommunityPosts);

router.route('/history')
  .get(protect, getHistory);
router.put('/history/:videoId', protect, addHistory);

router.route('/saved')
  .get(protect, getSavedVideos);
router.put('/save/:videoId', protect, toggleSaveVideo);

export default router;
