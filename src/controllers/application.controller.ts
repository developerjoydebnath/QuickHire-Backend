import crypto from 'crypto';
import { Request, Response } from 'express';
import Application from '../models/Application';
import User from '../models/User';

// @desc    Get all applications (admin: with pagination, search & filter)
// @route   GET /api/applications
export const getApplications = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const job = req.query.job as string || '';
    const status = req.query.status as string || '';

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (job) {
      query.job = job;
    }
    if (status) {
      query.status = status;
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate({ path: 'job', select: 'title company', populate: { path: 'company', select: 'name' } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: applications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
export const getApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({ path: 'job', populate: [{ path: 'company' }, { path: 'location' }] })
      .populate('user', 'name email');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create application (user applies for a job)
// @route   POST /api/applications
export const createApplication = async (req: Request, res: Response) => {
  try {
    const applicationData = {
      ...req.body,
      user: req.user?._id || undefined,
    };
    const application = await Application.create(applicationData);
    res.status(201).json(application);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
export const updateApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for a job (Public) - creates user if doesn't exist
// @route   POST /api/applications/apply
export const applyForJob = async (req: Request, res: Response) => {
  try {
    const { name, email, resume_link, cover_note, job } = req.body;
    let user = await User.findOne({ email });
    let isNewUser = false;
    let generatedPassword = '';

    if (!user) {
      // Create user with random password
      generatedPassword = crypto.randomBytes(6).toString('hex');
      user = await User.create({
        name,
        email,
        password: generatedPassword,
        role: 'user', // Default role
      });
      isNewUser = true;
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ job, user: user._id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    const application = await Application.create({
      job,
      user: user._id,
      name,
      email,
      resume_link,
      cover_note,
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application,
      isNewUser,
      password: isNewUser ? generatedPassword : null,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Something went wrong' });
  }
};

// @desc    Get logged in user applications
// @route   GET /api/applications/my-applications
export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate({ path: 'job', populate: [{ path: 'company' }, { path: 'location' }, { path: 'job_type' }] })
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
