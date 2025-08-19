import request from 'supertest';
import app from './app';
import db from './db';
import { hashPassword } from './utils/auth';

describe('API Tests', () => {
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    // Create a test user
    const hashedPassword = await hashPassword('testpassword123');
    testUser = await db.user.create({
              data: {
          email: 'test@example.com',
          passwordHash: hashedPassword,
          name: 'Test User',
          role: 'shipper',
          status: 'active',
          emailVerified: true,
        },
    });

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
    await db.load.deleteMany({
      where: { shipperId: testUser.id },
    });
    await db.user.delete({
      where: { id: testUser.id },
    });
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
      await db.user.delete({
        where: { email: 'newuser@example.com' },
      });
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

  describe('Loads', () => {
    test('POST /api/loads - should create a new load', async () => {
      const loadData = {
        originAddress: 'Los Angeles, CA',
        destinationAddress: 'New York, NY',
        palletCount: 10,
        weight: '5000 lbs',
        loadType: 'dry',
        rate: 2500.00,
        description: 'Test load',
        isUrgent: true,
      };

      const response = await request(app)
        .post('/api/loads')
        .set('Authorization', `Bearer ${authToken}`)
        .send(loadData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.originAddress).toBe(loadData.originAddress);
      expect(response.body.destinationAddress).toBe(loadData.destinationAddress);
      expect(response.body.status).toBe('open');
    });

    test('GET /api/loads - should return user loads', async () => {
      const response = await request(app)
        .get('/api/loads')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/loads - should require authentication', async () => {
      const response = await request(app)
        .post('/api/loads')
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
