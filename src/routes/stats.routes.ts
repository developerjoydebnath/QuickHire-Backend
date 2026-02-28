import express from 'express';
import { getStats } from '../controllers/stats.controller';
import { adminOnly, protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', protect, adminOnly, getStats);

export default router;
