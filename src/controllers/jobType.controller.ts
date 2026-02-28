import { Request, Response } from 'express';
import JobType from '../models/JobType';

// @desc    Get all job types (with pagination & search)
// @route   GET /api/job-types
export const getJobTypes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const total = await JobType.countDocuments(query);
    const jobTypes = await JobType.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: jobTypes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job type
// @route   GET /api/job-types/:id
export const getJobType = async (req: Request, res: Response) => {
  try {
    const jobType = await JobType.findById(req.params.id);
    if (!jobType) return res.status(404).json({ message: 'Job type not found' });
    res.json(jobType);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create job type
// @route   POST /api/job-types
export const createJobType = async (req: Request, res: Response) => {
  try {
    const jobType = await JobType.create(req.body);
    res.status(201).json(jobType);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update job type
// @route   PUT /api/job-types/:id
export const updateJobType = async (req: Request, res: Response) => {
  try {
    const jobType = await JobType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!jobType) return res.status(404).json({ message: 'Job type not found' });
    res.json(jobType);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete job type
// @route   DELETE /api/job-types/:id
export const deleteJobType = async (req: Request, res: Response) => {
  try {
    const jobType = await JobType.findByIdAndDelete(req.params.id);
    if (!jobType) return res.status(404).json({ message: 'Job type not found' });
    res.json({ message: 'Job type deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
