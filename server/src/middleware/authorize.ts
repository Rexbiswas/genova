import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate.js';
import { UserRole } from '../models/User.js';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' lacks permission for this action.`,
      });
      return;
    }

    next();
  };
}
