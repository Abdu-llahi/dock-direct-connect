import db from './db';
import { hashPassword } from './utils/auth';
import { logger } from './utils/logger';

async function seed() {
  try {
    logger.info('Starting database seeding...');

    // Clear existing data
    await db.bid.deleteMany();
    await db.load.deleteMany();
    await db.user.deleteMany();

    // Create mock users
    const mockUsers = [
      { email: 'shipper@example.com', password: 'password123', name: 'John Shipper', role: 'shipper' as const },
      { email: 'driver1@example.com', password: 'password123', name: 'Mike Driver', role: 'driver' as const },
      { email: 'driver2@example.com', password: 'password123', name: 'Sarah Driver', role: 'driver' as const },
    ];

    const createdUsers = [];
    for (const userData of mockUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = await db.user.create({
        data: {
          email: userData.email,
          passwordHash: hashedPassword,
          name: userData.name,
          role: userData.role,
          status: 'active',
          emailVerified: true,
        },
      });
      createdUsers.push(user);
      logger.info(`Created user: ${user.email} (${user.role})`);
    }

    // Create mock loads
    const mockLoads = [
      {
        shipperId: createdUsers[0].id,
        title: 'Electronics shipment',
        description: 'Electronics shipment',
        palletCount: 10,
        weightLbs: 5000,
        loadType: 'dry',
        rateCents: 250000,
        isUrgent: true,
      },
      {
        shipperId: createdUsers[0].id,
        title: 'Perishable goods',
        description: 'Perishable goods',
        palletCount: 15,
        weightLbs: 7500,
        loadType: 'refrigerated',
        rateCents: 320000,
        isUrgent: false,
      },
      {
        shipperId: createdUsers[0].id,
        title: 'General freight',
        description: 'General freight',
        palletCount: 8,
        weightLbs: 4000,
        loadType: 'dry',
        rateCents: 180000,
        isUrgent: false,
      },
      {
        shipperId: createdUsers[0].id,
        title: 'Industrial parts',
        description: 'Industrial parts',
        palletCount: 12,
        weightLbs: 6000,
        loadType: 'dry',
        rateCents: 220000,
        isUrgent: true,
      },
      {
        shipperId: createdUsers[0].id,
        title: 'Food products',
        description: 'Food products',
        palletCount: 6,
        weightLbs: 3000,
        loadType: 'refrigerated',
        rateCents: 150000,
        isUrgent: false,
      },
      {
        shipperId: createdUsers[0].id,
        title: 'Heavy machinery',
        description: 'Heavy machinery',
        palletCount: 20,
        weightLbs: 10000,
        loadType: 'dry',
        rateCents: 280000,
        isUrgent: true,
      },
      {
        shipperId: createdUsers[0].id,
        title: 'Tech equipment',
        description: 'Tech equipment',
        palletCount: 5,
        weightLbs: 2500,
        loadType: 'dry',
        rateCents: 120000,
        isUrgent: false,
      },
      {
        shipperId: createdUsers[0].id,
        title: 'Automotive parts',
        description: 'Automotive parts',
        palletCount: 18,
        weightLbs: 9000,
        loadType: 'dry',
        rateCents: 260000,
        isUrgent: false,
      },
    ];

    const createdLoads = [];
    for (const loadData of mockLoads) {
      const load = await db.load.create({
        data: {
          ...loadData,
          status: 'open',
        },
      });
      createdLoads.push(load);
      logger.info(`Created load: ${load.title}`);
    }

    // Create mock bids
    const mockBids = [
      { loadId: createdLoads[0].id, driverId: createdUsers[1].id, bidAmountCents: 240000, message: 'Available immediately' },
      { loadId: createdLoads[0].id, driverId: createdUsers[2].id, bidAmountCents: 230000, message: 'Best rate guaranteed' },
      { loadId: createdLoads[1].id, driverId: createdUsers[1].id, bidAmountCents: 310000, message: 'Refrigerated trailer ready' },
      { loadId: createdLoads[2].id, driverId: createdUsers[2].id, bidAmountCents: 175000, message: 'Experienced driver' },
      { loadId: createdLoads[3].id, driverId: createdUsers[1].id, bidAmountCents: 210000, message: 'Quick pickup available' },
    ];

    for (const bidData of mockBids) {
      const bid = await db.bid.create({
        data: {
          ...bidData,
          status: 'pending',
        },
      });
      logger.info(`Created bid: $${bid.bidAmountCents / 100} on load ${bid.loadId}`);
    }

    logger.info('Database seeded successfully!');
    logger.info(`Created ${createdUsers.length} users, ${createdLoads.length} loads, ${mockBids.length} bids`);
    
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
