
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Frontend origins allowed to call this API
const allowedOrigins = [
  'https://student-internship-portal-wine.vercel.app',
  'http://localhost:5173',
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow tools and server-to-server requests without an Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// API endpoints:
// GET    /api/health
// GET    /api/internships
// GET    /api/internships/:id
// POST   /api/applications
// GET    /api/applications
app.use('/api', routes);

// API root health check
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Student Internship Portal API is running!',
  });
});

// Handle malformed JSON and unexpected request errors
app.use((err, req, res, next) => {
  console.error('Request error:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Invalid JSON request body.',
    });
  }

  return res.status(500).json({
    error: 'An unexpected server error occurred.',
  });
});

// Connect to MongoDB before starting the server
async function startServer() {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error('MONGO_DB_URI is missing from environment variables.');
    }

    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('MongoDB connected successfully!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
