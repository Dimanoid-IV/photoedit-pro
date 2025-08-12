# PhotoPrint Web - Professional Photo Printing PWA

A full-featured browser-based PWA for photo printing services, similar to Mimigram. Built with modern web technologies and designed for scalability.

## 🚀 Features

### User Features
- **Authentication**: Email/password + OAuth (Google, Facebook), guest checkout
- **Photo Management**: Upload (files, drag&drop, camera), import from Google Photos/Instagram
- **Product Configurator**: Format/layout/material selection, drag&drop positioning, real-time preview
- **Photo Editor**: Crop, rotate, flip, brightness/contrast/saturation, filters, text overlay, templates
- **Shopping**: Cart, promo codes, shipping calculator, secure checkout
- **Payment**: Stripe integration + local gateway example
- **Account**: Order history, reorder functionality
- **Notifications**: Email + SMS updates

### Admin Features
- **Order Management**: View, process, export orders
- **Product Management**: Catalog management, pricing, templates
- **Print-Ready Export**: ZIP files with PDF/JPEG + JSON metadata
- **Integration**: Webhook/FTP delivery to print shops

### Product Catalog
- Photo prints, photobooks, posters, canvases, frames
- Magnets, mugs, t-shirts, puzzles, calendars
- Each with precise templates, bleed zones, DPI recommendations

## 🏗️ Architecture

### Monorepo Structure
```
photoprint-web/
├── apps/
│   ├── frontend/          # Next.js + TypeScript + Tailwind
│   ├── backend/           # NestJS + TypeScript
│   └── admin/             # Admin dashboard
├── packages/
│   ├── shared/            # Shared types, utilities
│   ├── ui/                # Design system components
│   └── config/            # Shared configurations
├── infra/
│   ├── docker/            # Docker configurations
│   ├── k8s/               # Kubernetes manifests
│   └── terraform/         # Infrastructure as code
├── docs/                  # Documentation
└── tools/                 # Build tools, scripts
```

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, PWA
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Cache/Queue**: Redis + BullMQ
- **Storage**: S3-compatible (MinIO for dev)
- **Image Processing**: Sharp, PDFKit
- **Payment**: Stripe
- **Testing**: Jest, Cypress
- **DevOps**: Docker, GitHub Actions

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd photoprint-web
npm install
```

2. **Start development environment**
```bash
# Start all services (PostgreSQL, Redis, MinIO)
docker-compose up -d

# Run database migrations
npm run db:migrate

# Seed test data
npm run db:seed

# Start development servers
npm run dev
```

3. **Access applications**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Admin Panel: http://localhost:3002
- MinIO Console: http://localhost:9001

### Available Commands

```bash
# Development
npm run dev              # Start all apps in development
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run dev:admin        # Start admin panel only

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed test data
npm run db:reset         # Reset database

# Testing
npm run test             # Run all tests
npm run test:unit        # Run unit tests
npm run test:e2e         # Run e2e tests
npm run test:coverage    # Generate coverage report

# Building
npm run build            # Build all apps
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Linting & Formatting
npm run lint             # Lint all packages
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in each app directory:

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_FACEBOOK_APP_ID=...
```

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/photoprint
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=photoprint-media
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_SECRET=...
```

## 📱 PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Service worker for basic offline functionality
- **Push Notifications**: Order status updates
- **Responsive Design**: Mobile-first approach

## 🎨 Design System

- **Font**: Inter
- **Primary Color**: #FF6B6B
- **Design Tokens**: Consistent spacing, colors, typography
- **Components**: Reusable UI components with Tailwind CSS

## 🔒 Security & Compliance

- **Authentication**: JWT + refresh tokens
- **Authorization**: Role-based access control
- **Data Protection**: GDPR compliant
- **Payment Security**: PCI DSS compliant via Stripe
- **Input Validation**: Comprehensive validation on all inputs
- **Rate Limiting**: API rate limiting
- **CSRF/XSS Protection**: Security headers and sanitization

## 📊 Monitoring & Analytics

- **Error Tracking**: Sentry integration
- **Performance**: Web Vitals monitoring
- **Analytics**: Privacy-focused analytics
- **Logging**: Structured logging with correlation IDs

## 🚀 Deployment

### Production Deployment

1. **Build Docker images**
```bash
docker build -t photoprint-frontend -f apps/frontend/Dockerfile .
docker build -t photoprint-backend -f apps/backend/Dockerfile .
```

2. **Deploy with Docker Compose**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Or deploy to Kubernetes**
```bash
kubectl apply -f infra/k8s/
```

### CI/CD Pipeline

GitHub Actions workflow automatically:
- Runs tests on pull requests
- Builds and deploys on main branch
- Performs security scans
- Updates staging environment

## 📋 QA Checklist

### Functional Testing
- [ ] User registration and login
- [ ] Photo upload and import
- [ ] Product configuration
- [ ] Photo editing tools
- [ ] Cart and checkout flow
- [ ] Payment processing
- [ ] Order management
- [ ] Admin panel functionality

### Non-Functional Testing
- [ ] Performance (Core Web Vitals)
- [ ] Mobile responsiveness
- [ ] PWA installation
- [ ] Offline functionality
- [ ] Security vulnerabilities
- [ ] Accessibility (WCAG 2.1)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@photoprint.com

---

**Ready to start printing beautiful photos!** 📸✨
