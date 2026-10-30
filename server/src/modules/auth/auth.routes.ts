import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import { authRateLimiter } from '../../middleware/rateLimit.js';

const router = Router();

const registerSchema = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please provide a valid email address').toLowerCase().trim(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phone: z.string().optional(),
    location: z.string().optional(),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().email('Please provide a valid email address').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
  }),
};

const googleSchema = {
  body: z.object({
    credential: z.string().min(10, 'Google credential token is required'),
  }),
};

router.post('/register', authRateLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/google', authRateLimiter, validateRequest(googleSchema), AuthController.googleLogin);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.me);

export default router;
