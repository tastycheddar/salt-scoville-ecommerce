# replit.md

## Overview
Salt & Scoville is a premium e-commerce platform specializing in gourmet hot sauces and spicy seasonings. Its main purpose is to provide a comprehensive online shopping experience with product management, user authentication, and shopping cart functionality, complemented by an admin dashboard. A core ambition is to leverage an AI-powered "FlavaDave" with advanced neural feedback loops to enhance customer interaction and drive significant revenue growth through optimized AI conversations. The platform also integrates professional email notifications, a store locator, and advanced SEO capabilities with authentic data integration.

## User Preferences
Preferred communication style: Simple, everyday language.
**CRITICAL RULE: Never modify meta information (SEO titles, descriptions, keywords) without explicit user instructions.**

## Recent Security Audit (August 2025)
- **Status**: Production-ready with A- security rating
- **Fixed Issues**: Client-side API exposure, CSP weaknesses, error disclosure
- **New Features**: Enterprise security monitoring, advanced input sanitization, file validation
- **Architecture**: Future-proof mobile-first security protocols implemented

## FlavaDave AI Architecture Consolidation (September 2025)
- **Status**: All critical contradictions resolved, unified architecture implemented
- **Fixed Contradictions**: AI service duplication, heat scale confusion, routing bypass, analytics fragmentation
- **New Integration**: AI router system actively used, enhanced features in main endpoint, consolidated analytics
- **Scale Clarification**: Heat measurement (1-5) vs satisfaction rating (0-9) clearly documented system-wide

## System Architecture
The application features a modern full-stack architecture prioritizing performance, scalability, and maintainability.

### Deployment Pipeline
- **Development:** Replit workspace for testing and development
- **Production:** Replit Deployments with autoscale configuration via Deploy button
- **Version Control:** Local Git for milestones (old GitHub repo disconnected August 2025)
- **Domain:** saltandscoville.com via Replit deployment

### Frontend
- **React 18** with TypeScript, Vite, Tailwind CSS, and Shadcn/ui for a component-based, type-safe UI.
- **React Router** for client-side routing.
- **TanStack Query** for server state management.
- **React Hook Form** with Zod for form validation.
- **Mapbox GL JS** for interactive maps.
- Image optimization includes multi-format support, lazy loading, and responsive srcsets.
- Performance utilities like DNS prefetch and resource preloading are utilized.

### Backend
- **Express.js** with TypeScript for a RESTful API.
- **Drizzle ORM** for type-safe interactions with PostgreSQL.
- `connect-pg-simple` handles PostgreSQL-backed session storage.

### Database
- **PostgreSQL** hosted on Neon, with a comprehensive Drizzle schema, including specialized tables for advanced neural feedback loops.
- **Migration Status**: Successfully migrated from Supabase to PostgreSQL (August 2025), maintaining all functionality while improving performance and security.

### Authentication & Authorization
- A custom system uses PostgreSQL session storage.
- Role-based access control (admin, customer, wholesale) with email verification and profile management is implemented.

### State Management
- **React Context API** for global states.
- **TanStack Query** for server state management.
- **Local Storage** for persistent cart data.

### Performance & SEO
- Image lazy loading and component code splitting are standard.
- **Dynamic SEO** with `React Helmet Async` enables per-page meta tags, structured data, and OpenGraph/Twitter Cards.
- Google Analytics integration includes custom event tracking.
- Mobile performance is optimized for Core Web Vitals.
- IndexNow SEO integration provides instant search engine notifications.

### UI/UX Decisions
- **Color Scheme:** Flame red, burnt orange, and charcoal create a fiery, gourmet aesthetic.
- The hero section is optimized for various devices.
- The AI Quiz features a dark theme with flame-red borders.
- **Admin Dashboard Styling:** A custom variant-based design system with themed gradients for metrics, premium effects, and appropriate icon integration.
- **Admin Dropdown Menu Styling:** `bg-charcoal/95` or `bg-char-black/95` with `backdrop-blur-xl`, `border-white/20`, and specific text colors for different actions.

### AI Conversation System Architecture (FlavaDave)
- **Core Philosophy:** Captures raw customer behavior for continuous AI evolution through neural learning.
- **Data Input Flow:** Records session creation, message-level analytics (user message, AI response, intent, score, processing time, heat tolerance, recommendations), and recommendation tracking (clicked, cart, purchased).
- Extracts business intelligence on user pain points, product gaps, and behavior patterns.
- AI provides clickable product links and optimizes recipe recommendations.
- **Neural Feedback Loop Architecture:** Identifies and replicates successful conversation patterns, tracks decision points and reasoning chains, provides real-time contextual learning feedback, performs advanced reasoning analytics, and conducts A/B testing with revenue attribution.
- **AI Diversification System:** Implements a neural personality engine, multi-provider AI routing with automatic fallback, performance tracking, and load balancing.
- **0-9 Conversation Scoring:** All conversation analytics use a 0-9 emotional rating scale.
- **Live Knowledge Updater:** A dynamic knowledge base system with contextual insights, seasonal recommendations, and real-time learning.
- **Admin-Controlled Personalization:** Administrator-controlled personality customization (e.g., heat level, dietary preferences, chattiness), auto-adaptation from star ratings, and comprehensive adaptation history tracking.
- **Recipe Wizard:** Generates recipes with nutritional data, instructions, chef tips, allergen info, and FlavaDave integration.
- **Dynamic Personality System:** Context-aware Dave personality selection with 5 specialized variants (Chef, Scientist, Beginner, Expert, Friendly Dave). Automatically selects optimal personality based on user expertise, conversation intent, heat tolerance, cooking context, and emotional state. Includes an admin dashboard for monitoring and testing personality selection accuracy.

## External Dependencies

### Data & Storage
- **Neon Database**: Serverless PostgreSQL hosting.

### Payment Processing
- **PayPal Server SDK v1.0.0**: Official @paypal/paypal-server-sdk integration following PayPal's Node.js specification exactly.
- **Enterprise-Grade Compliance**: Uses PayPal's OrdersController and OAuthAuthorizationController for production reliability.
- **Live Environment Only**: Production PayPal API (api-m.paypal.com) with zero sandbox references.
- **Official SDK Endpoints**: `/api/paypal/setup`, `/api/paypal/orders`, `/api/paypal/orders/:orderID/capture` using PayPal's sanctioned methods.

### AI & Development Tools
- **Claude Pro API**: AI-powered features and content generation.
- **Vercel Analytics**: Production analytics and performance monitoring.
- **ESBuild**: Fast JavaScript bundler.
- **TSX**: TypeScript execution environment.

### UI & Utilities
- **Radix UI**: Unstyled, accessible UI primitives.
- **Lucide React**: Icon library.
- **React Helmet Async**: Dynamic document head management.
- **Clsx & CVA**: Conditional CSS class management.
- **Date-fns**: Date manipulation.
- **Zod**: Runtime type validation.
- **Nanoid**: Unique ID generation.