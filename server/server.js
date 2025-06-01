// Load environment variables first
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import routes
const conversationRoutes = require('./routes/conversation');
const authRoutes = require('./routes/auth');
const streakRoutes = require('./routes/streakRoutes');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Database connection with retry logic
const connectDB = async (retries = 3) => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'URI is set' : 'URI is missing');
    
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/loan-agent-trainer', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Test the connection by running a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    return true;
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      return connectDB(retries - 1);
    }
    
    console.warn('⚠️  WARNING: Starting server without MongoDB connection');
    console.warn('⚠️  Database-dependent features will not work');
    return false;
  }
};

// Initialize server (start even without MongoDB)
const initializeServer = async () => {
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.log('🚀 Starting server in NO-DB mode...');
  }

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/conversations', conversationRoutes);
  app.use('/api/streak', streakRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  Note: MongoDB not connected. Some features may not work.');
    }
  });
};

initializeServer().catch(err => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
});
