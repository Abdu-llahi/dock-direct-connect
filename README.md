# Dock Direct Connect

AI-assisted dispatch, instant driver matching. Book, track, and close loads in minutes. Smart contracts, live bids, and compliance—handled.

## 🚀 Features

- **Smart Shipment Posting**: AI-optimized load descriptions with automatic pricing suggestions
- **Live Bidding System**: Real-time driver bidding with instant notifications
- **Smart Contract Previews**: Automated contract generation with legal compliance
- **Compliance Automation**: Built-in regulatory compliance and safety monitoring
- **PWA Ready**: Progressive Web App with offline capabilities
- **Mobile Ready**: Capacitor configuration for future iOS/Android apps

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **JWT Authentication** (jose library)
- **bcrypt** for password hashing
- **Pino** for logging
- **Zod** for validation

### Frontend
- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **React Router** for navigation
- **React Query** for data fetching
- **PWA** with service worker

### Database
- **Neon Postgres** (serverless)
- **Prisma migrations**

### Deployment
- **Railway** (backend)
- **Vercel** (frontend)
- **GitHub Actions** (CI/CD)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon Postgres database
- Railway account (for backend deployment)
- Vercel account (for frontend deployment)

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dock-direct-connect
   ```

2. **Start the database**
   ```bash
   npm run db:up
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # The .env file should contain:
   DATABASE_URL="postgresql://dockdirect:dockdirect123@localhost:5432/dockdirect"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   NODE_ENV="development"
   PORT=5000
   CLIENT_URL="http://localhost:5173"
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

6. **Run database migrations**
   ```bash
   npm run migrate
   ```

7. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

8. **Start the development server**
   ```bash
   npm run dev
   ```

9. **Open the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Test Credentials
After seeding, you can use these test accounts:

- **Admin**: admin@dockdirect.com / admin123
- **Shipper**: walmart@dockdirect.com / shipper123
- **Driver**: mike.rodriguez@dockdirect.com / driver123

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
└── env.example           # Environment variables template
```

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** + **PostgreSQL** (Docker)
- **JWT Authentication** (jose library)
- **bcrypt** for password hashing
- **Pino** for logging
- **Zod** for validation

### Frontend
- **Vite** + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **React Router** for navigation
- **React Query** for data fetching
- **PWA** with service worker

### Database
- **PostgreSQL** (Docker Compose)
- **Prisma migrations**

### Local Development
- **Docker Compose** for database
- **Cross-platform** environment variables
- **Hot reload** development server

Start the development server:

```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### 5. Testing

Run the test suite:

```bash
npm run test
```

## 📁 Project Structure

```
dock-direct-connect/
├── client/                 # Frontend React app
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities and API client
│   │   └── ...
│   └── ...
├── server/                # Backend Express app
│   ├── src/
│   │   ├── utils/         # Utilities (auth, logger)
│   │   ├── routes.ts      # API routes
│   │   ├── app.ts         # Express app setup
│   │   ├── db.ts          # Database connection
│   │   ├── seed.ts        # Database seeding
│   │   └── test.ts        # API tests
│   └── ...
├── shared/                # Shared types and schemas
│   └── schema.prisma      # Prisma schema
├── migrations/            # Database migrations
├── capacitor.config.ts    # Capacitor mobile config
├── manifest.json          # PWA manifest
└── ...
```

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

### Testing
- `npm run test` - Run test suite
- `npm run check` - Type checking

## 🚀 Deployment

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables:
   - `VITE_API_URL`: Your Railway backend URL

### Environment Variables for Production

```env
# Backend (Railway)
DATABASE_URL=your-neon-database-url
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production

# Frontend (Vercel)
VITE_API_URL=https://your-railway-app.railway.app
```

## 📱 PWA Features

The app is configured as a Progressive Web App with:

- **Offline Support**: Service worker caches essential resources
- **Install Prompt**: Users can install the app on their devices
- **App-like Experience**: Full-screen mode and native-like navigation
- **Push Notifications**: Ready for future implementation

## 📱 Mobile App (Future)

The project includes Capacitor configuration for future mobile app development:

- **iOS**: Native iOS app using Capacitor
- **Android**: Native Android app using Capacitor
- **Shared Code**: Same React codebase for web and mobile

To build for mobile (when ready):

```bash
npm install @capacitor/cli @capacitor/core
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
npx cap sync
```

## 🔐 Authentication

The app uses JWT-based authentication with role-based access control:

- **Roles**: shipper, driver, admin
- **Token Expiry**: 24 hours
- **Password Hashing**: bcrypt with salt rounds 12
- **Secure Headers**: Helmet.js for security

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Shipments
- `POST /api/shipments` - Create shipment (shipper only)
- `GET /api/shipments` - Get shipments (role-filtered)
- `PATCH /api/shipments/:id/status` - Update shipment status

### Bids
- `POST /api/bids` - Create bid (driver only)
- `POST /api/bids/:id/accept` - Accept bid (shipper only)

### Development
- `POST /api/seed` - Seed database (development only)
- `GET /healthz` - Health check

## 🧪 Testing

The project includes unit tests for:

- Authentication endpoints
- Shipment management
- API validation
- Error handling

Run tests with:

```bash
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🗺 Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Payment integration
- [ ] Advanced compliance features
- [ ] AI-powered route optimization
- [ ] Multi-language support
