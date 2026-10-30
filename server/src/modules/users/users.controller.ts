import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { User } from '../../models/User.js';

export class UsersController {
  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      res.json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar,
        role: user.role,
        tier: user.tier,
        bloodGroup: user.bloodGroup,
        dob: user.dob,
        emergencyContact: user.emergencyContact,
        preferredLanguage: user.preferredLanguage,
        emailNotifications: user.emailNotifications,
        smsNotifications: user.smsNotifications,
        twoFactorEnabled: user.twoFactorEnabled,
        authProvider: user.authProvider,
        profileCompleted: user.profileCompleted,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const allowedFields = [
        'name',
        'phone',
        'location',
        'avatar',
        'bloodGroup',
        'dob',
        'emergencyContact',
        'preferredLanguage',
        'emailNotifications',
        'smsNotifications',
        'twoFactorEnabled',
        'profileCompleted',
      ];

      const updates: Record<string, any> = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      const updatedUser = await User.findByIdAndUpdate(req.user!._id, updates, { new: true });
      if (!updatedUser) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        tier: updatedUser.tier,
        bloodGroup: updatedUser.bloodGroup,
        dob: updatedUser.dob,
        emergencyContact: updatedUser.emergencyContact,
        preferredLanguage: updatedUser.preferredLanguage,
        emailNotifications: updatedUser.emailNotifications,
        smsNotifications: updatedUser.smsNotifications,
        twoFactorEnabled: updatedUser.twoFactorEnabled,
        authProvider: updatedUser.authProvider,
        profileCompleted: updatedUser.profileCompleted,
      });
    } catch (err) {
      next(err);
    }
  }

  static async upgradeToPro(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user!._id,
        { tier: 'Pro' },
        { new: true }
      );
      res.json({
        success: true,
        message: 'Successfully upgraded to Genova Pro',
        tier: updatedUser?.tier,
      });
    } catch (err) {
      next(err);
    }
  }
}
