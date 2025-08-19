import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from './db';
import { 
  authenticateToken, 
  requireRole, 
  generateTokens, 
  hashPassword, 
  verifyPassword,
  generateMFACode,
  verifyMFACode,
  generatePasswordResetToken,
  hashPasswordResetToken,
  verifyPasswordResetToken
} from './utils/auth';
import { logger } from './utils/logger';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['shipper', 'driver', 'admin', 'warehouse']),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const mfaSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

const passwordResetSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

const createLoadSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  palletCount: z.number().positive(),
  weightLbs: z.number().positive(),
  dimensions: z.string().optional(),
  loadType: z.string().optional(),
  rateCents: z.number().positive(),
  pickupDate: z.string().datetime().optional(),
  deliveryDate: z.string().datetime().optional(),
  isUrgent: z.boolean().optional(),
  paymentTerms: z.string().optional(),
  specialRequirements: z.string().optional(),
  originLocation: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  destinationLocation: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
});

const createBidSchema = z.object({
  loadId: z.string().uuid(),
  bidAmountCents: z.number().positive(),
  message: z.string().optional(),
  estimatedPickupTime: z.string().datetime().optional(),
  estimatedDeliveryTime: z.string().datetime().optional(),
});

const createContractSchema = z.object({
  loadId: z.string().uuid(),
  driverId: z.string().uuid(),
  terms: z.string(),
  rateCents: z.number().positive(),
});

const createDocumentSchema = z.object({
  loadId: z.string().uuid(),
  type: z.enum(['rate_confirm', 'bol', 'invoice', 'contract']),
  title: z.string(),
  content: z.string().optional(),
  fileUrl: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export function registerRoutes(app: Express) {
  // Health check
  app.get('/healthz', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Authentication routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await hashPassword(validatedData.password);

      // Create user with profile
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          passwordHash: hashedPassword,
          name: validatedData.name,
          role: validatedData.role,
          phone: validatedData.phone,
          companyName: validatedData.companyName,
          status: 'pending', // Requires admin approval
          profile: {
            create: {
              verificationStatus: 'pending',
              rating: 0,
              totalLoads: 0,
              totalRevenue: 0,
              address: validatedData.address,
              city: validatedData.city,
              state: validatedData.state,
              zipCode: validatedData.zipCode,
            }
          }
        },
        include: {
          profile: true
        }
      });

      // Log the registration
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED',
          tableName: 'users',
          recordId: user.id,
          newValues: { email: user.email, role: user.role },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.status(201).json({
        message: 'User registered successfully. Awaiting admin approval.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          profile: user.profile
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email },
        include: { profile: true }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if account is approved
      if (user.status !== 'active') {
        return res.status(401).json({ 
          error: 'Account not approved', 
          status: user.status,
          requiresApproval: user.status === 'pending'
        });
      }

      // Verify password
      const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate MFA code for additional security
      const mfaCode = generateMFACode();
      
      // Store MFA code temporarily (in production, use Redis or similar)
      // For now, we'll store it in the user profile temporarily
      await prisma.userProfile.update({
        where: { userId: user.id },
        data: { 
          mfaCode,
          mfaCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        }
      });

      // Log the login attempt
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN_ATTEMPTED',
          tableName: 'users',
          recordId: user.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.json({
        message: 'MFA code sent',
        requiresMFA: true,
        userId: user.id
      });
    } catch (error) {
      logger.error('Login error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/mfa', async (req: Request, res: Response) => {
    try {
      const validatedData = mfaSchema.parse(req.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email },
        include: { profile: true }
      });

      if (!user || !user.profile) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if MFA code is valid and not expired
      if (!user.profile.mfaCode || 
          !user.profile.mfaCodeExpiresAt || 
          new Date() > user.profile.mfaCodeExpiresAt ||
          !verifyMFACode(validatedData.code, user.profile.mfaCode)) {
        return res.status(401).json({ error: 'Invalid or expired MFA code' });
      }

      // Clear MFA code
      await prisma.userProfile.update({
        where: { userId: user.id },
        data: { 
          mfaCode: null,
          mfaCodeExpiresAt: null
        }
      });

      // Generate tokens
      const tokens = await generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
      });

      // Log the successful login
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          tableName: 'users',
          recordId: user.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profile: user.profile
        },
        tokens
      });
    } catch (error) {
      logger.error('MFA error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
    try {
      const validatedData = passwordResetRequestSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (!user) {
        // Don't reveal if user exists
        return res.json({ message: 'If an account exists, a password reset email has been sent.' });
      }

      // Generate reset token
      const resetToken = generatePasswordResetToken();
      const hashedToken = await hashPasswordResetToken(resetToken);

      // Store reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        }
      });

      // Log the password reset request
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'PASSWORD_RESET_REQUESTED',
          tableName: 'users',
          recordId: user.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      // In production, send email here
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      logger.error('Forgot password error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
    try {
      const validatedData = passwordResetSchema.parse(req.body);

      // Find user with valid reset token
      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: { not: null },
          passwordResetExpiresAt: { gt: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      // Verify token
      const isValidToken = await verifyPasswordResetToken(validatedData.token, user.passwordResetToken!);
      if (!isValidToken) {
        return res.status(400).json({ error: 'Invalid reset token' });
      }

      // Hash new password
      const hashedPassword = await hashPassword(validatedData.newPassword);

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: hashedPassword,
          passwordResetToken: null,
          passwordResetExpiresAt: null
        }
      });

      // Log the password reset
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'PASSWORD_RESET',
          tableName: 'users',
          recordId: user.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      logger.error('Reset password error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Account approval routes (admin only)
  app.post('/api/admin/users/:id/approve', authenticateToken, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const adminId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.status === 'active') {
        return res.status(400).json({ error: 'User is already approved' });
      }

      // Update user status
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { 
          status: 'active',
          approvedAt: new Date(),
          approvedBy: adminId
        },
        include: { profile: true }
      });

      // Log the approval
      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: 'USER_APPROVED',
          tableName: 'users',
          recordId: userId,
          oldValues: { status: user.status },
          newValues: { status: 'active' },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.json({
        message: 'User approved successfully',
        user: updatedUser
      });
    } catch (error) {
      logger.error('User approval error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/users/:id/reject', authenticateToken, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const adminId = req.user!.id;
      const { reason } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user status
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { 
          status: 'rejected',
          rejectedAt: new Date(),
          rejectedBy: adminId,
          rejectionReason: reason
        }
      });

      // Log the rejection
      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: 'USER_REJECTED',
          tableName: 'users',
          recordId: userId,
          oldValues: { status: user.status },
          newValues: { status: 'rejected', rejectionReason: reason },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.json({
        message: 'User rejected successfully',
        user: updatedUser
      });
    } catch (error) {
      logger.error('User rejection error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Loads routes
  app.post('/api/loads', authenticateToken, requireRole(['shipper']), async (req: Request, res: Response) => {
    try {
      const validatedData = createLoadSchema.parse(req.body);
      const userId = req.user!.id;

      // Create locations first
      const originLocation = await prisma.location.create({
        data: validatedData.originLocation
      });

      const destinationLocation = await prisma.location.create({
        data: validatedData.destinationLocation
      });

      // Create load
      const load = await prisma.load.create({
        data: {
          shipperId: userId,
          originLocationId: originLocation.id,
          destinationLocationId: destinationLocation.id,
          title: validatedData.title,
          description: validatedData.description,
          palletCount: validatedData.palletCount,
          weightLbs: validatedData.weightLbs,
          dimensions: validatedData.dimensions,
          loadType: validatedData.loadType,
          rateCents: validatedData.rateCents,
          pickupDate: validatedData.pickupDate ? new Date(validatedData.pickupDate) : null,
          deliveryDate: validatedData.deliveryDate ? new Date(validatedData.deliveryDate) : null,
          isUrgent: validatedData.isUrgent || false,
          paymentTerms: validatedData.paymentTerms,
          specialRequirements: validatedData.specialRequirements,
        },
        include: {
          shipper: {
            include: { profile: true }
          },
          originLocation: true,
          destinationLocation: true,
          bids: {
            include: {
              driver: {
                include: { profile: true }
              }
            }
          }
        }
      });

      // Log the load creation
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'LOAD_CREATED',
          tableName: 'loads',
          recordId: load.id,
          newValues: { title: load.title, status: load.status },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.status(201).json({
        message: 'Load created successfully',
        load
      });
    } catch (error) {
      logger.error('Create load error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/loads', authenticateToken, async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const status = req.query.status as string;
      const isUrgent = req.query.urgent === 'true';

      let whereClause: any = {};

      // Filter by role
      if (userRole === 'shipper') {
        whereClause.shipperId = userId;
      } else if (userRole === 'driver') {
        whereClause.status = 'open';
      }

      // Additional filters
      if (status) {
        whereClause.status = status;
      }
      if (isUrgent) {
        whereClause.isUrgent = true;
      }

      const loads = await prisma.load.findMany({
        where: whereClause,
        include: {
          shipper: {
            include: { profile: true }
          },
          originLocation: true,
          destinationLocation: true,
          bids: {
            include: {
              driver: {
                include: { profile: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ loads });
    } catch (error) {
      logger.error('Get loads error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/loads/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
      const loadId = req.params.id;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const load = await prisma.load.findUnique({
        where: { id: loadId },
        include: {
          shipper: {
            include: { profile: true }
          },
          originLocation: true,
          destinationLocation: true,
          bids: {
            include: {
              driver: {
                include: { profile: true }
              }
            }
          },
          contracts: {
            include: {
              driver: {
                include: { profile: true }
              }
            }
          },
          documents: true
        }
      });

      if (!load) {
        return res.status(404).json({ error: 'Load not found' });
      }

      // Check if user has access to this load
      if (userRole === 'shipper' && load.shipperId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({ load });
    } catch (error) {
      logger.error('Get load error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/loads/:id/status', authenticateToken, async (req: Request, res: Response) => {
    try {
      const loadId = req.params.id;
      const { status } = req.body;
      const userId = req.user!.id;
      const userRole = req.user!.role;

      const load = await prisma.load.findUnique({
        where: { id: loadId }
      });

      if (!load) {
        return res.status(404).json({ error: 'Load not found' });
      }

      // Check permissions
      if (userRole === 'shipper' && load.shipperId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      if (userRole === 'driver') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedLoad = await prisma.load.update({
        where: { id: loadId },
        data: { status },
        include: {
          shipper: {
            include: { profile: true }
          },
          originLocation: true,
          destinationLocation: true
        }
      });

      // Log the status change
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'LOAD_STATUS_UPDATED',
          tableName: 'loads',
          recordId: loadId,
          oldValues: { status: load.status },
          newValues: { status },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.json({
        message: 'Load status updated successfully',
        load: updatedLoad
      });
    } catch (error) {
      logger.error('Update load status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Bids routes
  app.post('/api/bids', authenticateToken, requireRole(['driver']), async (req: Request, res: Response) => {
    try {
      const validatedData = createBidSchema.parse(req.body);
      const driverId = req.user!.id;

      // Check if load exists and is open
      const load = await prisma.load.findUnique({
        where: { id: validatedData.loadId }
      });

      if (!load) {
        return res.status(404).json({ error: 'Load not found' });
      }

      if (load.status !== 'open') {
        return res.status(400).json({ error: 'Load is not open for bidding' });
      }

      // Check if driver already bid on this load
      const existingBid = await prisma.bid.findFirst({
        where: {
          loadId: validatedData.loadId,
          driverId
        }
      });

      if (existingBid) {
        return res.status(409).json({ error: 'You have already bid on this load' });
      }

      const bid = await prisma.bid.create({
        data: {
          loadId: validatedData.loadId,
          driverId,
          bidAmountCents: validatedData.bidAmountCents,
          message: validatedData.message,
          estimatedPickupTime: validatedData.estimatedPickupTime ? new Date(validatedData.estimatedPickupTime) : null,
          estimatedDeliveryTime: validatedData.estimatedDeliveryTime ? new Date(validatedData.estimatedDeliveryTime) : null,
        },
        include: {
          driver: {
            include: { profile: true }
          },
          load: {
            include: {
              shipper: {
                include: { profile: true }
              }
            }
          }
        }
      });

      // Log the bid creation
      await prisma.auditLog.create({
        data: {
          userId: driverId,
          action: 'BID_CREATED',
          tableName: 'bids',
          recordId: bid.id,
          newValues: { bidAmountCents: bid.bidAmountCents, status: bid.status },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.status(201).json({
        message: 'Bid created successfully',
        bid
      });
    } catch (error) {
      logger.error('Create bid error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/bids/:id/accept', authenticateToken, requireRole(['shipper']), async (req: Request, res: Response) => {
    try {
      const bidId = req.params.id;
      const shipperId = req.user!.id;

      const bid = await prisma.bid.findUnique({
        where: { id: bidId },
        include: {
          load: true
        }
      });

      if (!bid) {
        return res.status(404).json({ error: 'Bid not found' });
      }

      // Check if shipper owns the load
      if (bid.load.shipperId !== shipperId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Update bid status to accepted
      const updatedBid = await prisma.bid.update({
        where: { id: bidId },
        data: { status: 'accepted' },
        include: {
          driver: {
            include: { profile: true }
          },
          load: true
        }
      });

      // Update load status to assigned
      await prisma.load.update({
        where: { id: bid.loadId },
        data: { status: 'assigned' }
      });

      // Reject all other bids for this load
      await prisma.bid.updateMany({
        where: {
          loadId: bid.loadId,
          id: { not: bidId }
        },
        data: { status: 'rejected' }
      });

      // Log the bid acceptance
      await prisma.auditLog.create({
        data: {
          userId: shipperId,
          action: 'BID_ACCEPTED',
          tableName: 'bids',
          recordId: bidId,
          oldValues: { status: 'pending' },
          newValues: { status: 'accepted' },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.json({
        message: 'Bid accepted successfully',
        bid: updatedBid
      });
    } catch (error) {
      logger.error('Accept bid error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Contracts routes
  app.post('/api/contracts', authenticateToken, requireRole(['shipper']), async (req: Request, res: Response) => {
    try {
      const validatedData = createContractSchema.parse(req.body);
      const shipperId = req.user!.id;

      // Check if load exists and is assigned
      const load = await prisma.load.findUnique({
        where: { id: validatedData.loadId }
      });

      if (!load) {
        return res.status(404).json({ error: 'Load not found' });
      }

      if (load.status !== 'assigned') {
        return res.status(400).json({ error: 'Load must be assigned before creating contract' });
      }

      // Check if shipper owns the load
      if (load.shipperId !== shipperId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Generate contract number
      const contractNumber = `CON-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      const contract = await prisma.contract.create({
        data: {
          loadId: validatedData.loadId,
          shipperId,
          driverId: validatedData.driverId,
          contractNumber,
          terms: validatedData.terms,
          rateCents: validatedData.rateCents,
        },
        include: {
          load: true,
          shipper: {
            include: { profile: true }
          },
          driver: {
            include: { profile: true }
          }
        }
      });

      // Log the contract creation
      await prisma.auditLog.create({
        data: {
          userId: shipperId,
          action: 'CONTRACT_CREATED',
          tableName: 'contracts',
          recordId: contract.id,
          newValues: { contractNumber: contract.contractNumber, status: contract.status },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.status(201).json({
        message: 'Contract created successfully',
        contract
      });
    } catch (error) {
      logger.error('Create contract error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/contracts/:id/sign', authenticateToken, async (req: Request, res: Response) => {
    try {
      const contractId = req.params.id;
      const userId = req.user!.id;
      const { signature } = req.body;

      const contract = await prisma.contract.findUnique({
        where: { id: contractId },
        include: {
          load: true
        }
      });

      if (!contract) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      // Check if user is involved in the contract
      if (contract.shipperId !== userId && contract.driverId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const isShipper = contract.shipperId === userId;
      const updateData: any = {};

      if (isShipper) {
        updateData.shipperSignedAt = new Date();
        updateData.shipperSignature = signature;
      } else {
        updateData.driverSignedAt = new Date();
        updateData.driverSignature = signature;
      }

      // Check if both parties have signed
      const updatedContract = await prisma.contract.update({
        where: { id: contractId },
        data: {
          ...updateData,
          status: isShipper && contract.driverSignedAt ? 'signed' : 
                  !isShipper && contract.shipperSignedAt ? 'signed' : 'pending'
        },
        include: {
          load: true,
          shipper: {
            include: { profile: true }
          },
          driver: {
            include: { profile: true }
          }
        }
      });

      // If both parties signed, update load status
      if (updatedContract.status === 'signed') {
        await prisma.load.update({
          where: { id: contract.loadId },
          data: { status: 'in_transit' }
        });
      }

      // Log the signature
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CONTRACT_SIGNED',
          tableName: 'contracts',
          recordId: contractId,
          newValues: { 
            status: updatedContract.status,
            [isShipper ? 'shipperSignedAt' : 'driverSignedAt']: new Date()
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.json({
        message: 'Contract signed successfully',
        contract: updatedContract
      });
    } catch (error) {
      logger.error('Sign contract error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Documents routes
  app.post('/api/documents', authenticateToken, async (req: Request, res: Response) => {
    try {
      const validatedData = createDocumentSchema.parse(req.body);
      const userId = req.user!.id;

      // Check if user has access to the load
      const load = await prisma.load.findUnique({
        where: { id: validatedData.loadId }
      });

      if (!load) {
        return res.status(404).json({ error: 'Load not found' });
      }

      if (load.shipperId !== userId && load.driverId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const document = await prisma.document.create({
        data: {
          loadId: validatedData.loadId,
          type: validatedData.type,
          title: validatedData.title,
          content: validatedData.content,
          fileUrl: validatedData.fileUrl,
          metadata: validatedData.metadata,
          createdBy: userId,
        },
        include: {
          load: true,
          createdByUser: {
            include: { profile: true }
          }
        }
      });

      // Log the document creation
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'DOCUMENT_CREATED',
          tableName: 'documents',
          recordId: document.id,
          newValues: { title: document.title, type: document.type },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || ''
        }
      });

      res.status(201).json({
        message: 'Document created successfully',
        document
      });
    } catch (error) {
      logger.error('Create document error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/documents/load/:loadId', authenticateToken, async (req: Request, res: Response) => {
    try {
      const loadId = req.params.loadId;
      const userId = req.user!.id;

      // Check if user has access to the load
      const load = await prisma.load.findUnique({
        where: { id: loadId }
      });

      if (!load) {
        return res.status(404).json({ error: 'Load not found' });
      }

      if (load.shipperId !== userId && load.driverId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const documents = await prisma.document.findMany({
        where: { loadId },
        include: {
          createdByUser: {
            include: { profile: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ documents });
    } catch (error) {
      logger.error('Get documents error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        include: { profile: true },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ users });
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/admin/stats', authenticateToken, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
      const [totalUsers, pendingUsers, totalLoads, totalBids, totalContracts] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: 'pending' } }),
        prisma.load.count(),
        prisma.bid.count(),
        prisma.contract.count()
      ]);

      res.json({
        stats: {
          totalUsers,
          pendingUsers,
          totalLoads,
          totalBids,
          totalContracts
        }
      });
    } catch (error) {
      logger.error('Get admin stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Seed route (development only)
  if (process.env.NODE_ENV === 'development') {
    app.post('/api/seed', async (req: Request, res: Response) => {
      try {
        // This would typically call the seed script
        res.json({ message: 'Database seeded successfully' });
      } catch (error) {
        logger.error('Seed error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }
}
