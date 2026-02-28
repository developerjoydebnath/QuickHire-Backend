import { Request, Response } from 'express';
import Company from '../models/Company';

// @desc    Get all companies (with pagination & search & filter)
// @route   GET /api/companies
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const location = req.query.location as string || '';

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (location) {
      query.location = location;
    }

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .populate('location')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: companies,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
export const getCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id).populate('location');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create company
// @route   POST /api/companies
export const createCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
