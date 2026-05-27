# KuttyLink - URL Shortener

KuttyLink (meaning "tiny link") is a modern, fast, and feature-rich URL Shortening web application built using **Next.js** (App Router), **TypeScript**, **Mongoose (MongoDB)**, and **Tailwind CSS**. 

It features secure user authentication with access/refresh token rotation, middleware-level route protection, and a clean, decoupled backend architecture.

---

## 🚀 Key Features

- **URL Shortening**: Turn long, messy URLs into neat, short, and shareable links.
- **Click Tracking**: Keep track of user engagement with basic analytics tracking total clicks on each short link.
- **Secure Authentication**: 
  - Signup & Login with password hashing (`bcryptjs`).
  - Session security using dual JWTs (short-lived `access_token` and long-lived `refresh_token`) stored in secure, `httpOnly` cookies.
- **Next.js Middleware**: Handles route protection, redirecting guest users away from dashboard views, and preventing logged-in users from accessing the login/signup screens.
- **Clean Architecture & Dependency Injection**: Features a decoupled backend layout structure:
  - **Controllers**: Handle HTTP request Parsing and responses.
  - **Services**: Contain business logic (e.g. shortening algorithms, password validation).
  - **Repositories**: Direct interaction with the database/Mongoose models.
  - **Dependency Injection**: Centralized instances management in the `di` directory.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Formik & Yup (form management and validation), Lucide React (icons).
- **Backend / API**: Next.js Route Handlers (API endpoints).
- **Database**: MongoDB via Mongoose.
- **Authentication / Security**: JWT (`jose` in Edge middleware, `jsonwebtoken` in Node API routes), Cookies, bcryptjs.

---

## 📁 Project Structure

```text
├── app/                  # Next.js App Router (Pages, Layouts & API Routes)
│   ├── [shortCode]/      # Dynamic route for URL redirection
│   ├── api/              # Backend API Route Handlers (Auth & URL management)
│   ├── home/             # Authenticated user homepage / dashboard
│   ├── login/            # Login page
│   └── signup/           # Sign-up page
├── backend/              # Decoupled backend architecture
│   ├── constants/        # Application constants (HTTP codes, Route lists, Messages)
│   ├── controllers/      # Route controllers (Auth, URL)
│   ├── di/               # Dependency injection container & service registration
│   ├── interfaces/       # Repository & Service interface definitions
│   ├── lib/              # Database connection helper
│   ├── models/           # Mongoose schemas (User, URL)
│   ├── repositories/     # Data Access layer
│   ├── services/         # Business logic layer
│   └── utils/            # Shared utilities (ErrorHandler, AppError wrapper)
├── components/           # Reusable UI components
├── services/             # Frontend API request helpers (Axios instances)
├── middleware.ts         # Next.js Edge middleware for authentication routing guards
└── proxy.ts              # Authentication verification logic called by middleware
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** instance (Local or Atlas)

### Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd KuttyLink
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_access_token_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_token_secret
   NODE_ENV=development
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

---

## 🧪 Development & Production Builds

- **Development**: `npm run dev` (Runs dev server with hot reloading)
- **Production Build**: `npm run build` (Compiles app for production deployment)
- **Start Production Server**: `npm run start` (Runs the compiled production application)
- **Linting**: `npm run lint` (Checks codebase for ESLint issues)
