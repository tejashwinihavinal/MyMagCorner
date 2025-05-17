import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/googleAuth.js'; // Initialize Passport strategies
import authRoutes from './routes/authRoutes.js';
import magazineRoutes from './routes/magazineRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();

// Parse JSON requests
app.use(express.json());

// CORS Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Allow cookies to be sent
  })
);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Your MongoDB connection string
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/magazines', magazineRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process if the database connection fails
  });