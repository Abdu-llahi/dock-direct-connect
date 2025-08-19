import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { db } from './db';
import { users, loads, bids } from '../../shared/schema';
import { authenticateToken, requireRole, generateTokens, hashPassword, verifyPassword } from './utils/auth';
import { eq, and, desc } from 'drizzle-orm';
import { logger } from './utils/logger';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['shipper', 'driver', 'admin']),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const shipmentSchema = z.object({
  originAddress: z.string().min(1),
  destinationAddress: z.string().min(1),
  palletCount: z.number().positive(),
  weight: z.string().min(1),
  loadType: z.string().min(1),
  rate: z.number().positive(),
  description: z.string().optional(),
  pickupDate: z.string().datetime().optional(),
  deliveryDate: z.string().datetime().optional(),
  isUrgent: z.boolean().optional(),
  paymentTerms: z.string().optional(),
});

const bidSchema = z.object({
  bidAmount: z.number().positive(),
  message: z.string().optional(),
});

const updateShipmentStatusSchema = z.object({
  status: z.enum(['draft', 'open', 'assigned', 'in_transit', 'delivered', 'canceled']),
});

export function registerRoutes(app: Express) {
  // Auth routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, role, name } = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const [newUser] = await db.insert(users).values({
        email,
        passwordHash: hashedPassword,
        name,
        role,
        status: 'active',
        verificationStatus: 'approved',
        emailVerified: true,
      }).returning();

      // Generate tokens
      const tokens = await generateTokens({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      logger.info(`User registered: ${email} (${role})`);

      res.status(201).json({
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        ...tokens,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Find user
      const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (userResult.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = userResult[0];

      // Verify password
      if (!user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({ error: 'Account is not active' });
      }

      // Generate tokens
      const tokens = await generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Update last login
      await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

      logger.info(`User logged in: ${email}`);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        ...tokens,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Shipment routes
  app.post('/api/shipments', authenticateToken, requireRole(['shipper']), async (req: Request, res: Response) => {
    try {
      const shipmentData = shipmentSchema.parse(req.body);

      const [newShipment] = await db.insert(loads).values({
        ...shipmentData,
        shipperId: req.user!.id,
        status: 'open',
        pickupDate: shipmentData.pickupDate ? new Date(shipmentData.pickupDate) : undefined,
        deliveryDate: shipmentData.deliveryDate ? new Date(shipmentData.deliveryDate) : undefined,
      }).returning();

      logger.info(`Shipment created: ${newShipment.id} by ${req.user!.email}`);

      res.status(201).json(newShipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      logger.error('Shipment creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/shipments', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userRole = req.user!.role;
      let shipments;

      if (userRole === 'shipper') {
        // Shippers see their own shipments
        shipments = await db.select().from(loads).where(eq(loads.shipperId, req.user!.id)).orderBy(desc(loads.createdAt));
      } else if (userRole === 'driver') {
        // Drivers see open shipments
        shipments = await db.select().from(loads).where(eq(loads.status, 'open')).orderBy(desc(loads.createdAt));
      } else if (userRole === 'admin') {
        // Admins see all shipments
        shipments = await db.select().from(loads).orderBy(desc(loads.createdAt));
      } else {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      res.json(shipments);
    } catch (error) {
      logger.error('Shipment fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/shipments/:id/status', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = updateShipmentStatusSchema.parse(req.body);

      // Get shipment
      const shipmentResult = await db.select().from(loads).where(eq(loads.id, id)).limit(1);
      if (shipmentResult.length === 0) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      const shipment = shipmentResult[0];

      // Check permissions
      const canUpdate = req.user!.role === 'admin' || 
                       (req.user!.role === 'shipper' && shipment.shipperId === req.user!.id);

      if (!canUpdate) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Validate status transitions
      const validTransitions: Record<string, string[]> = {
        'open': ['assigned', 'canceled'],
        'assigned': ['in_transit', 'canceled'],
        'in_transit': ['delivered'],
        'delivered': [],
        'canceled': [],
      };

      if (!validTransitions[shipment.status]?.includes(status)) {
        return res.status(400).json({ error: 'Invalid status transition' });
      }

      // Update shipment
      const [updatedShipment] = await db.update(loads)
        .set({ status })
        .where(eq(loads.id, id))
        .returning();

      logger.info(`Shipment status updated: ${id} to ${status} by ${req.user!.email}`);

      res.json(updatedShipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      logger.error('Shipment status update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Bid routes
  app.post('/api/bids', authenticateToken, requireRole(['driver']), async (req: Request, res: Response) => {
    try {
      const { shipmentId, ...bidData } = req.body;
      const validatedBid = bidSchema.parse(bidData);

      // Check if shipment exists and is open
      const shipmentResult = await db.select().from(loads).where(eq(loads.id, shipmentId)).limit(1);
      if (shipmentResult.length === 0) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      if (shipmentResult[0].status !== 'open') {
        return res.status(400).json({ error: 'Shipment is not open for bidding' });
      }

      // Check if driver already bid on this shipment
      const existingBid = await db.select().from(bids).where(
        and(eq(bids.loadId, shipmentId), eq(bids.driverId, req.user!.id))
      ).limit(1);

      if (existingBid.length > 0) {
        return res.status(400).json({ error: 'You have already bid on this shipment' });
      }

      // Create bid
      const [newBid] = await db.insert(bids).values({
        ...validatedBid,
        loadId: shipmentId,
        driverId: req.user!.id,
        status: 'pending',
      }).returning();

      logger.info(`Bid created: ${newBid.id} by ${req.user!.email} on shipment ${shipmentId}`);

      res.status(201).json(newBid);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      logger.error('Bid creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/bids/:id/accept', authenticateToken, requireRole(['shipper']), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Get bid
      const bidResult = await db.select().from(bids).where(eq(bids.id, id)).limit(1);
      if (bidResult.length === 0) {
        return res.status(404).json({ error: 'Bid not found' });
      }

      const bid = bidResult[0];

      // Get shipment
      const shipmentResult = await db.select().from(loads).where(eq(loads.id, bid.loadId)).limit(1);
      if (shipmentResult.length === 0) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      const shipment = shipmentResult[0];

      // Check if shipper owns the shipment
      if (shipment.shipperId !== req.user!.id) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Check if shipment is still open
      if (shipment.status !== 'open') {
        return res.status(400).json({ error: 'Shipment is not open for bidding' });
      }

      // Update bid status to accepted
      await db.update(bids).set({ status: 'accepted' }).where(eq(bids.id, id));

      // Reject all other bids for this shipment
      await db.update(bids).set({ status: 'rejected' }).where(
        and(eq(bids.loadId, bid.loadId), eq(bids.id, id))
      );

      // Update shipment status to assigned
      await db.update(loads).set({ 
        status: 'assigned',
        assignedDriverId: bid.driverId,
      }).where(eq(loads.id, bid.loadId));

      logger.info(`Bid accepted: ${id} by ${req.user!.email}`);

      res.json({ message: 'Bid accepted successfully' });
    } catch (error) {
      logger.error('Bid acceptance error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Seed route for development
  app.post('/api/seed', async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Seeding not allowed in production' });
    }

    try {
      // Create mock users
      const mockUsers = [
        { email: 'shipper@example.com', password: 'password123', name: 'John Shipper', role: 'shipper' as const },
        { email: 'driver1@example.com', password: 'password123', name: 'Mike Driver', role: 'driver' as const },
        { email: 'driver2@example.com', password: 'password123', name: 'Sarah Driver', role: 'driver' as const },
      ];

      const createdUsers = [];
      for (const userData of mockUsers) {
        const hashedPassword = await hashPassword(userData.password);
        const [user] = await db.insert(users).values({
          email: userData.email,
          passwordHash: hashedPassword,
          name: userData.name,
          role: userData.role,
          status: 'active',
          verificationStatus: 'approved',
          emailVerified: true,
        }).returning();
        createdUsers.push(user);
      }

      // Create mock shipments
      const mockShipments = [
        {
          shipperId: createdUsers[0].id,
          originAddress: 'Los Angeles, CA',
          destinationAddress: 'New York, NY',
          palletCount: 10,
          weight: '5000 lbs',
          loadType: 'dry',
          rate: 2500.00,
          description: 'Electronics shipment',
          isUrgent: true,
        },
        {
          shipperId: createdUsers[0].id,
          originAddress: 'Chicago, IL',
          destinationAddress: 'Miami, FL',
          palletCount: 15,
          weight: '7500 lbs',
          loadType: 'refrigerated',
          rate: 3200.00,
          description: 'Perishable goods',
          isUrgent: false,
        },
        {
          shipperId: createdUsers[0].id,
          originAddress: 'Seattle, WA',
          destinationAddress: 'Denver, CO',
          palletCount: 8,
          weight: '4000 lbs',
          loadType: 'dry',
          rate: 1800.00,
          description: 'General freight',
          isUrgent: false,
        },
        {
          shipperId: createdUsers[0].id,
          originAddress: 'Houston, TX',
          destinationAddress: 'Phoenix, AZ',
          palletCount: 12,
          weight: '6000 lbs',
          loadType: 'dry',
          rate: 2200.00,
          description: 'Industrial parts',
          isUrgent: true,
        },
        {
          shipperId: createdUsers[0].id,
          originAddress: 'Atlanta, GA',
          destinationAddress: 'Dallas, TX',
          palletCount: 6,
          weight: '3000 lbs',
          loadType: 'refrigerated',
          rate: 1500.00,
          description: 'Food products',
          isUrgent: false,
        },
        {
          shipperId: createdUsers[0].id,
          originAddress: 'Boston, MA',
          destinationAddress: 'Philadelphia, PA',
          palletCount: 20,
          weight: '10000 lbs',
          loadType: 'dry',
          rate: 2800.00,
          description: 'Heavy machinery',
          isUrgent: true,
        },
        {
          shipperId: createdUsers[0].id,
          originAddress: 'San Francisco, CA',
          destinationAddress: 'Portland, OR',
          palletCount: 5,
          weight: '2500 lbs',
          loadType: 'dry',
          rate: 1200.00,
          description: 'Tech equipment',
          isUrgent: false,
        },
        {
          shipperId: createdUsers[0].id,
          originAddress: 'Detroit, MI',
          destinationAddress: 'Cleveland, OH',
          palletCount: 18,
          weight: '9000 lbs',
          loadType: 'dry',
          rate: 2600.00,
          description: 'Automotive parts',
          isUrgent: false,
        },
      ];

      const createdShipments = [];
      for (const shipmentData of mockShipments) {
        const [shipment] = await db.insert(loads).values({
          ...shipmentData,
          status: 'open',
        }).returning();
        createdShipments.push(shipment);
      }

      // Create mock bids
      const mockBids = [
        { loadId: createdShipments[0].id, driverId: createdUsers[1].id, bidAmount: 2400.00, message: 'Available immediately' },
        { loadId: createdShipments[0].id, driverId: createdUsers[2].id, bidAmount: 2300.00, message: 'Best rate guaranteed' },
        { loadId: createdShipments[1].id, driverId: createdUsers[1].id, bidAmount: 3100.00, message: 'Refrigerated trailer ready' },
        { loadId: createdShipments[2].id, driverId: createdUsers[2].id, bidAmount: 1750.00, message: 'Experienced driver' },
        { loadId: createdShipments[3].id, driverId: createdUsers[1].id, bidAmount: 2100.00, message: 'Quick pickup available' },
      ];

      for (const bidData of mockBids) {
        await db.insert(bids).values({
          ...bidData,
          status: 'pending',
        });
      }

      logger.info('Database seeded successfully');

      res.json({
        message: 'Database seeded successfully',
        users: createdUsers.length,
        shipments: createdShipments.length,
        bids: mockBids.length,
      });
    } catch (error) {
      logger.error('Seeding error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
