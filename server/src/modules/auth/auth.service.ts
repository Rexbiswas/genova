import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
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
    const normalizedEmail = input.email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw { statusCode: 409, message: 'An account with this email address already exists.' };
    }

    if (!input.password || input.password.length < 6) {
      throw { statusCode: 400, message: 'Password must be at least 6 characters long.' };
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const newUser = await User.create({
      name: input.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'patient', // New self-registered users are strictly patients
      phone: input.phone || '',
      location: input.location || 'Braga, Portugal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      tier: 'Standard',
      preferredLanguage: 'en',
      authProvider: 'local',
      profileCompleted: false, // Local registration requires completing profile
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
    const normalizedEmail = input.email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      await AuditEvent.create({
        action: 'user_login',
        resourceType: 'User',
        details: { attemptedEmail: normalizedEmail },
        ipAddress: ip,
        userAgent,
        status: 'failure',
      });
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    if (!user.password) {
      throw {
        statusCode: 400,
        message: 'This account was registered with Google. Please use Continue with Google.',
      };
    }

    if (!input.password) {
      throw { statusCode: 400, message: 'Password is required.' };
    }

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

  static async googleAuth(credential: string, ip?: string, userAgent?: string): Promise<{ user: IUser; token: string; isNewUser: boolean }> {
    let email: string;
    let name: string;
    let picture: string | undefined;
    let googleSub: string;

    if (env.GOOGLE_CLIENT_ID) {
      try {
        const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email || !payload.email_verified) {
          throw { statusCode: 401, message: 'Google identity verification failed: Unverified email address.' };
        }

        // Validate issuer
        const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
        if (!validIssuers.includes(payload.iss)) {
          throw { statusCode: 401, message: 'Google identity verification failed: Invalid token issuer.' };
        }

        // Validate expiration
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          throw { statusCode: 401, message: 'Google identity verification failed: Token expired.' };
        }

        email = payload.email.toLowerCase();
        name = payload.name || payload.email.split('@')[0];
        picture = payload.picture;
        googleSub = payload.sub;
      } catch (err: any) {
        if (err.statusCode) throw err;
        throw { statusCode: 401, message: `Google verification error: ${err.message || 'Invalid token'}` };
      }
    } else {
      // Mock / Dev verification when GOOGLE_CLIENT_ID is not configured in environment
      if (credential.startsWith('mock-google-token') || credential.includes('.')) {
        try {
          const parts = credential.split('.');
          let payloadObj: any = null;
          for (const part of parts) {
            try {
              const decodedStr = Buffer.from(part, 'base64').toString('utf8');
              const parsed = JSON.parse(decodedStr);
              if (parsed && (parsed.email || parsed.sub)) {
                payloadObj = parsed;
                break;
              }
            } catch {
              // try next part
            }
          }

          if (payloadObj && payloadObj.email) {
            email = payloadObj.email.toLowerCase();
            name = payloadObj.name || payloadObj.email.split('@')[0];
            picture = payloadObj.picture;
            googleSub = payloadObj.sub || `mock-sub-${Date.now()}`;
          } else {
            const decoded = jwt.decode(credential) as any;
            if (decoded && decoded.email) {
              email = decoded.email.toLowerCase();
              name = decoded.name || decoded.email.split('@')[0];
              picture = decoded.picture;
              googleSub = decoded.sub || `mock-sub-${Date.now()}`;
            } else {
              email = 'google.user@example.com';
              name = 'Google User';
              googleSub = `mock-google-sub-${Date.now()}`;
            }
          }
        } catch {
          email = 'google.user@example.com';
          name = 'Google User';
          googleSub = `mock-google-sub-${Date.now()}`;
        }
      } else {
        throw {
          statusCode: 400,
          message: 'GOOGLE_CLIENT_ID is not configured on the server. Please set GOOGLE_CLIENT_ID in server/.env',
        };
      }
    }

    let isNewUser = false;
    let user = await User.findOne({
      $or: [{ googleId: googleSub }, { email }],
    });

    if (user) {
      // Link googleId if missing and email matches verified Google account
      if (!user.googleId) {
        user.googleId = googleSub;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      // Create new user securely
      isNewUser = true;
      user = await User.create({
        name,
        email,
        googleId: googleSub,
        avatar: picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
        authProvider: 'google',
        role: 'patient',
        tier: 'Standard',
        phone: '',
        location: '',
        dob: '',
        bloodGroup: 'O+',
        preferredLanguage: 'en',
        isVerified: true,
        profileCompleted: false, // New Google sign-in requires profile completion
      });
    }

    const token = this.generateToken(user);

    await AuditEvent.create({
      userId: user._id,
      actorRole: user.role,
      action: isNewUser ? 'user_google_register' : 'user_google_login',
      resourceType: 'User',
      resourceId: user._id.toString(),
      ipAddress: ip,
      userAgent,
      status: 'success',
    });

    return { user, token, isNewUser };
  }
}
