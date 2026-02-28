import express from 'express';
import { createJobType, deleteJobType, getJobType, getJobTypes, updateJobType } from '../controllers/jobType.controller';
import { adminOnly, protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getJobTypes).post(protect, adminOnly, createJobType);
router.route('/:id').get(getJobType).put(protect, adminOnly, updateJobType).delete(protect, adminOnly, deleteJobType);

export default router;
