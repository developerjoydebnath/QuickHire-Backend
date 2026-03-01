import { Request, Response } from 'express';
import JobCategory from '../models/JobCategory';

// @desc    Get all job categories (with pagination & search)
// @route   GET /api/job-categories
export const getJobCategories = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const total = await JobCategory.countDocuments(query);
    const categories = await JobCategory.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'jobs', // Assuming the collection name is 'jobs'
          localField: '_id',
          foreignField: 'categories',
          as: 'jobs',
        },
      },
      {
        $addFields: {
          count: { $size: '$jobs' },
        },
      },
      { $project: { jobs: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    res.json({
      data: categories,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job category
// @route   GET /api/job-categories/:id
export const getJobCategory = async (req: Request, res: Response) => {
  try {
    const category = await JobCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create job category
// @route   POST /api/job-categories
export const createJobCategory = async (req: Request, res: Response) => {
  try {
    const category = await JobCategory.create(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update job category
// @route   PUT /api/job-categories/:id
export const updateJobCategory = async (req: Request, res: Response) => {
  try {
    const category = await JobCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete job category
// @route   DELETE /api/job-categories/:id
export const deleteJobCategory = async (req: Request, res: Response) => {
  try {
    const category = await JobCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
