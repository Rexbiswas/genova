import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { seedDatabase } from '../src/jobs/seedData.js';
import { User } from '../src/models/User.js';
import { MedicalRecord } from '../src/models/MedicalRecord.js';

describe('Genova Healthcare OS Full-Stack API Test Suite', () => {
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

    it('rejects login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'stevan@genova.health', password: 'WrongPassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
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
});
