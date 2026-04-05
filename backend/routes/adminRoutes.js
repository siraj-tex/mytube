import express from 'express';
import {
  getStats,
  getUsers,
  toggleBanUser,
  deleteUser,
  getAdminVideos,
  deleteVideo,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.route('/stats').get(getStats);
router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/users/:id/ban').put(toggleBanUser);

router.route('/videos').get(getAdminVideos);
router.route('/videos/:id').delete(deleteVideo);

export default router;
