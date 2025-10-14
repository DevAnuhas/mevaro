# Mevaro - Educational Materials Platform

Mevaro is a modern educational materials sharing platform built with Next.js 14, featuring advanced AI-powered content analysis, semantic search capabilities, and comprehensive material management workflows. The platform enables educators and students to upload, discover, and interact with educational materials through intelligent features powered by Google's Gemini AI models.

## Table of Contents

- [Core Features](#core-features)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Development](#development)

## Core Features

### Material Management System

**Upload Workflow**
- Multi-format support for educational materials (PDF, PNG, JPG, JPEG, GIF, WEBP)
- Client-side file validation using React Hook Form with Zod schema validation
- Direct upload to Cloudflare R2 object storage with SHA-256 hash-based file naming
- Keyword tagging system for enhanced discoverability
- Three-state approval workflow (Pending, Approved, Rejected)

**Discovery and Search**
- Dual search system combining traditional text search with semantic search
- Category-based filtering across STEAM subjects (Science, Technology, Engineering, Arts, Mathematics)
- Sorting options by recent uploads, popularity, and view counts
- Material preview with detailed metadata display

**Analytics and Tracking**
- View count tracking with fingerprint-based duplicate prevention using FingerprintJS
- Download statistics per material and per user
- User-specific favorites system with quick access
- Material performance metrics for administrators

### AI-Powered Content Analysis

**Multimodal Document Processing**
- Direct file input to AI models supporting both PDF and image formats
- Document retrieval from Cloudflare R2 storage with streaming support

**AI Summarization Engine**
- Context-aware summarization incorporating material metadata (title, description, keywords, category)
- Structured output generation including overview, key concepts, learning objectives, and practical applications
- Real-time streaming responses using Vercel AI SDK for immediate user feedback

**Interactive AI Chat Assistant**
- Context injection with material metadata for relevant responses
- Multi-turn conversation support maintaining full message history
- Educational focus with student-friendly explanations and examples
- Streaming responses for natural conversation flow

**Structured Quiz Generation**
- Five multiple-choice questions per material with four options each
- Difficulty progression from basic recall to application-level questions
- Built-in explanation support for educational reinforcement
- Plausible distractor generation for effective assessment

**Lesson Plan Generator**
- Structured output with 4-6 sequential sections following pedagogical best practices
- Realistic time allocation for each section with total duration calculation
- Actionable teaching points (3-5 per section) for instructor guidance
- Progressive teaching flow from introduction through core concepts to assessment
- Activity and discussion suggestions for engaging classroom implementation

### Semantic Search with RAG Pipeline

**Vector Embedding Generation**
- Integration with Google's `text-embedding-004` model (768-dimensional vectors)
- Combined metadata embedding from title, description, and keywords
- Automatic embedding generation during material approval process
- Efficient vector storage using PostgreSQL's `pgvector` extension

**Similarity Search Implementation**
- Cosine similarity calculation using PostgreSQL vector operators
- Distance-based ranking with configurable similarity threshold
- Category-aware filtering maintaining semantic relevance
- Efficient indexing for fast retrieval on large datasets
- Fallback to traditional text search when embeddings are unavailable

**Search Pipeline**
1. Query embedding generation from user search terms
2. Vector similarity computation against material embeddings
3. Result filtering by approval status and similarity threshold
4. Category-based result refinement when specified
5. Uploader metadata enrichment for complete result objects
6. Automatic fallback to keyword-based search on errors

### Authentication and Authorization

**Better Auth Integration**
- Google OAuth 2.0 provider with account selection prompt
- Prisma adapter for seamless database integration
- Cookie-based session management with 5-minute cache duration
- Server-side session validation with request caching
- Automatic session refresh and expiration handling

**Role-Based Access Control**
- Two-tier role system: User and Admin
- Access control plugin with custom statement definitions
- Protected routes using Next.js middleware
- Role-based API authorization checks

### Administrative Dashboard

**User Management**
- Advanced user listing with search, filter, and pagination
- Field-specific search (email, name) with multiple operators (contains, starts_with, ends_with)
- User statistics tracking (upload counts, download counts)
- User ban system with reason tracking

**Material Moderation**
- Pending materials queue with detailed review interface
- Approval workflow with automatic embedding generation
- Material statistics and performance monitoring

**System Analytics**
- User activity metrics and engagement statistics
- Material performance tracking across categories
- Upload and download trend analysis

### User Features

**Personal Dashboard**
- Upload history with status tracking (Pending, Approved, Rejected)
- Download history with timestamp tracking
- Favorite materials collection with quick access
- Profile management with Google account integration
- Activity statistics overview

**Material Interaction**
- Single-click download with automatic tracking
- View-once counting with fingerprint and user ID deduplication
- Favorite/unfavorite functionality with instant feedback
- Material sharing with public URLs
- Embedded AI tools for enhanced learning

## Architecture Overview

### Frontend Architecture

**Next.js App Router Structure**
- Route group organization for logical separation (`(main)`, `admin`, `api`)
- Server Components for optimal performance and SEO
- Client Components for interactive features (marked with "use client")
- Server Actions for form submissions and mutations
- Streaming support for AI-generated content

**State Management**
- Server-side data fetching with React cache
- Form state management using React Hook Form
- Client-side caching with SWR-like patterns
- Optimistic updates with revalidation

**UI Component System**
- Radix UI primitives for accessibility
- shadcn/ui component library for consistent design
- Tailwind CSS for utility-first styling
- Class variance authority for component variants
- Responsive design with mobile-first approach

### Backend Architecture

**API Route Structure**
- RESTful API design with Next.js Route Handlers
- Server Actions for direct server-side mutations
- Streaming responses for AI-generated content
- Error handling with structured error responses
- Request validation using Zod schemas

**Database Layer**
- Prisma ORM for type-safe database access
- Connection pooling for optimal performance
- Transaction support for data consistency
- Soft delete patterns where applicable
- Efficient query optimization with proper indexing

**File Storage Architecture**
- Cloudflare R2 (S3-compatible) for scalable object storage
- SHA-256 hash-based file naming for uniqueness
- Public URL generation for direct access
- Streaming downloads for large files

### Security Implementation

**Middleware Protection**
- Route-level authentication checks
- Session cookie validation
- Automatic redirect to login for protected routes
- Callback URL preservation for post-login navigation

**Data Protection**
- SQL injection prevention through Prisma's parameterized queries
- XSS protection through React's built-in escaping
- CSRF protection via Better Auth's security measures
- Environment variable validation
- Secure cookie configuration with httpOnly flags

**Authorization Layers**
1. Middleware-level route protection
2. Server Action authorization checks
3. API route authentication validation
4. Role-based permission verification
5. Resource ownership validation

## Technology Stack

### Core Framework
- **Next.js 14.2.33**: React framework with App Router, Server Components, and Server Actions
- **React 18**: UI library with concurrent features and streaming support
- **TypeScript 5**: Type-safe development with full IDE support

### Database and ORM
- **PostgreSQL**: Primary relational database with pgvector extension for vector operations
- **Prisma 6.16.3**: Type-safe ORM with migration system and connection pooling
- **pgvector Extension**: Efficient vector storage and similarity search operations

### AI and Machine Learning
- **Google Gemini 2.5 Flash**: Advanced model for structured content generation
- **Google text-embedding-004**: 768-dimensional text embeddings for semantic search
- **Vercel AI SDK 5.0.65**: Streaming AI responses and structured output generation
- **@ai-sdk/google 2.0.18**: Google AI provider integration for Vercel AI SDK
- **@ai-sdk/react 2.0.64**: React hooks for AI streaming and state management

### Authentication and Authorization
- **Better Auth 1.3.26**: Modern authentication library with session management
- **Better Auth Admin Plugin**: Role-based access control with custom permissions
- **Better Auth Prisma Adapter**: Database integration for user and session storage

### File Storage
- **Cloudflare R2**: S3-compatible object storage for scalable file hosting
- **AWS SDK S3 Client 3.901.0**: S3-compatible client for R2 operations

### UI and Styling
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **shadcn/ui**: High-quality accessible component library
- **Radix UI**: Unstyled accessible component primitives
- **Lucide React 0.544.0**: Beautiful icon library
- **Framer Motion (motion 12.23.22)**: Animation library
- **next-themes 0.4.6**: Theme management with dark mode support

### Form Handling and Validation
- **React Hook Form 7.64.0**: Performant form library with validation
- **Zod 4.1.11**: TypeScript-first schema validation
- **@hookform/resolvers 5.2.2**: Validation resolver for React Hook Form

### Additional Libraries
- **FingerprintJS 4.6.2**: Browser fingerprinting for anonymous user tracking
- **Sonner 2.0.7**: Toast notification system
- **React Markdown 10.1.0**: Markdown rendering with GitHub Flavored Markdown support
- **React Syntax Highlighter 15.6.6**: Code syntax highlighting in markdown
- **Recharts 3.2.1**: Charting library for analytics visualizations

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14+ with `pgvector` extension
- Cloudflare account with R2 storage
- Google Cloud Platform account with OAuth 2.0 credentials
- Google AI Studio API key

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/DevAnuhas/mevaro.git
cd mevaro
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
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

4. **Set up PostgreSQL with pgvector**
```sql
CREATE DATABASE mevaro;
\c mevaro;
CREATE EXTENSION vector;
```

5. **Run database migrations**
```bash
npx prisma generate
npx prisma db push
```

6. **Seed the database with demo materials (optional)**
```bash
npm run db:seed
```

This will create:
- A demo user account (demo@mevaro.edu)
- 20 approved educational materials across all STEAM categories
- Materials with demo file URLs ready for testing

7. **Start development server**
```bash
npm run dev
```

8. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Initial Admin Setup

After first user registration via Google OAuth, manually promote to admin:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Project Structure

```
mevaro/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main application routes
│   │   ├── layout.tsx            # Main layout with navigation
│   │   ├── page.tsx              # Landing page
│   │   ├── about/                # About page
│   │   ├── library/              # Material discovery and search
│   │   │   ├── actions.ts        # Server actions for search
│   │   │   ├── components/       # Library UI components
│   │   │   └── page.tsx          # Library page
│   │   ├── material/             # Material detail pages
│   │   │   └── [id]/             # Dynamic material routes
│   │   │       ├── actions.ts    # Material-specific actions
│   │   │       └── components/   # Material detail components
│   │   └── pricing/              # Pricing information
│   │
│   ├── account/                  # User account management
│   │   ├── actions.ts            # Account-related server actions
│   │   └── page.tsx              # Account dashboard
│   │
│   ├── admin/                    # Administrative dashboard
│   │   ├── actions.ts            # Admin server actions
│   │   ├── page.tsx              # Admin overview
│   │   └── components/           # Admin-specific components
│   │       ├── user-management-table.tsx
│   │       ├── pending-approvals-table.tsx
│   │       └── material-management-table.tsx
│   │
│   ├── api/                      # API route handlers
│   │   ├── ai/
│   │   │   ├── chat/             # AI chatbot endpoint
│   │   │   ├── lesson-plan/      # Lesson plan generation
│   │   │   ├── quiz/             # Quiz generation
│   │   │   └── summarize/        # Content summarization
│   │   ├── auth/
│   │   │   └── [...all]/         # Catch-all auth routes
│   │   ├── materials/
│   │   │   └── upload/           # Material upload handler
│   │   └── search/
│   │       └── semantic/         # Semantic search API
│   │
│   ├── components/               # App-level shared components
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   └── user-menu.tsx
│   │
│   ├── login/
│   │   ├── layout.tsx            # Login layout
│   │   └── page.tsx              # Login page
│   │
│   ├── upload/
│   │   ├── page.tsx              # Material upload page
│   │   └── components/           # Upload form components
│   │       ├── upload-form.tsx
│   │       ├── file-upload-zone.tsx
│   │       ├── category-selector.tsx
│   │       └── keyword-input.tsx
│   │
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── favicon.ico               # App icon
│
├── components/                   # Reusable UI components (shadcn/ui)
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── table.tsx
│       └── [other components]
│
├── lib/                           # Utility functions and configurations
│   ├── auth.ts                    # Better Auth configuration
│   ├── auth-client.ts             # Client-side auth utilities
│   ├── prisma.ts                  # Prisma client singleton
│   ├── r2.ts                      # Cloudflare R2 client setup
│   ├── embeddings.ts              # Vector embedding utilities
│   ├── permissions.ts             # Access control definitions
│   ├── get-session.ts             # Cached server side session retrieval
│   ├── utils.ts                   # General utilities
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-debounce.ts
│   │   └── use-local-storage.ts
│   └── validations/               # Zod validation schemas
│       └── material.ts
│
├── prisma/                        # Database schema and migrations
│   ├── schema.prisma              # Prisma schema definition
│   └── migrations/                # Database migrations
│       └── [migration files]
│
├── public/                        # Static assets
│
├── scripts/                       # Utility scripts
│   └── generate-embeddings.ts     # Batch embedding generation
│
├── middleware.ts                  # Next.js middleware for route protection
├── next.config.mjs                # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## Database Schema

### Core Models

**User**
- Stores user accounts with Google OAuth integration
- Tracks role (user/admin), ban status, and ban expiration
- Relations: sessions, accounts, materials, downloads, views, favorites

**Session**
- Manages active user sessions with token-based authentication
- Tracks IP address and user agent for security
- Supports session impersonation for administrative purposes

**Account**
- Links users to OAuth providers (Google)
- Stores OAuth tokens and refresh tokens
- Handles token expiration and renewal

**Material**
- Central model for educational materials
- Stores file metadata, URLs, and categorization
- Contains 768-dimensional vector embeddings for semantic search
- Status workflow: PENDING → APPROVED/REJECTED
- Relations: uploader, downloads, views, favorites

**Download**
- Tracks material downloads by users
- Used for analytics and download statistics
- Composite indexing for performance

**View**
- Tracks material views with deduplication
- Uses fingerprint for anonymous users, user ID for authenticated
- Prevents duplicate counting with composite unique constraints

**Favorite**
- User-specific material bookmarking
- Unique constraint on (userId, materialId) to prevent duplicates

### Enums

**Category**: SCIENCE, TECHNOLOGY, ENGINEERING, ARTS, MATHEMATICS

**MaterialStatus**: PENDING, APPROVED, REJECTED

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
npm run dev                    # Start development server with hot reload
npm run build                  # Build for production (includes Prisma generation)
npm run start                  # Start production server
npm run lint                   # Run ESLint for code quality
npm run postinstall            # Automatically run after npm install (Prisma generation)
npm run db:seed                # Seed database with demo materials
npm run db:generate-embeddings # Generate vector embeddings for materials
```

### Database Operations

```bash
npx prisma generate          # Generate Prisma Client
npx prisma db push           # Push schema changes to database
npx prisma migrate dev       # Create and apply migration
npx prisma studio            # Open Prisma Studio GUI
npm run db:seed              # Seed database with 20 demo materials across STEAM categories
npm run db:generate-embeddings # Generate vector embeddings for semantic search
```

### Seeding the Database

The project includes a comprehensive seed script that populates the database with 20 diverse educational materials across all STEAM categories:

**What gets seeded:**
- 1 demo user account (demo@mevaro.edu)
- 20 educational materials (4 per STEAM category):
  - **Science**: Photosynthesis, Chemical Bonding, Newton's Laws, Circulatory System
  - **Technology**: Cloud Computing, Web Development, Cybersecurity, Database Design
  - **Engineering**: Statics & Dynamics, Electrical Circuits, Sustainable Engineering, Robotics
  - **Arts**: Art History, Digital Design, Music Theory, Creative Writing
  - **Mathematics**: Calculus, Linear Algebra, Statistics, Discrete Mathematics

**How to seed:**
```bash
npm run db:seed
```

All materials are created with `APPROVED` status and include:
- Detailed descriptions and learning objectives
- Relevant keywords for search optimization
- Demo file URLs (for testing without actual file uploads)
- Realistic file sizes and types
- Pre-assigned categories

**Note**: The seed script uses demo URLs for the `fileUrl` property. For production use, replace these with actual file uploads to your Cloudflare R2 bucket.

### Generating Vector Embeddings

After seeding or adding new materials, generate vector embeddings for semantic search:

```bash
npm run db:generate-embeddings
```

This script:
- Processes all approved materials without embeddings
- Generates 768-dimensional vectors using Google's `text-embedding-004` model
- Stores embeddings in PostgreSQL using the pgvector extension
- Enables semantic search functionality across all materials

**Prerequisites:**
- `GOOGLE_GENERATIVE_AI_API_KEY` must be set in your `.env` file
- Materials must have `APPROVED` status
- PostgreSQL must have the `pgvector` extension enabled

### Code Quality

- TypeScript strict mode enabled
- ESLint with Next.js recommended rules
- Prettier integration via ESLint
- Component-based architecture with clear separation of concerns
- Server Components by default, Client Components only when needed

### Performance Optimizations

- Streaming responses for AI-generated content
- React cache for session management
- Optimized database queries with proper indexing
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Connection pooling for database operations

## License

This project is licensed under the MIT License.
