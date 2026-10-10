# Pink Farm - Premium Grocery E-Commerce Platform

A production-ready e-commerce platform designed for a premium Indian packaged-food brand, primarily focusing on Makhana and everyday essentials.

## Features
- **Premium Design System**: Tailored colors and typography optimized for a food brand.
- **7 Product Slots**: Specifically designed for a curated collection.
- **UPI Checkout Integration**: Razorpay API implementation for familiar Indian payment experiences.
- **Admin Dashboard**: Lightweight and secure store management.
- **Accessible UI**: Easy to use for elderly and first-time online shoppers.

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM (PostgreSQL)
- Zustand (Client-state management)
- Razorpay

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in your specific details:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `RAZORPAY_KEY_ID`: Your Razorpay Live/Test Key ID.
- `RAZORPAY_KEY_SECRET`: Your Razorpay Secret.
- `ADMIN_JWT_SECRET`: A secure random string for admin sessions.

### 3. Initialize the Database
Run Prisma migrations to set up your PostgreSQL database schema:
```bash
npx prisma db push
# or npx prisma migrate dev
```

### 4. Seed Development Data
Populate the initial 7 product slots and admin account:
```bash
npx ts-node prisma/seed.ts
# or just run: npm run seed (if configured in package.json)
```
*(Default Admin Login - Email: admin@pinkfarm.in, Password: password123)*

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Execute Tests / Type Checking
```bash
npm run type-check
npm run lint
```

### 7. Build for Production
```bash
npm run build
```

### 8. Deploy the Application
Deploy on platforms like Vercel, Railway, or AWS. Ensure all environment variables from `.env` are set in the deployment platform's dashboard.

## Launch Checklist
- [ ] Connect a live PostgreSQL database.
- [ ] Provide live Razorpay credentials and verify webhook configuration.
- [ ] Update admin credentials in the database (hash password for production).
- [ ] Replace placeholder images with actual high-quality product photography.
- [ ] Verify FSSAI, GSTIN, and business address in store settings/policies.
- [ ] Add authentic terms & conditions and refund policies.
