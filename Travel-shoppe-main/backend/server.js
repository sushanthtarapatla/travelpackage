const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not found in environment. Falling back to local MongoDB.');
}
connectDB();

// Route files
const destinations = require('./routes/destinations');
const packages = require('./routes/packages');
const testimonials = require('./routes/testimonials');
const journeyCategories = require('./routes/journeyCategories');
const contacts = require('./routes/contacts');
const bookings = require('./routes/bookings');
const notifications = require('./routes/notification'); // ← NEW

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com'
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Mount routers
app.use('/api/destinations', destinations);
app.use('/api/packages', packages);
app.use('/api/testimonials', testimonials);
app.use('/api/journey-categories', journeyCategories);
app.use('/api/contacts', contacts);
app.use('/api/bookings', bookings);
app.use('/api/notifications', notifications); // ← NEW

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Travel API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Travel API',
    version: '1.0.0',
    endpoints: {
      destinations: '/api/destinations',
      packages: '/api/packages',
      testimonials: '/api/testimonials',
      journeyCategories: '/api/journey-categories',
      contacts: '/api/contacts',
      bookings: '/api/bookings',
      notifications: '/api/notifications', // ← NEW
      health: '/api/health'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});