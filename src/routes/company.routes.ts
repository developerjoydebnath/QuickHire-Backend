import express from 'express';
import { createCompany, deleteCompany, getCompanies, getCompany, updateCompany } from '../controllers/company.controller';
import { adminOnly, protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getCompanies).post(protect, adminOnly, createCompany);
router.route('/:id').get(getCompany).put(protect, adminOnly, updateCompany).delete(protect, adminOnly, deleteCompany);

export default router;
