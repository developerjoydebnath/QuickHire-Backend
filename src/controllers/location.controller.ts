import { Request, Response } from 'express';
import Location from '../models/Location';

// @desc    Get all locations (with pagination & search)
// @route   GET /api/locations
export const getLocations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const country = req.query.country as string || '';

    const query: any = {};
    if (search) {
      query.$or = [
        { state: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }
    if (country) {
      query.country = country;
    }

    const total = await Location.countDocuments(query);
    const locations = await Location.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: locations,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
export const getLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create location
// @route   POST /api/locations
export const createLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
export const updateLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json({ message: 'Location deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
