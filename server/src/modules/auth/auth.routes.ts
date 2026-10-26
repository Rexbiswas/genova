import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { authRateLimiter } from '../../middleware/rateLimit.js';

const router = Router();

const registerSchema = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: z.enum(['patient', 'doctor', 'clinic_staff', 'admin']).optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().optional(),
  }),
};

router.post('/register', authRateLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.me);

export default router;
