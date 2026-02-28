import { Request, Response } from 'express';
import Application from '../models/Application';
import Company from '../models/Company';
import Job from '../models/Job';
import JobCategory from '../models/JobCategory';
import JobType from '../models/JobType';
import Location from '../models/Location';

// @desc    Get dashboard stats
// @route   GET /api/stats
// @access  Admin
export const getStats = async (_req: Request, res: Response) => {
  try {
    const [categories, locations, companies, jobTypes, jobs, applications] = await Promise.all([
      JobCategory.countDocuments(),
      Location.countDocuments(),
      Company.countDocuments(),
      JobType.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      categories,
      locations,
      companies,
      jobTypes,
      jobs,
      applications,
      applicationsByStatus,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
