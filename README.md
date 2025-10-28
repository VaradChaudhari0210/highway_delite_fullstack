# 🎯 BookIt: Experiences & Slots Booking Platform

A fullstack booking application for travel experiences with real-time slot management, built with React, Node.js, Express, PostgreSQL, and Prisma.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Database Setup](#-database-setup)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Promo Codes](#-available-promo-codes)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)

---

## 🌟 Features

- ✅ Browse travel experiences with images and descriptions
- ✅ Real-time slot availability checking
- ✅ Date and time slot selection
- ✅ Promo code validation and discount calculation
- ✅ Secure booking system with double-booking prevention
- ✅ Booking confirmation with unique reference ID
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Route-based navigation (not SPA)
- ✅ Type-safe API integration with Axios

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router v6** for routing
- **TailwindCSS** for styling
- **Axios** for API calls
- **Vite** for build tooling
- **Lucide React** for icons

### Backend
- **Node.js 18+** with JavaScript (ES6 Modules)
- **Express.js** for REST API
- **PostgreSQL** (Neon) for database
- **Prisma ORM** for database operations
- **Express Validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Morgan** for logging

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **PostgreSQL** 14+ or **Neon account**
- **Git** 

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd highway_delite_fullstack
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
```

**Edit `backend/.env`:**
```env
DATABASE_URL="postgresql://your_neon_connection_string"
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from root)
cd highway

# Install dependencies
npm install

# Create .env file (optional for local development)
echo "VITE_API_URL=http://localhost:5000" > .env
```

---

## 🗄️ Database Setup

### Option 1: Using Neon (Recommended)

1. **Create Neon Account**: Go to [neon.tech](https://neon.tech) and sign up
2. **Create Project**: Name it `bookit-db`
3. **Copy Connection String**: It looks like:
   ```
   postgresql://user:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. **Update `.env`**: Paste the connection string in `backend/.env`

### Option 2: Using Local PostgreSQL

1. **Install PostgreSQL** locally
2. **Create Database**:
   ```bash
   createdb bookit_db
   ```
3. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://localhost:5432/bookit_db"
   ```

### Run Migrations and Seed Data

```bash
# Navigate to backend folder
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Seed the database with sample data
npm run prisma:seed

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

**What gets seeded:**
- 8 Travel Experiences (Kayaking, Nandi Hills, Coffee Trail, etc.)
- 200+ Time Slots (5 dates × 5 times per day × 8 experiences)
- 3 Promo Codes (SAVE10, FLAT100, WELCOME20)

---

## 🚀 Running the Application

### Start Backend Server

```bash
# In backend folder
cd backend
npm run dev

# Server runs on http://localhost:5000
# You should see: "🚀 Server is running on http://localhost:5000"
```

### Start Frontend Server

```bash
# In highway folder (new terminal)
cd highway
npm run dev

# Frontend runs on http://localhost:5173
# Open http://localhost:5173 in your browser
```

### Running Both Simultaneously

- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd highway && npm run dev`

---

## 📁 Project Structure

```
highway_delite_fullstack/
│
├── backend/                     # Express.js Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (4 models)
│   │   ├── seed.js             # Sample data seeder
│   │   └── migrations/         # Database migration history
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   │   ├── booking.controller.js
│   │   │   ├── experience.controller.js
│   │   │   └── promo.controller.js
│   │   ├── routes/             # API routes
│   │   │   ├── booking.routes.js
│   │   │   ├── experience.routes.js
│   │   │   └── promo.routes.js
│   │   ├── middleware/         # Express middleware
│   │   │   └── errorHandler.js
│   │   ├── lib/
│   │   │   └── prisma.js       # Prisma client instance
│   │   └── index.js            # Server entry point
│   ├── .env                    # Environment variables (not in git)
│   ├── .env.example            # Environment template
│   ├── .gitignore
│   └── package.json
│
├── highway/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ExperienceCard.tsx
│   │   │   └── Header.tsx
│   │   ├── pages/              # Route pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── DetailsPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── ConfirmationPage.tsx
│   │   ├── services/           # API integration
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx             # Main app with routes
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── .env                    # Environment variables (not in git)
│   ├── .env.example            # Environment template
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md                    # This file
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Database Connection (Required)
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (`highway/.env`)

```env
# API Base URL (optional for local dev, defaults to localhost:5000)
VITE_API_URL=http://localhost:5000
```

**For Production:**
```env
VITE_API_URL=https://your-backend-url.com
```

---

## 🎁 Available Promo Codes

Test these promo codes during checkout:

| Code | Type | Discount | Max Uses |
|------|------|----------|----------|
| `SAVE10` | Percentage | 10% off | 100 |
| `FLAT100` | Fixed | ₹100 off | 50 |
| `WELCOME20` | Percentage | 20% off | 200 |

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Experiences

#### Get All Experiences
```http
GET /api/experiences
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Kayaking",
      "location": "Udupi",
      "description": "...",
      "shortDescription": "...",
      "price": 999,
      "imageUrl": "https://..."
    }
  ]
}
```

#### Get Experience by ID
```http
GET /api/experiences/:id
```

#### Get Slots for Experience
```http
GET /api/experiences/:id/slots?date=2025-10-22
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "experienceId": "uuid",
      "date": "2025-10-22T00:00:00.000Z",
      "time": "07:00 AM",
      "totalSlots": 10,
      "availableSlots": 8
    }
  ]
}
```

### Bookings

#### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "experienceId": "uuid",
  "slotId": "uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "quantity": 2,
  "promoCode": "SAVE10" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "referenceId": "BK1730123456ABC",
    "fullName": "John Doe",
    "email": "john@example.com",
    "quantity": 2,
    "subtotal": 1998,
    "taxes": 118,
    "discount": 200,
    "total": 1916,
    "status": "CONFIRMED",
    "experience": { ... },
    "slot": { ... }
  }
}
```

#### Get Booking by Reference ID
```http
GET /api/bookings/:referenceId
```

### Promo Codes

#### Validate Promo Code
```http
POST /api/promo/validate
Content-Type: application/json

{
  "code": "SAVE10",
  "amount": 1998
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "SAVE10",
    "type": "PERCENTAGE",
    "value": 10,
    "discount": 199.8
  }
}
```

---

## 🧪 Testing the Application

### 1. Test Homepage
- ✅ Open http://localhost:5173
- ✅ Should see 8 experience cards
- ✅ Search should filter experiences

### 2. Test Experience Details
- ✅ Click any experience card
- ✅ Should show experience details
- ✅ Should display available dates
- ✅ Should display time slots with availability

### 3. Test Booking Flow
- ✅ Select date and time
- ✅ Enter quantity (max = available slots)
- ✅ Click "Confirm"
- ✅ Fill in name and email
- ✅ Apply promo code (try SAVE10)
- ✅ Click "Pay Now"
- ✅ Should see confirmation with reference ID

### 4. Test API Health
```bash
curl http://localhost:5000/health
# Response: {"status":"ok","message":"Server is running"}
```

---

## 🔒 Security Features

- ✅ **Double-booking prevention** using database transactions
- ✅ **Input validation** with Express Validator
- ✅ **CORS protection** with configurable origins
- ✅ **Security headers** via Helmet.js
- ✅ **SQL injection protection** via Prisma ORM
- ✅ **Environment variable isolation**
- ✅ **SSL/HTTPS** in production (Neon, Vercel, Render)