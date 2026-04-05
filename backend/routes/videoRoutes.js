import express from 'express';
import {
  uploadVideo,
  getVideos,
  getVideoById,
  incrementView,
  likeVideo,
  dislikeVideo,
  getLikedVideos,
  getSubscriptionsVideos,
  getShortsVideos,
  toggleMonetize,
  registerAdView
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/liked', protect, getLikedVideos);
router.get('/subscriptions', protect, getSubscriptionsVideos);
router.get('/shorts', getShortsVideos);

router.route('/')
  .get(getVideos)
  .post(
    protect,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
    uploadVideo
  );

router.route('/:id').get(getVideoById);
router.route('/:id/view').put(incrementView);
router.route('/:id/like').put(protect, likeVideo);
router.route('/:id/dislike').put(protect, dislikeVideo);
router.route('/:id/monetize').put(protect, toggleMonetize);
router.route('/:id/ad-view').post(registerAdView);

export default router;
