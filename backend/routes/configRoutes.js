import express from 'express';
import {
  getRPM,
  updateRPM
} from '../controllers/configController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/rpm')
  .get(protect, admin, getRPM)
  .put(protect, admin, updateRPM);

export default router;
