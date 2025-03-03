# eCommerce-MVP

A full-stack e-commerce application built with **React** (frontend) and **Node.js/Express** (backend). Users can browse products, add them to a cart, and place orders with Nova Poshta delivery options. Administrators can manage products, categories, and users via an admin dashboard.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Local Development](#local-development)
  - [Remote Deployment](#remote-deployment)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Features**:
  - Browse products on Home and Shop pages.
  - Add products to cart (requires login).
  - Place orders with Nova Poshta branch selection.
  - View and update user profile with avatar upload.
  - Register and log in.

- **Admin Features**:
  - Manage products (create, edit, delete) with image uploads.
  - Manage categories (create, edit, delete) with image uploads.
  - Manage users (create, edit, delete) with avatar uploads.

- **General**:
  - Responsive design with Tailwind CSS.
  - JWT-based authentication.
  - Persistent cart state with Redux.

## Project Structure

#### - backend/
#### -- src/
#### --- controllers/          # Business logic for API endpoints
#### ---- authController.ts
#### ---- categoryController.ts
#### ---- fileController.ts
#### ---- locationController.ts
#### ---- novaPoshtaController.ts
#### ---- orderController.ts
#### ---- productController.ts
#### ---- userController.ts
#### --- middleware/           # Middleware (e.g., authentication)
#### ---- authMiddleware.ts
#### --- models/              # MongoDB schemas
#### ---- Category.ts
#### ---- Location.ts
#### ---- Order.ts
#### ---- Product.ts
#### ---- User.ts
#### --- routes/              # API routes
#### ---- authRoutes.ts
#### ---- categoryRoutes.ts
#### ---- fileRoutes.ts
#### ---- locationRoutes.ts
#### ---- novaPoshtaRoutes.ts
#### ---- orderRoutes.ts
#### ---- productRoutes.ts
#### ---- userRoutes.ts
#### -- multerConfig.ts      # Multer configuration for file uploads
#### -- server.ts            # Main server file
#### -- uploads/             #for uploaded files (avatars, product images)
#### -- .env                     # Environment variables
#### -- package.json
#### -- tsconfig.json
#### - frontend/
#### -- src/
#### --- api/                # API configuration
#### ---- api.ts
#### --- components/         # Reusable React components
#### ---- Cart.tsx
#### ---- LoginForm.tsx
#### ---- OrderForm.tsx
#### ---- ProductList.tsx
#### ---- RegisterForm.tsx
#### ---- Header.tsx
#### ---- Footer.tsx
#### --- pages/             # Page components
#### ---- AdminDashboard.tsx
#### ---- Home.tsx
#### ---- OrderPage.tsx
#### ---- ProductList.tsx
#### ---- UserDashboard.tsx
#### --- redux/             # Redux store and slices
#### ---- authSlice.ts
#### ---- cartSlice.ts
#### ---- store.ts
#### -- App.tsx            # Main app component with routing
#### -- index.tsx          # Entry point
#### -- index.css          # Global styles (Tailwind)
#### -- .env                   # Frontend environment variables
#### -- package.json
#### -- tsconfig.json
#### -- README.md                  # Project documentation

## Prerequisites

- **Node.js**: v18.x or later
- **npm**: v8.x or later
- **MongoDB**: Local instance or MongoDB Atlas
- **Git**: For cloning the repository

## Installation

### Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/DmitriiHolubtsov/eCommerce-MVP.git
   cd eCommerce-MVP

2. Backend Setup:

- Navigate to the backend folder:
cd backend

- Install dependencies:
npm install

- Create a .env file in backend/ with the followin

API_URL=http://localhost:5001
PORT=5001
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
NOVA_POSHTA_API_KEY=your_nova_poshta_key

- Start the backend::
npm run dev

3. **Frontend Setup**:

- Navigate to the frontend folder:
cd ../frontend

- Install dependencies:
npm install

- Create a .env file in frontend/ (optional, if you need custom API URL):
REACT_APP_API_URL=http://localhost:5001/api/v1

- Start the development server:
npm start

4. **Access Locally**:

Frontend: http://localhost:3001
Backend API: http://localhost:5001/api/v1

## Remote Deployment

1. **Backend (Render)**:

1. Push to GitHub:

git add .
git commit -m "Prepare for Render deployment"
git push

2. Deploy on Render:

- Visit Render Dashboard → "New" → "Web Service".
- Connect: https://github.com/DmitriiHolubtsov/eCommerce-MVP.

Settings:
- Name: ecommerce-mvp
- Root Directory: backend
- Runtime: Node
- Build Command: npm install && npm run build
- Start Command: npm start
- Environment Variables

API_URL=https://ecommerce-mvp.onrender.com
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.z6slu.mongodb.net/eshop?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
NOVA_POSHTA_API_KEY=your_nova_poshta_key
NODE_ENV=production

- Deploy and access: https://ecommerce-mvp.onrender.com/api/v1

2. **Frontend (Vercel)**:

- Push to GitHub:

git add .
git commit -m "Prepare for Vercel deployment"
git push

- Deploy on Vercel:

- Visit Vercel Dashboard → "New Project".
- Import: https://github.com/DmitriiHolubtsov/eCommerce-MVP.

Settings:
- Framework Preset: Create React App
- Root Directory: frontend
- Build Command: npm run build
- Output Directory: build
- Environment Variables:

REACT_APP_API_URL=https://ecommerce-mvp.onrender.com/api/v1

- Deploy and access: https://e-commerce-mvp-uuse.vercel.app


3. **MongoDB Atlas**:

- Set up a free cluster on MongoDB Atlas:
- Create a user (e.g., dmitriiholubtsov / securepassword123).
- Allow access from 0.0.0.0/0 in Network Access.
- Copy the connection string to .env or Render/Vercel settings.

4. **Usage**:
- Initial Setup: Admin user admin@example.com / admin123 is created on backend startup.

- User Flow: Register/login at /register or /login, browse / or /shop, order at /order.

- Admin Flow: Login as admin, access /admin to manage products, categories, and users.

5. **API Endpoints**
Auth:
- POST /api/v1/auth/login - Login (returns JWT).
- POST /api/v1/auth/register - Register (returns JWT).
- GET /api/v1/auth/profile - User profile (requires token).

Products:
- GET /api/v1/products - List products.
- POST /api/v1/products - Create product (admin, with images).
- PUT /api/v1/products/:id - Update product (admin).
- DELETE /api/v1/products/:id - Delete product (admin).

Categories:
- GET /api/v1/categories - List categories.
- POST /api/v1/categories - Create category (admin, with image).
- PUT /api/v1/categories/:id - Update category (admin).
- DELETE /api/v1/categories/:id - Delete category (admin).

Users (Admin):
- GET /api/v1/users - List users.
- POST /api/v1/users - Create user (with avatar).
- PUT /api/v1/users/:id - Update user (with avatar).
- DELETE /api/v1/users/:id - Delete user.

Orders:
- POST /api/v1/orders/create - Create order (requires token).

Locations:
- GET /api/v1/locations - List locations.

Nova Poshta:
- GET /api/v1/nova-poshta/branches - List branches.

Files:
- POST /api/v1/files/upload - Upload file (returns URL).

**Technologies**:
Frontend: 
- React, 
- TypeScript, 
- Redux, 
- Tailwind CSS, 
- Axios

Backend: 
- Node.js, 
- Express, 
- TypeScript, 
- MongoDB (Mongoose), 
- JWT, 
- Multer

**Contributing**:
- Fork the repository.
- Create a branch: git checkout -b feature/your-feature.
- Commit changes: git commit -m "Add your feature".
- Push: git push origin feature/your-feature.
- Open a Pull Request.

**License**:
- MIT License