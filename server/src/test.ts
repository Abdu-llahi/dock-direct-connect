import request from 'supertest';
import app from './app';
import { db } from './db';
import { users, loads } from '../../shared/schema';
import { hashPassword } from './utils/auth';
import { eq } from 'drizzle-orm';

describe('API Tests', () => {
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    // Create a test user
    const hashedPassword = await hashPassword('testpassword123');
    const [user] = await db.insert(users).values({
      email: 'test@example.com',
      passwordHash: hashedPassword,
      name: 'Test User',
      role: 'shipper',
      status: 'active',
      verificationStatus: 'approved',
      emailVerified: true,
    }).returning();
    testUser = user;

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword123',
      });

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(loads).where(eq(loads.shipperId, testUser.id));
    await db.delete(users).where(eq(users.id, testUser.id));
  });

  describe('Authentication', () => {
    test('POST /api/auth/register - should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          role: 'driver',
          name: 'New User',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.user.role).toBe('driver');

      // Clean up
      await db.delete(users).where(eq(users.email, 'newuser@example.com'));
    });

    test('POST /api/auth/login - should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.user.email).toBe('test@example.com');
    });

    test('POST /api/auth/login - should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Shipments', () => {
    test('POST /api/shipments - should create a new shipment', async () => {
      const shipmentData = {
        originAddress: 'Los Angeles, CA',
        destinationAddress: 'New York, NY',
        palletCount: 10,
        weight: '5000 lbs',
        loadType: 'dry',
        rate: 2500.00,
        description: 'Test shipment',
        isUrgent: true,
      };

      const response = await request(app)
        .post('/api/shipments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(shipmentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.originAddress).toBe(shipmentData.originAddress);
      expect(response.body.destinationAddress).toBe(shipmentData.destinationAddress);
      expect(response.body.status).toBe('open');
    });

    test('GET /api/shipments - should return user shipments', async () => {
      const response = await request(app)
        .get('/api/shipments')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/shipments - should require authentication', async () => {
      const response = await request(app)
        .post('/api/shipments')
        .send({
          originAddress: 'Test',
          destinationAddress: 'Test',
          palletCount: 1,
          weight: '1000 lbs',
          loadType: 'dry',
          rate: 1000.00,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Health Check', () => {
    test('GET /healthz - should return health status', async () => {
      const response = await request(app).get('/healthz');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });
});
