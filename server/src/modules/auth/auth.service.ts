import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../../models/User.js';
import { env } from '../../config/env.js';
import { AuditEvent } from '../../models/AuditEvent.js';

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  phone?: string;
  location?: string;
}

export interface LoginInput {
  email: string;
  password?: string;
}

export class AuthService {
  static generateToken(user: IUser): string {
    return jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        email: user.email,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static async register(input: RegisterInput, ip?: string, userAgent?: string): Promise<{ user: IUser; token: string }> {
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      throw { statusCode: 409, message: 'An account with this email address already exists.' };
    }

    let hashedPassword = undefined;
    if (input.password) {
      hashedPassword = await bcrypt.hash(input.password, 10);
    } else {
      // Default dev fallback password
      hashedPassword = await bcrypt.hash('GenovaPatient2026!', 10);
    }

    const newUser = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: hashedPassword,
      role: input.role || 'patient',
      phone: input.phone || '',
      location: input.location || 'Braga, Portugal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      tier: 'Standard',
      preferredLanguage: 'en',
    });

    const token = this.generateToken(newUser);

    await AuditEvent.create({
      userId: newUser._id,
      actorRole: newUser.role,
      action: 'user_register',
      resourceType: 'User',
      resourceId: newUser._id.toString(),
      ipAddress: ip,
      userAgent,
      status: 'success',
    });

    return { user: newUser, token };
  }

  static async login(input: LoginInput, ip?: string, userAgent?: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
    if (!user) {
      await AuditEvent.create({
        action: 'user_login',
        resourceType: 'User',
        details: { attemptedEmail: input.email },
        ipAddress: ip,
        userAgent,
        status: 'failure',
      });
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    if (input.password && user.password) {
      const match = await bcrypt.compare(input.password, user.password);
      if (!match) {
        await AuditEvent.create({
          userId: user._id,
          actorRole: user.role,
          action: 'user_login',
          resourceType: 'User',
          resourceId: user._id.toString(),
          ipAddress: ip,
          userAgent,
          status: 'failure',
        });
        throw { statusCode: 401, message: 'Invalid email or password.' };
      }
    }

    const token = this.generateToken(user);

    await AuditEvent.create({
      userId: user._id,
      actorRole: user.role,
      action: 'user_login',
      resourceType: 'User',
      resourceId: user._id.toString(),
      ipAddress: ip,
      userAgent,
      status: 'success',
    });

    return { user, token };
  }
}
