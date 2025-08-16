import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users, refreshTokens } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
const JWT_EXPIRES_IN = '15m'; // Access token expires in 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Refresh token expires in 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Generate JWT tokens
export const generateTokens = async (user: { id: string; email: string; role: string }) => {
  // Generate access token
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Generate refresh token
  const refreshTokenValue = crypto.randomBytes(32).toString('hex');
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days

  // Store refresh token in database
  await db.insert(refreshTokens).values({
    userId: user.id,
    token: refreshTokenValue,
    expiresAt: refreshTokenExpiry,
  });

  const refreshToken = jwt.sign(
    { userId: user.id, tokenId: refreshTokenValue },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Verify JWT token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

// Middleware to authenticate requests
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Add user info to request
  (req as any).user = payload;
  next();
};

// Middleware to check user roles
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    
    // Check if refresh token exists and is not revoked
    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, payload.tokenId));

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    // Get user data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId));

    if (!user) {
      throw new Error('User not found');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { accessToken };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Revoke refresh token (for logout)
export const revokeRefreshToken = async (refreshToken: string) => {
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    
    await db
      .update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.token, payload.tokenId));
    
    return true;
  } catch (error) {
    return false;
  }
};

// Generate email verification token
export const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Admin authentication for admin routes
export const requireAdmin = [authenticateToken, requireRole(['admin'])];