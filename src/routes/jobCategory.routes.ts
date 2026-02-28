import express from 'express';
import { createJobCategory, deleteJobCategory, getJobCategories, getJobCategory, updateJobCategory } from '../controllers/jobCategory.controller';
import { adminOnly, protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getJobCategories).post(protect, adminOnly, createJobCategory);
router.route('/:id').get(getJobCategory).put(protect, adminOnly, updateJobCategory).delete(protect, adminOnly, deleteJobCategory);

export default router;
