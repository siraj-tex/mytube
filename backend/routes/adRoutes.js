import express from 'express';
import {
  uploadAd,
  getRandomAd,
  getAds,
  deleteAd
} from '../controllers/adController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(
    protect,
    admin,
    upload.fields([
      { name: 'media', maxCount: 1 }
    ]),
    uploadAd
  )
  .get(protect, admin, getAds);

router.get('/random', getRandomAd);

router.route('/:id').delete(protect, admin, deleteAd);

export default router;
