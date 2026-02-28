import express from 'express';
import { createJob, deleteJob, getJob, getJobs, updateJob } from '../controllers/job.controller';
import { adminOnly, protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getJobs).post(protect, adminOnly, createJob);
router.route('/:id').get(getJob).put(protect, adminOnly, updateJob).delete(protect, adminOnly, deleteJob);

export default router;
