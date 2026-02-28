import express from 'express';
import { createLocation, deleteLocation, getLocation, getLocations, updateLocation } from '../controllers/location.controller';
import { adminOnly, protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getLocations).post(protect, adminOnly, createLocation);
router.route('/:id').get(getLocation).put(protect, adminOnly, updateLocation).delete(protect, adminOnly, deleteLocation);

export default router;
