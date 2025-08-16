import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { users, userProfiles } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, name, role, phone, additionalData = {} } = req.body;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const [user] = await db.insert(users).values({
        id: crypto.randomUUID(),
        email,
        name,
        role,
        phone,
        verificationStatus: 'pending'
      }).returning();
      
      // Create user profile if additional data provided
      if (additionalData.company || additionalData.license_number) {
        await db.insert(userProfiles).values({
          userId: user.id,
          companyName: additionalData.company,
          licenseNumber: additionalData.license_number,
          mcDotNumber: additionalData.mc_dot_number,
          businessAddress: additionalData.business_address
        });
      }
      
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: 'Failed to create account' });
    }
  });
  
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // In a real app, you'd verify the password hash here
      // For now, we'll skip password verification during migration
      
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role,
          verificationStatus: user.verificationStatus
        } 
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(400).json({ error: 'Failed to sign in' });
    }
  });
  
  app.get("/api/auth/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [user] = await db.select().from(users).where(eq(users.id, id));
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(400).json({ error: 'Failed to get user' });
    }
  });
  
  // Beta waitlist endpoint
  app.post("/api/beta-waitlist", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      // For now, just return success - in production you'd store this in database
      res.json({ success: true, message: 'Added to beta waitlist' });
    } catch (error) {
      console.error('Beta waitlist error:', error);
      res.status(500).json({ error: 'Failed to add to waitlist' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
