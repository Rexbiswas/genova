import { Request, Response, NextFunction } from 'express';
import { Doctor } from '../../models/Doctor.js';

export class DoctorsController {
  static async getDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, specialty, city, recommended } = req.query;

      const filter: Record<string, any> = {};

      if (specialty && typeof specialty === 'string' && specialty !== 'All') {
        filter.specialty = new RegExp(specialty, 'i');
      }

      if (city && typeof city === 'string') {
        filter.city = new RegExp(city, 'i');
      }

      if (recommended === 'true') {
        filter.isRecommended = true;
      }

      if (q && typeof q === 'string' && q.trim()) {
        const regex = new RegExp(q.trim(), 'i');
        filter.$or = [
          { name: regex },
          { specialty: regex },
          { role: regex },
          { city: regex },
          { about: regex },
        ];
      }

      const docs = await Doctor.find(filter).sort({ isRecommended: -1, rating: -1 });

      const mapped = docs.map(d => ({
        id: d.slugId,
        slugId: d.slugId,
        _id: d._id.toString(),
        name: d.name,
        specialty: d.specialty,
        role: d.role,
        image: d.image,
        address: d.address,
        city: d.city,
        price: d.price,
        currency: d.currency,
        experienceYears: d.experienceYears,
        rating: d.rating,
        reviewCount: d.reviewCount,
        about: d.about,
        education: d.education,
        languages: d.languages,
        isRecommended: d.isRecommended,
        distanceKm: d.distanceKm,
        availability: d.availability,
      }));

      res.json(mapped);
    } catch (err) {
      next(err);
    }
  }

  static async getDoctorById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const doc = await Doctor.findOne({
        $or: [{ slugId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
      });

      if (!doc) {
        res.status(404).json({ success: false, message: 'Doctor not found' });
        return;
      }

      res.json({
        id: doc.slugId,
        _id: doc._id.toString(),
        name: doc.name,
        specialty: doc.specialty,
        role: doc.role,
        image: doc.image,
        address: doc.address,
        city: doc.city,
        price: doc.price,
        currency: doc.currency,
        experienceYears: doc.experienceYears,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        about: doc.about,
        education: doc.education,
        languages: doc.languages,
        isRecommended: doc.isRecommended,
        distanceKm: doc.distanceKm,
        availability: doc.availability,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDoctorAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const { date } = req.query;

      const doc = await Doctor.findOne({
        $or: [{ slugId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
      });

      if (!doc) {
        res.status(404).json({ success: false, message: 'Doctor not found' });
        return;
      }

      if (date && typeof date === 'string') {
        const found = doc.availability.find(a => a.date === date);
        const slots = found ? found.slots : ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'];
        res.json({ doctorId: doc.slugId, date, slots });
        return;
      }

      res.json({ doctorId: doc.slugId, availability: doc.availability });
    } catch (err) {
      next(err);
    }
  }
}
