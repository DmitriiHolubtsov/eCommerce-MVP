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

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://e-commerce-mvp-uuse.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.options('*', cors());

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

app.use(express.json());
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'), {
    setHeaders: (res, filePath) => {
      console.log('Serving file:', filePath, 'Status:', res.statusCode);
      res.set(
        'Access-Control-Allow-Origin',
        process.env.NODE_ENV === 'production'
          ? 'https://e-commerce-mvp-uuse.vercel.app'
          : 'http://localhost:3001',
      );
    },
  }),
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', fileRoutes);
app.use('/api/v1', locationRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', novaPoshtaRoutes);

const PORT = process.env.PORT || 5001;

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

const createInitialLocations = async () => {
  const locationsExist = await Location.countDocuments();
  if (locationsExist === 0) {
    await Location.insertMany([{ name: 'Kyiv' }, { name: 'Lviv' }]);
    console.log('Initial locations created: Kyiv, Lviv');
  }
};

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(async () => {
    await createInitialAdmin();
    await createInitialLocations();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
