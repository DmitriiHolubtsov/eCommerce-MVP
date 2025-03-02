# eCommerce-MVP

# NODEJS_HOMEWORKS

# E-Shop Project

This is a full-stack e-commerce application built with **React** (frontend) and **Node.js/Express** (backend). It allows users to browse products, add them to a cart, and place orders with delivery options via Nova Poshta. Administrators can manage products, categories, and users through an admin dashboard.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Development](#development)
  - [Production](#production)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Features**:

  - Browse products on the home and shop pages.
  - Add products to the cart (requires login).
  - Place an order with Nova Poshta branch selection.
  - View and update user profile with avatar upload.
  - User registration and login.

- **Admin Features**:

  - Manage products (create, edit, delete) with image uploads.
  - Manage categories (create, edit, delete).
  - Manage users (create, edit, delete) with avatar uploads.

- **General**:

  - Responsive design with Tailwind CSS.
  - Authentication with JWT (JSON Web Tokens).
  - Persistent cart state with Redux.

## Project Structure

- backend/
-- src/
--- controllers/          # Business logic for API endpoints
---- authController.ts
---- categoryController.ts
---- locationController.ts
---- novaPoshtaController.ts
---- orderController.ts
### ---- productController.ts
### ---- userController.ts
### --- middleware/           # Middleware (e.g., authentication)
### ---- authMiddleware.ts
### --- models/              # MongoDB schemas
### ---- Category.ts
### ---- Location.ts
### ---- Order.ts
### ---- Product.ts
### ---- User.ts
### --- routes/              # API routes
### ---- authRoutes.ts
### ---- categoryRoutes.ts
### ---- locationRoutes.ts
### ---- novaPoshtaRoutes.ts
### ---- orderRoutes.ts
### ---- productRoutes.ts
### ---- userRoutes.ts
### -- multerConfig.ts      # Multer configuration for file uploads
### -- server.ts            # Main server file
### -- uploads/# Directory for uploaded files (avatars, product images)
### -- .env                     # Environment variables
### -- package.json
### -- tsconfig.json
### - frontend/
### -- src/
### --- api/                # API configuration
### ---- api.ts
### --- components/         # Reusable React components
### ---- Cart.tsx
### ---- LoginForm.tsx
### ---- OrderForm.tsx
### ---- ProductList.tsx
### ---- RegisterForm.tsx
### ---- Header.tsx
### ---- Footer.tsx
### --- pages/             # Page components
### ---- AdminDashboard.tsx
### ---- Home.tsx
### ---- OrderPage.tsx
### ---- UserDashboard.tsx
### --- redux/             # Redux store and slices
### ---- authSlice.ts
### ---- cartSlice.ts
### ---- store.ts
### -- App.tsx            # Main app component with routing
### -- index.tsx          # Entry point
### -- index.css          # Global styles (Tailwind)
### -- .env                   # Frontend environment variables
### -- package.json
### -- tsconfig.json
### -- README.md                  # Project documentation

## Prerequisites
- **Node.js** (v16.x or later)
- **npm** (v8.x or later)
- **MongoDB** (local instance or MongoDB Atlas)
- **Git** (for cloning the repository)

## Installation

### Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/repo-name
   cd this project

2. **Set up the backend**:

- Navigate to the backend folder:
cd backend

- Install dependencies:
npm install

- Create a .env file in backend/ with the followin
PORT=5001
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
NOVA_POSHTA_API_KEY=your_key

- Start the development server:
npm run dev

3. **Set up the frontend**:

- Navigate to the frontend folder:
cd ../frontend

- Install dependencies:
npm install

- Create a .env file in frontend/ (optional, if you need custom API URL):
REACT_APP_API_URL=http://localhost:5001/api/v1

- Start the development server:
npm start

4. **Access the app**:

Frontend: http://localhost:3001
Backend API: http://localhost:5001/api/v1

## Production

1. **Backend**:

- Build the TypeScript code:
cd backend
npm run build
- Install production dependencies:
npm install --production
- Start the server:
npm start

Deploy to a service like Heroku, ensuring .env variables are set.

2. **Frontend**:

- Build the React app:
cd frontend
npm run build

- Serve the build folder using a static server (e.g., serve):
npm install -g serve serve -s build

3. **MongoDB**:

Use MongoDB Atlas for a cloud-hosted database and update MONGO_URI у .env.

## Usage

1. **Initial Setup**:

- An admin user (admin@example.com / admin123) is created automatically on first backend startup.

2. **User Flow**:

- Register via /register or log in via /login.
- Browse products on / or /shop.
- Add items to the cart and place an order on /order.

2. **Admin Flow**:

- Log in as admin (admin@example.com / admin123).
- Access /admin to manage products, categories, and users.


## API Endpoints

1. **Authentication**

- POST /api/v1/auth/login - Log in a user (returns JWT token).
- POST /api/v1/auth/register - Register a new user (returns JWT token).
- GET /api/v1/auth/profile - Get authenticated user's profile (requires token).

**Users (Admin only)**

- GET /api/v1/users - Get all users.
- POST /api/v1/users - Create a new user (with avatar upload).
- GET /api/v1/users/:id - Get user by ID.
- PUT /api/v1/users/:id - Update user (with avatar upload).
- DELETE /api/v1/users/:id - Delete user.

**Products**

- GET /api/v1/products - Get all products.
- POST /api/v1/products - Create a product (admin only, with image upload).
- GET /api/v1/products/:id - Get product by ID.
- PUT /api/v1/products/:id - Update product (admin only, with image upload).
- DELETE /api/v1/products/:id - Delete product (admin only).

**Categories**

- GET /api/v1/categories - Get all categories.
- POST /api/v1/categories - Create a category (admin only).
- PUT /api/v1/categories/:id - Update category (admin only).
- DELETE /api/v1/categories/:id - Delete category (admin only).

**Orders**

- POST /api/v1/orders/create - Create an order (requires token).

**Locations**

- GET /api/v1/locations - Get static list of locations (e.g., Kyiv, Lviv).

**Nova Poshta**

- GET /api/v1/nova-poshta/branches - Get Nova Poshta branches.


## Technologies

1. **Frontend**:

- React
- TypeScript
- Redux (state management)
- Tailwind CSS (styling)
- Axios (API requests)

2. **Backend**:

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT (authentication)
- Multer (file uploads)

3. **Contributing**:

- Fork the repository.
- Create a feature branch (git checkout -b feature/your-feature).
- Commit your changes (git commit -m 'Add your feature').
- Push to the branch (git push origin feature/your-feature).
- Open a Pull Request.

4. **License**:

This project is licensed under the MIT License. See the LICENSE file for details.
