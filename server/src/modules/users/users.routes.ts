import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/me', UsersController.getMe);
router.patch('/me', UsersController.updateMe);
router.post('/me/upgrade-pro', UsersController.upgradeToPro);

export default router;
