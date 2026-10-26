import { Router } from 'express';
import { NotificationsController } from './notifications.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', NotificationsController.getNotifications);
router.patch('/mark-all-read', NotificationsController.markAllAsRead);
router.patch('/:id/read', NotificationsController.markAsRead);

export default router;
