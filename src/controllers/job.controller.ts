import { Request, Response } from 'express';
import Job from '../models/Job';

// @desc    Get all jobs (with pagination, search & filter)
// @route   GET /api/jobs
export const getJobs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const category = req.query.category as string || '';
    const location = req.query.location as string || '';
    const company = req.query.company as string || '';
    const job_type = req.query.job_type as string || '';

    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.categories = category;
    }
    if (location) {
      query.location = location;
    }
    if (company) {
      query.company = company;
    }
    if (job_type) {
      query.job_type = job_type;
    }

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('categories')
      .populate('location')
      .populate({ path: 'company', populate: { path: 'location' } })
      .populate('job_type')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: jobs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
export const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('categories')
      .populate('location')
      .populate({ path: 'company', populate: { path: 'location' } })
      .populate('job_type');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create job
// @route   POST /api/jobs
export const createJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
