import { Router } from 'express';
import { DoctorsController } from './doctors.controller.js';

const router = Router();

router.get('/', DoctorsController.getDoctors);
router.get('/:id', DoctorsController.getDoctorById);
router.get('/:id/availability', DoctorsController.getDoctorAvailability);

export default router;
