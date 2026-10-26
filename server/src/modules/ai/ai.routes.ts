import { Router } from 'express';
import { AIController } from './ai.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { aiRateLimiter } from '../../middleware/rateLimit.js';

const router = Router();

router.use(authenticate);

router.post('/chat', aiRateLimiter, AIController.chat);
router.get('/conversations', AIController.getConversations);
router.get('/conversations/:id', AIController.getConversationById);
router.delete('/conversations/:id', AIController.deleteConversation);
router.post('/tools/confirm', AIController.confirmToolAction);

export default router;
