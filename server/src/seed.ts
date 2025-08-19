import { db } from './db';
import { users, loads, bids } from '../../shared/schema';
import { hashPassword } from './utils/auth';
import { logger } from './utils/logger';

async function seed() {
  try {
    logger.info('Starting database seeding...');

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
      logger.info(`Created user: ${user.email} (${user.role})`);
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
      logger.info(`Created shipment: ${shipment.originAddress} → ${shipment.destinationAddress}`);
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
      const [bid] = await db.insert(bids).values({
        ...bidData,
        status: 'pending',
      }).returning();
      logger.info(`Created bid: $${bid.bidAmount} on shipment ${bid.loadId}`);
    }

    logger.info('Database seeded successfully!');
    logger.info(`Created ${createdUsers.length} users, ${createdShipments.length} shipments, ${mockBids.length} bids`);
    
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
