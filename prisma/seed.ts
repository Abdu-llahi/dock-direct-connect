import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.load.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dockdirect.com',
      passwordHash: adminPassword,
      role: 'admin',
      name: 'System Administrator',
      emailVerified: true,
      status: 'active',
      profile: {
        create: {
          verificationStatus: 'verified',
          rating: 5.0,
          totalLoads: 0,
          totalRevenue: 0
        }
      }
    }
  });

  // Create shipper users
  const shipperPassword = await bcrypt.hash('shipper123', 10);
  const shipper1 = await prisma.user.create({
    data: {
      email: 'walmart@dockdirect.com',
      passwordHash: shipperPassword,
      role: 'shipper',
      name: 'Walmart Distribution',
      companyName: 'Walmart Inc.',
      phone: '+1-555-0101',
      emailVerified: true,
      status: 'active',
      profile: {
        create: {
          verificationStatus: 'verified',
          rating: 4.8,
          totalLoads: 156,
          totalRevenue: 187200.00
        }
      }
    }
  });

  const shipper2 = await prisma.user.create({
    data: {
      email: 'amazon@dockdirect.com',
      passwordHash: shipperPassword,
      role: 'shipper',
      name: 'Amazon Fulfillment',
      companyName: 'Amazon.com Inc.',
      phone: '+1-555-0102',
      emailVerified: true,
      status: 'active',
      profile: {
        create: {
          verificationStatus: 'verified',
          rating: 4.9,
          totalLoads: 98,
          totalRevenue: 147600.00
        }
      }
    }
  });

  // Create driver users
  const driverPassword = await bcrypt.hash('driver123', 10);
  const driver1 = await prisma.user.create({
    data: {
      email: 'mike.rodriguez@dockdirect.com',
      passwordHash: driverPassword,
      role: 'driver',
      name: 'Mike Rodriguez',
      companyName: 'Rodriguez Trucking',
      phone: '+1-555-0201',
      emailVerified: true,
      status: 'active',
      profile: {
        create: {
          verificationStatus: 'verified',
          rating: 4.9,
          totalLoads: 47,
          totalRevenue: 28400.00
        }
      }
    }
  });

  const driver2 = await prisma.user.create({
    data: {
      email: 'sarah.chen@dockdirect.com',
      passwordHash: driverPassword,
      role: 'driver',
      name: 'Sarah Chen',
      companyName: 'Chen Logistics',
      phone: '+1-555-0202',
      emailVerified: true,
      status: 'active',
      profile: {
        create: {
          verificationStatus: 'verified',
          rating: 4.8,
          totalLoads: 42,
          totalRevenue: 25200.00
        }
      }
    }
  });

  const driver3 = await prisma.user.create({
    data: {
      email: 'carlos.martinez@dockdirect.com',
      passwordHash: driverPassword,
      role: 'driver',
      name: 'Carlos Martinez',
      companyName: 'Martinez Transport',
      phone: '+1-555-0203',
      emailVerified: true,
      status: 'active',
      profile: {
        create: {
          verificationStatus: 'verified',
          rating: 4.9,
          totalLoads: 39,
          totalRevenue: 23400.00
        }
      }
    }
  });

  console.log('👥 Created users');

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Walmart Distribution Center - Chicago',
        address: '1234 Industrial Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        latitude: 41.8781,
        longitude: -87.6298
      }
    }),
    prisma.location.create({
      data: {
        name: 'Amazon Fulfillment Center - Detroit',
        address: '5678 Warehouse Way',
        city: 'Detroit',
        state: 'MI',
        zipCode: '48201',
        latitude: 42.3314,
        longitude: -83.0458
      }
    }),
    prisma.location.create({
      data: {
        name: 'Target Distribution Center - Atlanta',
        address: '9012 Logistics Lane',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30301',
        latitude: 33.7490,
        longitude: -84.3880
      }
    }),
    prisma.location.create({
      data: {
        name: 'Home Depot Distribution - Miami',
        address: '3456 Supply Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        latitude: 25.7617,
        longitude: -80.1918
      }
    }),
    prisma.location.create({
      data: {
        name: 'Costco Warehouse - Dallas',
        address: '7890 Bulk Blvd',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201',
        latitude: 32.7767,
        longitude: -96.7970
      }
    }),
    prisma.location.create({
      data: {
        name: 'Lowe\'s Distribution Center - Houston',
        address: '2345 Hardware Highway',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        latitude: 29.7604,
        longitude: -95.3698
      }
    })
  ]);

  console.log('📍 Created locations');

  // Create loads
  const loads = await Promise.all([
    prisma.load.create({
      data: {
        shipperId: shipper1.id,
        originLocationId: locations[0].id,
        destinationLocationId: locations[1].id,
        title: 'Urgent: Electronics from Chicago to Detroit',
        description: 'High-value electronics requiring careful handling. Temperature controlled environment required.',
        palletCount: 22,
        weightLbs: 44000.00,
        dimensions: '48" x 48" x 72"',
        loadType: 'Electronics',
        rateCents: 240000, // $2,400
        status: 'open',
        pickupDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        deliveryDate: new Date(Date.now() + 26 * 60 * 60 * 1000), // 26 hours from now
        isUrgent: true,
        paymentTerms: 'Quick Pay (24 hours)',
        specialRequirements: 'Temperature controlled, careful handling, insurance required'
      }
    }),
    prisma.load.create({
      data: {
        shipperId: shipper2.id,
        originLocationId: locations[2].id,
        destinationLocationId: locations[3].id,
        title: 'Furniture from Atlanta to Miami',
        description: 'Residential furniture for new store opening. Stackable items.',
        palletCount: 15,
        weightLbs: 30000.00,
        dimensions: '48" x 48" x 60"',
        loadType: 'Furniture',
        rateCents: 180000, // $1,800
        status: 'open',
        pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        deliveryDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
        isUrgent: false,
        paymentTerms: 'Net 15 days',
        specialRequirements: 'Stackable items, no special handling required'
      }
    }),
    prisma.load.create({
      data: {
        shipperId: shipper1.id,
        originLocationId: locations[4].id,
        destinationLocationId: locations[5].id,
        title: 'Food & Beverage from Dallas to Houston',
        description: 'Perishable food items requiring refrigeration.',
        palletCount: 18,
        weightLbs: 36000.00,
        dimensions: '48" x 48" x 84"',
        loadType: 'Refrigerated',
        rateCents: 210000, // $2,100
        status: 'open',
        pickupDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        deliveryDate: new Date(Date.now() + 30 * 60 * 60 * 1000), // 30 hours from now
        isUrgent: false,
        paymentTerms: 'Net 30 days',
        specialRequirements: 'Refrigerated trailer required, temperature monitoring'
      }
    }),
    prisma.load.create({
      data: {
        shipperId: shipper2.id,
        originLocationId: locations[1].id,
        destinationLocationId: locations[0].id,
        title: 'Automotive Parts from Detroit to Chicago',
        description: 'Heavy automotive parts requiring specialized equipment.',
        palletCount: 12,
        weightLbs: 48000.00,
        dimensions: '48" x 48" x 96"',
        loadType: 'Automotive',
        rateCents: 280000, // $2,800
        status: 'assigned',
        pickupDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        deliveryDate: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 hours from now
        isUrgent: true,
        paymentTerms: 'Quick Pay (24 hours)',
        specialRequirements: 'Heavy equipment, specialized loading/unloading'
      }
    })
  ]);

  console.log('📦 Created loads');

  // Create bids
  const bids = await Promise.all([
    prisma.bid.create({
      data: {
        loadId: loads[0].id,
        driverId: driver1.id,
        bidAmountCents: 235000, // $2,350
        message: 'I have experience with electronics and can pick up within 1 hour. I have temperature controlled trailer.',
        status: 'pending',
        estimatedPickupTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
        estimatedDeliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    }),
    prisma.bid.create({
      data: {
        loadId: loads[0].id,
        driverId: driver2.id,
        bidAmountCents: 245000, // $2,450
        message: 'Available immediately. I have insurance and temperature controlled equipment.',
        status: 'pending',
        estimatedPickupTime: new Date(Date.now() + 30 * 60 * 1000),
        estimatedDeliveryTime: new Date(Date.now() + 25 * 60 * 60 * 1000)
      }
    }),
    prisma.bid.create({
      data: {
        loadId: loads[1].id,
        driverId: driver3.id,
        bidAmountCents: 175000, // $1,750
        message: 'Perfect route for me. I can handle the furniture carefully.',
        status: 'pending',
        estimatedPickupTime: new Date(Date.now() + 22 * 60 * 60 * 1000),
        estimatedDeliveryTime: new Date(Date.now() + 46 * 60 * 60 * 1000)
      }
    }),
    prisma.bid.create({
      data: {
        loadId: loads[2].id,
        driverId: driver1.id,
        bidAmountCents: 205000, // $2,050
        message: 'I have refrigerated trailer and can pick up today.',
        status: 'accepted',
        estimatedPickupTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        estimatedDeliveryTime: new Date(Date.now() + 28 * 60 * 60 * 1000)
      }
    })
  ]);

  console.log('💰 Created bids');

  // Create contracts
  const contracts = await Promise.all([
    prisma.contract.create({
      data: {
        loadId: loads[3].id,
        shipperId: shipper1.id,
        driverId: driver2.id,
        contractNumber: 'CON-2024-001',
        terms: 'Standard freight contract with insurance coverage. Payment terms: Quick Pay (24 hours).',
        rateCents: 280000, // $2,800
        status: 'signed',
        shipperSignedAt: new Date(),
        driverSignedAt: new Date(),
        shipperSignature: 'Walmart Distribution',
        driverSignature: 'Sarah Chen'
      }
    }),
    prisma.contract.create({
      data: {
        loadId: loads[2].id,
        shipperId: shipper2.id,
        driverId: driver1.id,
        contractNumber: 'CON-2024-002',
        terms: 'Refrigerated freight contract with temperature monitoring requirements.',
        rateCents: 205000, // $2,050
        status: 'pending',
        shipperSignedAt: new Date(),
        shipperSignature: 'Amazon Fulfillment'
      }
    })
  ]);

  console.log('📄 Created contracts');

  // Create documents
  const documents = await Promise.all([
    prisma.document.create({
      data: {
        loadId: loads[0].id,
        contractId: null,
        type: 'rate_confirm',
        fileName: 'rate_confirmation_chicago_detroit.pdf',
        fileUrl: '/documents/rate_confirmation_chicago_detroit.pdf',
        fileSize: 245760,
        uploadedBy: shipper1.id
      }
    }),
    prisma.document.create({
      data: {
        loadId: loads[3].id,
        contractId: contracts[0].id,
        type: 'contract',
        fileName: 'contract_CON_2024_001.pdf',
        fileUrl: '/documents/contract_CON_2024_001.pdf',
        fileSize: 512000,
        uploadedBy: admin.id
      }
    })
  ]);

  console.log('📋 Created documents');

  // Create audit logs
  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'USER_CREATED',
        tableName: 'users',
        recordId: shipper1.id,
        newValues: { email: shipper1.email, role: shipper1.role },
        ipAddress: '127.0.0.1',
        userAgent: 'Prisma Seed Script'
      }
    }),
    prisma.auditLog.create({
      data: {
        userId: shipper1.id,
        action: 'LOAD_CREATED',
        tableName: 'loads',
        recordId: loads[0].id,
        newValues: { title: loads[0].title, status: loads[0].status },
        ipAddress: '127.0.0.1',
        userAgent: 'Prisma Seed Script'
      }
    })
  ]);

  console.log('📊 Created audit logs');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Locations: ${await prisma.location.count()}`);
  console.log(`- Loads: ${await prisma.load.count()}`);
  console.log(`- Bids: ${await prisma.bid.count()}`);
  console.log(`- Contracts: ${await prisma.contract.count()}`);
  console.log(`- Documents: ${await prisma.document.count()}`);
  console.log(`- Audit Logs: ${await prisma.auditLog.count()}`);

  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@dockdirect.com / admin123');
  console.log('Shipper: walmart@dockdirect.com / shipper123');
  console.log('Driver: mike.rodriguez@dockdirect.com / driver123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
