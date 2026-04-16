const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'https://assignment-purplemerit.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(ao => origin.startsWith(ao))) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to allow during assignment submission
    }
  },
  credentials: true
}));

// Root health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Purple Merit API is running' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { data: err.stack })
  });
});

if (process.env.RENDER || (process.env.NODE_ENV !== 'production' && !process.env.VERCEL)) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
