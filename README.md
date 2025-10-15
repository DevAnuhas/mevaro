# Mevaro - Educational Materials Platform

Mevaro is a modern educational materials sharing platform built with Next.js 14, featuring advanced AI-powered content analysis, semantic search capabilities, and comprehensive material management workflows. The platform enables educators and students to upload, discover, and interact with educational materials through intelligent features powered by Google's Gemini AI models.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)

## Features

### Material Management

- Multi-format support (PDF, images)
- Direct upload to Cloudflare R2 storage
- Three-state approval workflow (Pending, Approved, Rejected)
- Category filtering across STEAM subjects
- View tracking and download analytics

### AI-Powered Tools

- **Content Summarization**: Context-aware summaries with key concepts and learning objectives
- **Interactive Chat**: Educational AI assistant with material context
- **Quiz Generation**: Auto-generated multiple-choice questions
- **Lesson Plans**: Structured teaching plans with time allocation

### Semantic Search

- Vector embeddings using Google's text-embedding-004 model
- PostgreSQL pgvector for efficient similarity search
- Fallback to traditional text search

### User Features

- Google OAuth authentication
- Personal dashboard with upload/download history
- Favorites system
- Role-based access (User/Admin)

## Tech Stack

- **Framework**: Next.js 14, React 18, TypeScript 5
- **Database**: PostgreSQL with pgvector extension, Prisma ORM
- **AI**: Google Gemini 2.5 Flash, Vercel AI SDK 5
- **Auth**: Better Auth with Google OAuth
- **Storage**: Cloudflare R2 (S3-compatible)
- **UI**: Tailwind CSS, shadcn/ui, Radix UI primitives
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ with `pgvector` extension
- Cloudflare R2 storage account
- Google Cloud Platform OAuth credentials
- Google AI Studio API key

### Setup

1. **Clone and install**

```bash
git clone https://github.com/DevAnuhas/mevaro.git
cd mevaro
npm install
```

2. **Environment variables**

```bash
cp .env.example .env
```

Required environment variables:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mevaro?sslmode=disable"
DIRECT_URL="postgresql://user:password@localhost:5432/mevaro?sslmode=disable"

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudflare R2 Storage
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://your-public-r2-url.r2.dev
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET=your-bucket-name

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

3. **Database setup**

```bash
# Create database with pgvector
createdb mevaro
psql mevaro -c "CREATE EXTENSION vector;"

# Deploy schema and seed data
npm run db:deploy
npm run db:seed
npm run db:embed
```

4. **Start development**

```bash
npm run dev
```

Access at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
mevaro/
├── app/                  # Next.js App Router
│   ├── (main)/           # Main routes (library, material, about)
│   ├── account/          # User dashboard
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes (ai, auth, materials, search)
│   ├── login/            # Authentication
│   └── upload/           # Material upload
├── components/ui/        # Reusable UI components (shadcn/ui)
├── lib/                  # Utilities and configurations
│   ├── auth.ts           # Authentication setup
│   ├── prisma.ts         # Database client
│   ├── embeddings.ts     # Vector embeddings
│   └── validations/      # Zod schemas
├── prisma/               # Database schema and migrations
├── scripts/              # Utility scripts (seed, embeddings)
└── middleware.ts         # Route protection
```

## Development

## API Endpoints

### Authentication

- `POST /api/auth/sign-in/social` - Google OAuth sign-in
- `POST /api/auth/sign-out` - User sign-out
- `GET /api/auth/session` - Get current session

### Materials

- `POST /api/materials/upload` - Upload new material
- `GET /api/search/semantic` - Semantic search with embeddings
- Server Actions for material retrieval and management

### AI Features

- `POST /api/ai/summarize` - Generate material summary
- `POST /api/ai/chat` - Interactive AI chat
- `POST /api/ai/quiz` - Generate quiz questions
- `POST /api/ai/lesson-plan` - Generate lesson plan

### Admin (Server Actions)

- User management (list, ban, unban, update, delete)
- Material moderation (approve, reject, list)
- Session management (revoke, list)
- Statistics and analytics retrieval

## Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production (includes Prisma generation)
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
npm run postinstall  # Automatically run after npm install (Prisma generation)
npm run db:migrate   # Run Prisma migrations in development
npm run db:deploy    # Deploy Prisma migrations to production
npm run db:generate  # Generate Prisma client
npm run db:reset     # Reset database and re-run migrations
npm run db:seed      # Seed database with demo materials
npm run db:embed     # Generate vector embeddings for materials
```

### Admin Setup

After first Google OAuth login, promote user to admin:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

## License

This project is licensed under the MIT License.
