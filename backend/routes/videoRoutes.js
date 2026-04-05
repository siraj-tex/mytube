import express from 'express';
import {
  uploadVideo,
  getVideos,
  getVideoById,
  incrementView,
  likeVideo,
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

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

export default router;
