import { pgTable, text, uuid, timestamp, pgEnum, boolean, integer, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define enums for better type safety
export const userRoleEnum = pgEnum('user_role', ['driver', 'shipper', 'admin']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'approved', 'rejected']);
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended', 'pending']);
export const loadStatusEnum = pgEnum('load_status', ['posted', 'assigned', 'in_transit', 'completed', 'cancelled']);
export const bidStatusEnum = pgEnum('bid_status', ['pending', 'accepted', 'rejected']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'cancelled', 'expired', 'trial']);

// Core Users table - Enterprise ready with comprehensive fields
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"), // For future password implementation
  name: text("name").notNull(),
  phone: text("phone"),
  role: userRoleEnum("role").notNull(),
  status: userStatusEnum("status").default('pending'),
  verificationStatus: verificationStatusEnum("verification_status").default('pending'),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User profiles for additional business information
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).unique(),
  companyName: text("company_name"),
  businessAddress: text("business_address"),
  licenseNumber: text("license_number"), // For drivers
  mcDotNumber: text("mc_dot_number"), // For drivers
  einNumber: text("ein_number"), // For shippers
  profilePhotoUrl: text("profile_photo_url"),
  bio: text("bio"),
  website: text("website"),
  socialLinks: jsonb("social_links"), // {linkedin, twitter, etc}
  preferences: jsonb("preferences"), // User preference settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Loads table for shipment management
export const loads = pgTable("loads", {
  id: uuid("id").primaryKey().defaultRandom(),
  shipperId: uuid("shipper_id").references(() => users.id).notNull(),
  assignedDriverId: uuid("assigned_driver_id").references(() => users.id),
  originAddress: text("origin_address").notNull(),
  destinationAddress: text("destination_address").notNull(),
  palletCount: integer("pallet_count").notNull(),
  weight: text("weight").notNull(),
  loadType: text("load_type").notNull(), // dry, refrigerated, hazmat, etc
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  notes: text("notes"),
  pickupDate: timestamp("pickup_date"),
  deliveryDate: timestamp("delivery_date"),
  status: loadStatusEnum("status").default('posted'),
  isUrgent: boolean("is_urgent").default(false),
  paymentTerms: text("payment_terms"), // quick_pay, net_30, etc
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bids table for driver bidding system
export const bids = pgTable("bids", {
  id: uuid("id").primaryKey().defaultRandom(),
  loadId: uuid("load_id").references(() => loads.id, { onDelete: 'cascade' }).notNull(),
  driverId: uuid("driver_id").references(() => users.id).notNull(),
  bidAmount: decimal("bid_amount", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  status: bidStatusEnum("status").default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Beta waitlist for early access management
export const betaWaitlist = pgTable("beta_waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  confirmed: boolean("confirmed").default(false),
  confirmationToken: text("confirmation_token"),
  confirmedAt: timestamp("confirmed_at"),
  source: text("source"), // landing_page, referral, etc
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription plans for monetization
export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  billingInterval: text("billing_interval").notNull(), // monthly, yearly
  features: jsonb("features"), // JSON array of features
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  planId: uuid("plan_id").references(() => subscriptionPlans.id).notNull(),
  status: subscriptionStatusEnum("status").default('trial'),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit logs for security and compliance
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(), // login, signup, load_created, etc
  resourceType: text("resource_type"), // user, load, bid
  resourceId: text("resource_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"), // Additional context
  createdAt: timestamp("created_at").defaultNow(),
});

// JWT refresh tokens for secure authentication
export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  isRevoked: boolean("is_revoked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertUserProfileSchema = createInsertSchema(userProfiles);
export const insertLoadSchema = createInsertSchema(loads);
export const insertBidSchema = createInsertSchema(bids);
export const insertBetaWaitlistSchema = createInsertSchema(betaWaitlist);
export const insertAuditLogSchema = createInsertSchema(auditLogs);

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertLoad = z.infer<typeof insertLoadSchema>;
export type Load = typeof loads.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertBetaWaitlist = z.infer<typeof insertBetaWaitlistSchema>;
export type BetaWaitlist = typeof betaWaitlist.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type RefreshToken = typeof refreshTokens.$inferSelect;
