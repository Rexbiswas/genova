import { Router } from 'express';
import { AppointmentsController } from './appointments.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', AppointmentsController.getMyAppointments);
router.post('/', AppointmentsController.createAppointment);
router.get('/:id', AppointmentsController.getAppointmentById);
router.patch('/:id', AppointmentsController.rescheduleAppointment);
router.delete('/:id', AppointmentsController.cancelAppointment);

export default router;
