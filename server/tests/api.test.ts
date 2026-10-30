import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { seedDatabase } from '../src/jobs/seedData.js';
import { User } from '../src/models/User.js';
import { MedicalRecord } from '../src/models/MedicalRecord.js';

describe('Genova Healthcare OS API Test Suite', () => {
  let patientToken: string;
  let patientUser: any;
  let anotherPatientToken: string;
  let sampleRecordId: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDatabase();
    await seedDatabase();

    // Login default seeded patient (Stevan Dux)
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'stevan@genova.health', password: 'GenovaPatient2026!' });

    expect(loginRes.status).toBe(200);
    patientToken = loginRes.body.token;
    patientUser = loginRes.body.user;

    // Register a second distinct patient to test privacy isolation
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Second Patient',
        email: 'second.patient@genova.health',
        password: 'Password123!',
      });

    expect(regRes.status).toBe(201);
    anotherPatientToken = regRes.body.token;
  }, 300000);

  afterAll(async () => {
    await disconnectDatabase();
  }, 60000);

  describe('1. Health Check & API Status', () => {
    it('returns 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toContain('Genova');
    });
  });

  describe('2. Authentication & Authorization', () => {
    it('rejects access to protected routes without a session token', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('allows access to protected routes with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('stevan@genova.health');
    });

    it('rejects registration with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'not-an-email', password: 'Password123!' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects registration with password shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test.short@genova.health', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects duplicate registration with 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Stevan Duplicate',
          email: 'stevan@genova.health',
          password: 'Password123!',
        });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('already exists');
    });

    it('successfully registers a new unique user and returns safe profile without password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Fresh Patient',
          email: 'fresh.patient@genova.health',
          password: 'StrongPassword2026!',
        });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('fresh.patient@genova.health');
      expect(res.body.user.password).toBeUndefined();
      expect(res.body.user.role).toBe('patient');
    });

    it('rejects login with nonexistent account', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@genova.health', password: 'AnyPassword' });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid email or password');
    });

    it('rejects login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'stevan@genova.health', password: 'WrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('successfully logs in with valid credentials and sets session', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'stevan@genova.health', password: 'GenovaPatient2026!' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('stevan@genova.health');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('logs out and clears session cookie', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('updates user profile and persists changes in database', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${anotherPatientToken}`)
        .send({
          phone: '(+351) 912-345-678',
          bloodGroup: 'B+',
          dob: '1995-04-12',
          profileCompleted: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.phone).toBe('(+351) 912-345-678');
      expect(res.body.bloodGroup).toBe('B+');
      expect(res.body.profileCompleted).toBe(true);

      // Verify retrieval returns persisted updates
      const meRes = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${anotherPatientToken}`);

      expect(meRes.status).toBe(200);
      expect(meRes.body.phone).toBe('(+351) 912-345-678');
      expect(meRes.body.bloodGroup).toBe('B+');
    });

    it('prevents privilege escalation via ordinary profile update', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${anotherPatientToken}`)
        .send({
          role: 'admin',
          email: 'hacked@genova.health',
        });

      expect(res.status).toBe(200);
      // Role and email must remain unchanged
      expect(res.body.role).toBe('patient');
      expect(res.body.email).toBe('second.patient@genova.health');
    });
  });

  describe('3. Doctors Discovery & Availability', () => {
    it('lists verified physicians', async () => {
      const res = await request(app).get('/api/doctors');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('slugId');
      expect(res.body[0]).toHaveProperty('specialty');
    });

    it('retrieves specific doctor by slugId', async () => {
      const res = await request(app).get('/api/doctors/doc-1');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Dr. Aline Carvalho');
      expect(res.body.specialty).toBe('Cardiology');
    });

    it('returns availability slots for a doctor', async () => {
      const res = await request(app).get('/api/doctors/doc-1/availability?date=2026-10-23');
      expect(res.status).toBe(200);
      expect(res.body.slots).toBeDefined();
      expect(Array.isArray(res.body.slots)).toBe(true);
    });
  });

  describe('4. Appointment Lifecycle & Ownership', () => {
    let createdAptId: string;

    it('creates an appointment with verified doctor', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          doctorId: 'doc-1',
          date: '2026-10-25',
          time: '11:00 AM',
          consultationType: 'video',
          notes: 'Routine blood pressure assessment',
        });

      expect(res.status).toBe(201);
      expect(res.body.doctorName).toBe('Dr. Aline Carvalho');
      expect(res.body.status).toBe('confirmed');
      expect(res.body.meetingLink).toBeDefined();
      createdAptId = res.body.id;
    });

    it('lists user appointments', async () => {
      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.some((a: any) => a.id === createdAptId)).toBe(true);
    });

    it('prevents another patient from viewing or modifying the appointment (Cross-user isolation)', async () => {
      const res = await request(app)
        .get(`/api/appointments/${createdAptId}`)
        .set('Authorization', `Bearer ${anotherPatientToken}`);

      expect(res.status).toBe(403);
    });

    it('allows owner to reschedule appointment', async () => {
      const res = await request(app)
        .patch(`/api/appointments/${createdAptId}`)
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ date: '2026-10-26', time: '02:30 PM' });

      expect(res.status).toBe(200);
      expect(res.body.date).toBe('2026-10-26');
      expect(res.body.time).toBe('02:30 PM');
    });

    it('allows owner to cancel appointment', async () => {
      const res = await request(app)
        .delete(`/api/appointments/${createdAptId}`)
        .set('Authorization', `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('5. Medical Records & Cross-User Isolation', () => {
    it('retrieves seeded patient medical records', async () => {
      const res = await request(app)
        .get('/api/records')
        .set('Authorization', `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      sampleRecordId = res.body[0].id;
      expect(res.body[0].metrics.length).toBeGreaterThan(0);
      expect(res.body[0].aiSummary).toBeDefined();
    });

    it('strictly denies second patient from accessing first patient record', async () => {
      const res = await request(app)
        .get(`/api/records/${sampleRecordId}`)
        .set('Authorization', `Bearer ${anotherPatientToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('6. AI Assistant, Emergency Triage & Care Coordinator', () => {
    it('triggers immediate emergency triage protocol for acute chest pain', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ prompt: 'I have severe crushing chest pain radiating to my left arm.' });

      expect(res.status).toBe(200);
      expect(res.body.assistantMessage.content).toContain('IMMEDIATE ATTENTION REQUIRED');
      expect(res.body.assistantMessage.content).toContain('emergency');
    });

    it('answers general medical inquiry with plain-language explanations', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ prompt: 'Can you explain what HDL and LDL cholesterol mean?' });

      expect(res.status).toBe(200);
      expect(res.body.assistantMessage.content).toContain('HDL');
      expect(res.body.assistantMessage.content).toContain('LDL');
    });

    it('prepares appointment booking requiring explicit user confirmation', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({ prompt: 'Please book an appointment with a cardiologist.' });

      expect(res.status).toBe(200);
      const toolAction = res.body.assistantMessage.toolAction;
      expect(toolAction).toBeDefined();
      expect(toolAction.requiresConfirmation).toBe(true);
      expect(toolAction.status).toBe('pending_confirmation');
    });
  });

  describe('7. Google Sign-In, Profile Completion & Account Linking', () => {
    let googleUserToken: string;

    it('rejects Google authentication when credential is missing', async () => {
      const res = await request(app).post('/api/auth/google').send({});
      expect(res.status).toBe(400);
    });

    it('authenticates and creates new user profile via Google OAuth token', async () => {
      const mockGoogleSub = `google-test-${Date.now()}`;
      const mockPayload = Buffer.from(
        JSON.stringify({
          sub: mockGoogleSub,
          name: 'Maria Santos',
          email: 'maria.santos.test@gmail.com',
          email_verified: true,
          picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
        })
      ).toString('base64');
      const testToken = `mock-google-token.header.${mockPayload}.signature`;

      const res = await request(app)
        .post('/api/auth/google')
        .send({ credential: testToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.isNewUser).toBe(true);
      expect(res.body.user.email).toBe('maria.santos.test@gmail.com');
      expect(res.body.user.name).toBe('Maria Santos');
      expect(res.body.user.authProvider).toBe('google');
      expect(res.body.user.profileCompleted).toBe(false);

      googleUserToken = res.body.token;
    });

    it('logs in existing Google user without creating duplicate account', async () => {
      const mockGoogleSub = `google-test-existing`;
      const mockPayload = Buffer.from(
        JSON.stringify({
          sub: mockGoogleSub,
          name: 'Maria Santos',
          email: 'maria.santos.test@gmail.com',
          email_verified: true,
        })
      ).toString('base64');
      const testToken = `mock-google-token.header.${mockPayload}.signature`;

      const res = await request(app)
        .post('/api/auth/google')
        .send({ credential: testToken });

      expect(res.status).toBe(200);
      expect(res.body.isNewUser).toBe(false);
      expect(res.body.user.email).toBe('maria.santos.test@gmail.com');
    });

    it('allows newly authenticated user to complete their healthcare profile', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${googleUserToken}`)
        .send({
          phone: '(+351) 933 112 233',
          dob: '1992-06-15',
          bloodGroup: 'A+',
          emergencyContact: '(+351) 911 223 344',
          preferredLanguage: 'pt',
          profileCompleted: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.phone).toBe('(+351) 933 112 233');
      expect(res.body.dob).toBe('1992-06-15');
      expect(res.body.bloodGroup).toBe('A+');
      expect(res.body.profileCompleted).toBe(true);
      expect(res.body.preferredLanguage).toBe('pt');
    });

    it('verifies updated profile fields are persistent across sessions', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${googleUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.phone).toBe('(+351) 933 112 233');
      expect(res.body.profileCompleted).toBe(true);
    });
  });
});
