import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import User from './models/User';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import fileRoutes from './routes/fileRoutes';
import locationRoutes from './routes/locationRoutes';
import orderRoutes from './routes/orderRoutes';
import novaPoshtaRoutes from './routes/novaPoshtaRoutes';
import Location from './models/Location';
import path from 'path';

dotenv.config();

const app = express();

// ✅ Middleware: Parse JSON Before Routes
app.use(express.json());

// ✅ Global CORS Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://e-commerce-mvp.vercel.app',
      'https://e-commerce-mvp-uuse.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// ✅ Explicitly Set CORS Headers for All Responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Handle preflight requests
  }

  next();
});

// ✅ Logger Middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} from ${req.headers.origin}`);
  res.on('finish', () => {
    console.log(
      `Response: ${req.method} ${req.url} - Status: ${res.statusCode}`,
    );
  });
  next();
});

// ✅ Serve Static Files with Proper CORS Headers
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
    },
  }),
);

// ✅ Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', fileRoutes);
app.use('/api/v1', locationRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', novaPoshtaRoutes);

const PORT = process.env.PORT || 5001;

// ✅ Function to Create Initial Admin User
const createInitialAdmin = async () => {
  const adminEmail = 'admin@example.com';
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    });
    await admin.save();
    console.log('Initial admin created:', admin);
  } else {
    console.log('Admin already exists:', adminExists);
  }
};

// ✅ Function to Create Initial Locations
const createInitialLocations = async () => {
  const locationsExist = await Location.countDocuments();
  if (locationsExist === 0) {
    await Location.insertMany([{ name: 'Kyiv' }, { name: 'Lviv' }]);
    console.log('Initial locations created: Kyiv, Lviv');
  }
};

// ✅ Connect to MongoDB and Start Server
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    console.log('MongoDB connected successfully');
    await createInitialAdmin();
    await createInitialLocations();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
