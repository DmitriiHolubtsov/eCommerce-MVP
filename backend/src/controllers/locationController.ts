import { Request, Response } from 'express';
import Location from '../models/Location';

export const getLocations = async (_req: Request, res: Response) => {
  try {
    const locations = await Location.find();
    console.log('Fetched locations:', locations);
    if (!locations || locations.length === 0) {
      return res.status(404).json({ message: 'No locations found' });
    }
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Server error fetching locations' });
  }
};
