# MUSIKA HUB

Modern engineering marketplace platform for Quotinet (Pvt) Ltd.

## Architecture

- `frontend`: Next.js + React + TypeScript + Tailwind CSS application using the App Router.
- `backend`: Express.js + TypeScript API server with JWT-ready authentication and PostgreSQL connectivity.
- `backend/db/schema.sql`: Complete PostgreSQL schema for users, companies, categories, products, services, messages, reviews, and orders.

## Folder Structure

- `/frontend`
  - `app/`: Next.js pages and global styles
  - `public/`: static assets
  - `tailwind.config.ts`, `postcss.config.js`, `next.config.mjs`
- `/backend`
  - `src/`: Express server, route scaffolding, DB model
  - `db/schema.sql`: PostgreSQL schema

## API Route Design

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/services`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`
- `GET /api/suppliers`
- `GET /api/suppliers/:id`
- `GET /api/messages`
- `POST /api/messages`

## Database Design

- `users` with role enum: customer, supplier, service_provider, company, administrator
- `companies` linked to users with company profile, logo, contact details, and ratings
- `categories` for products and services
- `products`, `product_images`, `services`, `service_images`
- `messages` for internal communication
- `reviews` for products and services
- `orders` and `order_items` for customer purchase flows

## Development

1. Run `npm install` at the root to install dependencies for both apps.
2. Run `npm run dev:web` for the Next.js frontend.
3. Run `npm run dev:api` for the Express backend.

## 🚀 Deployment

**Ready to go online?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions to deploy:
- ✅ Frontend to Vercel (free, global CDN)
- ✅ Backend API to Railway (free, with PostgreSQL)
- ✅ Automatic redeployment on git push
- ✅ Public URLs for worldwide access

**Quick Checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a checklist of all deployment steps.

**Required Accounts**: GitHub (free), Vercel (free), Railway (free)

## Roadmap

1. Scaffolding: create frontend landing page, backend API shell, and database schema.
2. Auth & roles: implement JWT login/register, role-based access control, forgot password flow.
3. Marketplace: build product/service CRUD, image upload, search, filters, and details.
4. Supplier directory: add supplier profiles, ratings, reviews, and company catalogue.
5. Dashboards: create customer, supplier, and admin dashboards with saved products, orders, analytics, and reports.
6. Messaging: add secure internal messaging and notifications.
7. Production hardening: add validation, error handling, security headers, logging, and deployment scripts.
