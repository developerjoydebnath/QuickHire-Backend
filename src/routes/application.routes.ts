import express from 'express';
import { applyForJob, createApplication, deleteApplication, getApplication, getApplications, getMyApplications, updateApplication } from '../controllers/application.controller';
import { adminOnly, protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/apply').post(applyForJob);
router.route('/my-applications').get(protect, getMyApplications);
router.route('/').get(protect, adminOnly, getApplications).post(protect, createApplication);
router.route('/:id').get(protect, adminOnly, getApplication).put(protect, adminOnly, updateApplication).delete(protect, adminOnly, deleteApplication);

export default router;
