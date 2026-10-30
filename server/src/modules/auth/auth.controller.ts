import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { env } from '../../config/env.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, role, phone, location } = req.body;
      const { user, token } = await AuthService.register(
        { name, email, password, role, phone, location },
        req.ip,
        req.headers['user-agent']
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
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
          preferredLanguage: user.preferredLanguage,
          emailNotifications: user.emailNotifications,
          smsNotifications: user.smsNotifications,
          twoFactorEnabled: user.twoFactorEnabled,
          authProvider: user.authProvider,
          profileCompleted: user.profileCompleted,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(
        { email, password },
        req.ip,
        req.headers['user-agent']
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
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
          preferredLanguage: user.preferredLanguage,
          emailNotifications: user.emailNotifications,
          smsNotifications: user.smsNotifications,
          twoFactorEnabled: user.twoFactorEnabled,
          authProvider: user.authProvider,
          profileCompleted: user.profileCompleted,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { credential } = req.body;
      if (!credential) {
        res.status(400).json({ success: false, message: 'Google credential token is required' });
        return;
      }

      const { user, token, isNewUser } = await AuthService.googleAuth(
        credential,
        req.ip,
        req.headers['user-agent']
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: isNewUser ? 'Google account created successfully' : 'Google sign-in successful',
        token,
        isNewUser,
        user: {
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
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = req.user;
    res.status(200).json({
      success: true,
      user: {
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
      },
    });
  }
}
