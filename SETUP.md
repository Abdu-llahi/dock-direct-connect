# Dock Direct Connect - Local Development Setup

## 🚀 Quick Start Guide

This guide will help you set up Dock Direct Connect for local development.

## Prerequisites

### Option 1: Docker Setup (Recommended)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Docker Compose** - Usually included with Docker Desktop

### Option 2: Local PostgreSQL Setup
- **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/)
- **pgAdmin** (optional) - [Download here](https://www.pgadmin.org/download/)

## Step-by-Step Setup

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd dock-direct-connect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL database
npm run db:up

# Verify database is running
docker ps
```

#### Option B: Using Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a database named `dockdirect`
3. Create a user `dockdirect` with password `dockdirect123`
4. Update the `DATABASE_URL` in your `.env` file

### 4. Environment Configuration
```bash
# Copy environment template
cp env.example .env
```

Your `.env` file should contain:
```env
# Database Configuration
DATABASE_URL="postgresql://dockdirect:dockdirect123@localhost:5432/dockdirect"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Application Configuration
NODE_ENV="development"
PORT=5000

# Client Configuration
CLIENT_URL="http://localhost:5173"

# Logging Configuration
LOG_LEVEL="info"
```

### 5. Database Schema Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run migrate

# Seed the database with sample data
npm run seed
```

### 6. Start Development Server
```bash
# Start the backend server
npm run dev
```

### 7. Start Frontend (in a new terminal)
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```

## 🎯 Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432
- **Prisma Studio** (Database GUI): `npm run db:studio`

## 🔑 Test Credentials

After running the seed script, you can use these test accounts:

### Admin Account
- **Email**: admin@dockdirect.com
- **Password**: admin123
- **Role**: System Administrator

### Shipper Accounts
- **Email**: walmart@dockdirect.com
- **Password**: shipper123
- **Role**: Shipper (Walmart Distribution)

- **Email**: amazon@dockdirect.com
- **Password**: shipper123
- **Role**: Shipper (Amazon Fulfillment)

### Driver Accounts
- **Email**: mike.rodriguez@dockdirect.com
- **Password**: driver123
- **Role**: Driver (Rodriguez Trucking)

- **Email**: sarah.chen@dockdirect.com
- **Password**: driver123
- **Role**: Driver (Chen Logistics)

- **Email**: carlos.martinez@dockdirect.com
- **Password**: driver123
- **Role**: Driver (Martinez Transport)

## 📊 Sample Data

The seed script creates:
- **6 Locations**: Distribution centers across major US cities
- **4 Loads**: Various shipment types (electronics, furniture, refrigerated, automotive)
- **4 Bids**: Driver bids on available loads
- **2 Contracts**: Signed and pending contracts
- **2 Documents**: Rate confirmations and contracts
- **2 Audit Logs**: Sample activity tracking

## 🛠 Available Scripts

```bash
# Database Management
npm run db:up          # Start database with Docker
npm run db:down        # Stop database
npm run db:reset       # Reset database (removes all data)
npm run db:generate    # Generate Prisma client
npm run db:studio      # Open Prisma Studio (database GUI)

# Development
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server

# Database Operations
npm run migrate        # Run database migrations
npm run seed           # Seed database with sample data

# Testing
npm run test           # Run tests
npm run check          # Type checking
```

## 🔧 Troubleshooting

### Database Connection Issues
1. **Docker not running**: Make sure Docker Desktop is started
2. **Port conflicts**: Check if port 5432 is available
3. **Wrong credentials**: Verify DATABASE_URL in .env file

### Prisma Issues
1. **Client not generated**: Run `npm run db:generate`
2. **Migration errors**: Run `npm run db:reset` to start fresh
3. **Schema changes**: Run `npm run migrate` after schema updates

### Development Server Issues
1. **Port conflicts**: Change PORT in .env file
2. **Dependencies**: Run `npm install` again
3. **Environment variables**: Verify .env file exists and is properly configured

## 📁 Project Structure

```
dock-direct-connect/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── server/                # Express backend
│   └── src/
│       ├── routes.ts      # API routes
│       ├── db.ts          # Database connection
│       └── utils/         # Utilities
├── prisma/                # Database schema & migrations
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts           # Database seeding
├── docker-compose.yml     # Database setup
├── env.example           # Environment variables template
└── SETUP.md              # This file
```

## 🚀 Next Steps

1. **Explore the API**: Visit http://localhost:5000/healthz to verify backend is running
2. **Test Authentication**: Try logging in with the test credentials
3. **Create Loads**: Use the shipper account to post new loads
4. **Place Bids**: Use driver accounts to bid on available loads
5. **Review Contracts**: Check out the contract management features

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure Docker is running (if using Docker setup)
4. Check the console logs for error messages

Happy coding! 🎉
