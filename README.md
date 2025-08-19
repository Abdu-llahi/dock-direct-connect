# Dock Direct Connect 🚛📦

**Direct freight connections between shippers and drivers. No brokers. No delays. Just results.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## 🎯 Overview

Dock Direct Connect is a revolutionary freight logistics platform that eliminates traditional broker fees by connecting shippers directly with qualified drivers. Built with modern web technologies, it provides real-time load matching, instant payments, and comprehensive tracking capabilities.

### ✨ Key Features

- **Direct Connections**: Connect shippers with drivers without broker intermediaries
- **AI-Powered Matching**: Intelligent load-driver matching based on location, equipment, and availability
- **Real-Time Tracking**: Live shipment tracking with GPS integration
- **Instant Payments**: Automated payment processing with escrow protection
- **Multi-Factor Authentication**: Enhanced security with SMS/email verification
- **Mobile-First Design**: Responsive web app optimized for mobile devices
- **Comprehensive Analytics**: Detailed reporting and business intelligence
- **Regulatory Compliance**: Built-in safety monitoring and compliance tools

## 🏗️ Architecture

```
dock-direct-connect/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions and API client
├── server/                 # Node.js + Express backend
│   ├── src/
│   │   ├── routes/        # API endpoint definitions
│   │   ├── utils/         # Authentication, logging, etc.
│   │   └── db.ts          # Database connection
├── prisma/                 # Database schema and migrations
└── shared/                 # Shared types and utilities
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** 8+
- **PostgreSQL** 14+ database
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/dock-direct-connect.git
cd dock-direct-connect
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Environment Setup

Copy the environment template and configure your settings:

```bash
cp env.example .env
```

Update `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dock_direct_connect"

# JWT Secrets (generate secure random strings)
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Server
PORT=3001
NODE_ENV=development

# Email (for MFA and password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:server    # Backend on port 3001
npm run dev:client    # Frontend on port 5173
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following core entities:

- **Users**: Shippers, drivers, admins, and warehouse operators
- **Loads**: Shipment details, requirements, and status
- **Bids**: Driver proposals for loads
- **Contracts**: Legal agreements between parties
- **Documents**: Rate confirmations, BOLs, invoices
- **Locations**: Geographic data for routing
- **Audit Logs**: Comprehensive activity tracking

## 🔐 Authentication & Security

### User Roles & Permissions

- **Shipper**: Post loads, manage shipments, track deliveries
- **Driver**: View loads, submit bids, manage routes
- **Admin**: Platform management, user approval, analytics
- **Warehouse**: Inventory management, loading coordination

### Security Features

- JWT-based authentication with refresh tokens
- Multi-factor authentication (SMS/email)
- Password reset with secure tokens
- Role-based access control
- Rate limiting and DDoS protection
- Input validation and sanitization
- SQL injection prevention

## 📱 Frontend Features

### Responsive Design
- Mobile-first approach
- Progressive Web App (PWA) capabilities
- Touch-optimized interfaces
- Cross-browser compatibility

### User Experience
- Intuitive navigation
- Real-time updates
- Interactive dashboards
- Smooth animations and transitions
- Accessibility compliance

### Technology Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Query** for data fetching
- **Framer Motion** for animations

## 🔧 Backend Features

### API Design
- RESTful endpoints
- GraphQL support (planned)
- WebSocket for real-time features
- Rate limiting and throttling
- Comprehensive error handling

### Performance
- Database query optimization
- Caching strategies
- Connection pooling
- Async/await patterns
- Memory leak prevention

### Technology Stack
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma** ORM
- **PostgreSQL** database
- **JWT** authentication
- **Pino** logging

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific areas
npm run test:server    # Backend tests
npm run test:client    # Frontend tests

# Coverage reports
npm run test:coverage
```

## 📦 Deployment

### Production Build

```bash
# Build both applications
npm run build

# Start production server
npm start
```

### Environment Variables

Ensure all production environment variables are set:
- Database connection strings
- JWT secrets
- SMTP configuration
- CORS origins
- Log levels

### Docker Support

```bash
# Build and run with Docker
docker-compose up -d

# Or build custom image
docker build -t dock-direct-connect .
docker run -p 3001:3001 dock-direct-connect
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits
- Comprehensive testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Reference](docs/API.md)
- [User Guide](docs/USER_GUIDE.md)
- [Developer Guide](docs/DEVELOPER.md)

### Community
- [Discussions](https://github.com/your-org/dock-direct-connect/discussions)
- [Issues](https://github.com/your-org/dock-direct-connect/issues)
- [Wiki](https://github.com/your-org/dock-direct-connect/wiki)

### Contact
- **Email**: support@dockdirectconnect.com
- **Discord**: [Join our community](https://discord.gg/dockdirect)
- **Twitter**: [@DockDirect](https://twitter.com/DockDirect)

## 🙏 Acknowledgments

- Built with ❤️ by the Dock Direct Connect team
- Inspired by the need for transparent, efficient freight logistics
- Powered by modern web technologies and best practices

---

**Ready to revolutionize your freight operations?** [Get Started Today](https://dockdirectconnect.com) 🚀
