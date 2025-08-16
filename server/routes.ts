import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { users, userProfiles, betaWaitlist, auditLogs, loads, bids } from "../shared/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { 
  generateTokens, 
  hashPassword, 
  verifyPassword, 
  authenticateToken, 
  requireAdmin,
  refreshAccessToken,
  revokeRefreshToken,
  generateEmailVerificationToken
} from "./utils/auth";
import { logger, auditLog } from "./utils/logger";
import { emailService } from "./utils/email";
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validatePhone, 
  sanitizeInput,
  validateLoadData,
  validateBidData
} from "./utils/validation";
import crypto from "crypto";
import type { Request, Response } from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // =============================================================================
  // AUTHENTICATION ROUTES - Enterprise Grade
  // =============================================================================
  
  // User Registration with comprehensive validation
  app.post("/api/auth/signup", async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    
    try {
      const { email, password, name, role, phone, additionalData = {} } = req.body;
      
      // Input validation
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
      }
      
      if (!validateName(name)) {
        return res.status(400).json({ error: 'Name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes' });
      }
      
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ error: passwordValidation.errors[0] });
      }
      
      if (!['driver', 'shipper'].includes(role)) {
        return res.status(400).json({ error: 'Role must be either driver or shipper' });
      }
      
      if (phone && !validatePhone(phone)) {
        return res.status(400).json({ error: 'Please provide a valid phone number' });
      }
      
      // Check if user already exists
      const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (existingUser) {
        auditLog.securityEvent('duplicate_signup_attempt', { email, clientIp });
        return res.status(409).json({ error: 'An account with this email already exists' });
      }
      
      // Hash password
      const passwordHash = await hashPassword(password);
      const emailVerificationToken = generateEmailVerificationToken();
      
      // Create user
      const [user] = await db.insert(users).values({
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        passwordHash,
        name: sanitizeInput(name),
        role,
        phone: phone ? sanitizeInput(phone) : null,
        emailVerificationToken,
        status: 'pending',
        verificationStatus: 'pending'
      }).returning();
      
      // Create user profile if additional data provided
      if (additionalData.company || additionalData.license_number || additionalData.business_address) {
        await db.insert(userProfiles).values({
          userId: user.id,
          companyName: additionalData.company ? sanitizeInput(additionalData.company) : null,
          licenseNumber: additionalData.license_number ? sanitizeInput(additionalData.license_number) : null,
          mcDotNumber: additionalData.mc_dot_number ? sanitizeInput(additionalData.mc_dot_number) : null,
          businessAddress: additionalData.business_address ? sanitizeInput(additionalData.business_address) : null,
          einNumber: additionalData.ein_number ? sanitizeInput(additionalData.ein_number) : null
        });
      }
      
      // Log audit event
      auditLog.userSignup(user.id, user.email, clientIp);
      
      // Send verification email
      await emailService.sendVerificationEmail(user.email, user.name, emailVerificationToken);
      
      // Generate JWT tokens
      const tokens = await generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      // Return user data (excluding sensitive information)
      res.status(201).json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role,
          status: user.status,
          verificationStatus: user.verificationStatus,
          emailVerified: user.emailVerified
        },
        ...tokens
      });
      
      logger.info('User registered successfully', { userId: user.id, email: user.email, role: user.role });
      
    } catch (error: any) {
      logger.error('Signup error', { error: error.message, stack: error.stack, clientIp });
      
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'An account with this email already exists' });
      }
      
      res.status(500).json({ error: 'Internal server error during registration' });
    }
  });
  
  // User Login with security measures
  app.post("/api/auth/signin", async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    
    try {
      const { email, password } = req.body;
      
      // Input validation
      if (!validateEmail(email) || !password) {
        return res.status(400).json({ error: 'Please provide valid email and password' });
      }
      
      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (!user) {
        auditLog.securityEvent('login_attempt_invalid_email', { email, clientIp });
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Check if user is suspended
      if (user.status === 'suspended') {
        auditLog.securityEvent('login_attempt_suspended_user', { userId: user.id, clientIp });
        return res.status(403).json({ error: 'Account suspended. Please contact support.' });
      }
      
      // Verify password (temporary: allow signin without password for migration)
      if (user.passwordHash) {
        const isPasswordValid = await verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
          auditLog.securityEvent('login_attempt_invalid_password', { userId: user.id, clientIp });
          return res.status(401).json({ error: 'Invalid email or password' });
        }
      }
      
      // Update last login timestamp
      await db.update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));
      
      // Log successful login
      auditLog.userLogin(user.id, user.email, clientIp);
      
      // Generate JWT tokens
      const tokens = await generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
      });
      
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role,
          status: user.status,
          verificationStatus: user.verificationStatus,
          emailVerified: user.emailVerified
        },
        ...tokens
      });
      
      logger.info('User logged in successfully', { userId: user.id, email: user.email });
      
    } catch (error: any) {
      logger.error('Signin error', { error: error.message, stack: error.stack, clientIp });
      res.status(500).json({ error: 'Internal server error during login' });
    }
  });
  
  // Refresh Token Endpoint
  app.post("/api/auth/refresh", async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
      }
      
      const tokens = await refreshAccessToken(refreshToken);
      res.json(tokens);
      
    } catch (error: any) {
      logger.error('Token refresh error', { error: error.message });
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  });
  
  // Logout Endpoint
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        await revokeRefreshToken(refreshToken);
      }
      
      res.json({ message: 'Logged out successfully' });
      
    } catch (error: any) {
      logger.error('Logout error', { error: error.message });
      res.status(500).json({ error: 'Error during logout' });
    }
  });
  
  // Get Current User Profile
  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get user profile
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      
      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          verificationStatus: user.verificationStatus,
          emailVerified: user.emailVerified,
          profile
        }
      });
      
    } catch (error: any) {
      logger.error('Get user profile error', { error: error.message });
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  });
  
  // =============================================================================
  // EMAIL VERIFICATION ROUTES
  // =============================================================================
  
  // Verify Email Address
  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Verification token is required' });
      }
      
      // Find user with this verification token
      const [user] = await db.select()
        .from(users)
        .where(eq(users.emailVerificationToken, token));
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }
      
      if (user.emailVerified) {
        return res.status(200).json({ message: 'Email already verified' });
      }
      
      // Update user as verified
      await db.update(users)
        .set({ 
          emailVerified: true, 
          emailVerificationToken: null,
          status: 'active',
          verificationStatus: 'verified'
        })
        .where(eq(users.id, user.id));
      
      logger.info('Email verified successfully', { userId: user.id, email: user.email });
      auditLog.userAction(user.id, 'email_verified', req.ip);
      
      res.json({ 
        success: true, 
        message: 'Email verified successfully! You can now access all platform features.' 
      });
      
    } catch (error: any) {
      logger.error('Email verification error', { error: error.message });
      res.status(500).json({ error: 'Failed to verify email' });
    }
  });
  
  // Resend Verification Email
  app.post("/api/auth/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Valid email address is required' });
      }
      
      const [user] = await db.select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()));
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.emailVerified) {
        return res.status(400).json({ error: 'Email is already verified' });
      }
      
      // Generate new verification token
      const newToken = generateEmailVerificationToken();
      
      await db.update(users)
        .set({ emailVerificationToken: newToken })
        .where(eq(users.id, user.id));
      
      // Send new verification email
      await emailService.sendVerificationEmail(user.email, user.name, newToken);
      
      logger.info('Verification email resent', { userId: user.id, email: user.email });
      
      res.json({ 
        success: true, 
        message: 'Verification email sent. Please check your inbox.' 
      });
      
    } catch (error: any) {
      logger.error('Resend verification error', { error: error.message });
      res.status(500).json({ error: 'Failed to resend verification email' });
    }
  });
  
  // Confirm Beta Waitlist
  app.get("/api/beta-waitlist/confirm", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Confirmation token is required' });
      }
      
      // Find waitlist entry with this token
      const [entry] = await db.select()
        .from(betaWaitlist)
        .where(eq(betaWaitlist.confirmationToken, token));
      
      if (!entry) {
        return res.status(400).json({ error: 'Invalid or expired confirmation token' });
      }
      
      if (entry.confirmed) {
        return res.status(200).json({ message: 'Beta access already confirmed' });
      }
      
      // Update entry as confirmed
      await db.update(betaWaitlist)
        .set({ 
          confirmed: true,
          confirmationToken: null,
          confirmedAt: new Date()
        })
        .where(eq(betaWaitlist.id, entry.id));
      
      logger.info('Beta waitlist confirmed', { email: entry.email });
      
      res.json({ 
        success: true, 
        message: 'Beta access confirmed! You\'ll be notified as soon as we launch.' 
      });
      
    } catch (error: any) {
      logger.error('Beta confirmation error', { error: error.message });
      res.status(500).json({ error: 'Failed to confirm beta access' });
    }
  });
  
  // =============================================================================
  // ADMIN ROUTES - Secure Admin Panel
  // =============================================================================
  
  // Admin Dashboard Data
  app.get("/api/admin/dashboard", requireAdmin, async (req: Request, res: Response) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const adminUserId = (req as any).user.userId;
    
    try {
      // Log admin access
      auditLog.adminAccess(adminUserId, 'dashboard_access', clientIp);
      
      // Get dashboard statistics
      const [userStats] = await db.select({
        totalUsers: sql<number>`count(*)`,
        activeUsers: sql<number>`count(*) filter (where status = 'active')`,
        pendingUsers: sql<number>`count(*) filter (where verification_status = 'pending')`,
        shippers: sql<number>`count(*) filter (where role = 'shipper')`,
        drivers: sql<number>`count(*) filter (where role = 'driver')`
      }).from(users);
      
      const [loadStats] = await db.select({
        totalLoads: sql<number>`count(*)`,
        activeLoads: sql<number>`count(*) filter (where status = 'posted')`,
        completedLoads: sql<number>`count(*) filter (where status = 'completed')`
      }).from(loads);
      
      const [waitlistCount] = await db.select({
        count: sql<number>`count(*)`
      }).from(betaWaitlist);
      
      res.json({
        userStats,
        loadStats,
        waitlistCount: waitlistCount.count
      });
      
    } catch (error: any) {
      logger.error('Admin dashboard error', { error: error.message, adminUserId });
      res.status(500).json({ error: 'Failed to load dashboard data' });
    }
  });
  
  // Admin - Get All Users
  app.get("/api/admin/users", requireAdmin, async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = (page - 1) * limit;
      
      const allUsers = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        status: users.status,
        verificationStatus: users.verificationStatus,
        emailVerified: users.emailVerified,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
      
      const [totalCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
      
      res.json({
        users: allUsers,
        pagination: {
          page,
          limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / limit)
        }
      });
      
    } catch (error: any) {
      logger.error('Admin users list error', { error: error.message });
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  
  // Admin - Get Beta Waitlist
  app.get("/api/admin/waitlist", requireAdmin, async (req: Request, res: Response) => {
    try {
      const waitlistEntries = await db.select()
        .from(betaWaitlist)
        .orderBy(desc(betaWaitlist.createdAt));
      
      res.json({ waitlist: waitlistEntries });
      
    } catch (error: any) {
      logger.error('Admin waitlist error', { error: error.message });
      res.status(500).json({ error: 'Failed to fetch waitlist' });
    }
  });
  
  // =============================================================================
  // BETA WAITLIST ROUTES
  // =============================================================================
  
  // Join Beta Waitlist
  app.post("/api/beta-waitlist", async (req, res) => {
    try {
      const { email, source = 'landing_page' } = req.body;
      
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
      }
      
      const confirmationToken = generateEmailVerificationToken();
      
      try {
        await db.insert(betaWaitlist).values({
          email: email.toLowerCase(),
          confirmationToken,
          source: sanitizeInput(source)
        });
        
        // Send confirmation email
        await emailService.sendBetaWaitlistConfirmation(email, confirmationToken);
        
        logger.info('Beta waitlist signup', { email, source });
        
        res.json({ 
          success: true, 
          message: 'Added to beta waitlist. Please check your email to confirm.' 
        });
        
      } catch (dbError: any) {
        if (dbError.code === '23505') { // Unique constraint violation
          return res.status(409).json({ error: 'Email already registered for beta access' });
        }
        throw dbError;
      }
      
    } catch (error: any) {
      logger.error('Beta waitlist error', { error: error.message });
      res.status(500).json({ error: 'Failed to add to waitlist' });
    }
  });
  
  // =============================================================================
  // LOAD MANAGEMENT ROUTES (Protected)
  // =============================================================================
  
  // Create Load (Shippers only)
  app.post("/api/loads", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.userId;
      const userRole = (req as any).user.role;
      
      if (userRole !== 'shipper') {
        return res.status(403).json({ error: 'Only shippers can create loads' });
      }
      
      const loadValidation = validateLoadData(req.body);
      if (!loadValidation.isValid) {
        return res.status(400).json({ error: loadValidation.errors[0] });
      }
      
      const [load] = await db.insert(loads).values({
        shipperId: userId,
        originAddress: sanitizeInput(req.body.originAddress),
        destinationAddress: sanitizeInput(req.body.destinationAddress),
        palletCount: req.body.palletCount,
        weight: sanitizeInput(req.body.weight),
        loadType: req.body.loadType,
        rate: req.body.rate,
        description: req.body.description ? sanitizeInput(req.body.description) : null,
        notes: req.body.notes ? sanitizeInput(req.body.notes) : null,
        pickupDate: req.body.pickupDate ? new Date(req.body.pickupDate) : null,
        deliveryDate: req.body.deliveryDate ? new Date(req.body.deliveryDate) : null,
        isUrgent: Boolean(req.body.isUrgent),
        paymentTerms: req.body.paymentTerms || 'net_30'
      }).returning();
      
      logger.info('Load created', { loadId: load.id, shipperId: userId });
      res.status(201).json({ load });
      
    } catch (error: any) {
      logger.error('Create load error', { error: error.message });
      res.status(500).json({ error: 'Failed to create load' });
    }
  });
  
  // Get Available Loads (Drivers)
  app.get("/api/loads", authenticateToken, async (req, res) => {
    try {
      const userRole = (req as any).user.role;
      
      if (userRole === 'driver') {
        // Drivers see available loads
        const availableLoads = await db.select()
          .from(loads)
          .where(eq(loads.status, 'posted'))
          .orderBy(desc(loads.createdAt));
          
        res.json({ loads: availableLoads });
      } else if (userRole === 'shipper') {
        // Shippers see their own loads
        const userId = (req as any).user.userId;
        const userLoads = await db.select()
          .from(loads)
          .where(eq(loads.shipperId, userId))
          .orderBy(desc(loads.createdAt));
          
        res.json({ loads: userLoads });
      } else {
        res.status(403).json({ error: 'Unauthorized' });
      }
      
    } catch (error: any) {
      logger.error('Get loads error', { error: error.message });
      res.status(500).json({ error: 'Failed to fetch loads' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
