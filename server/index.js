
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

const { connectDB } = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');
const reflectionRoutes = require('./routes/reflectionRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);
app.disable('x-powered-by');

if (!process.env.SESSION_SECRET) {
  throw new Error(
    'Missing SESSION_SECRET in server environment variables.'
  );
}

const mongoUrl =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

// Security middleware
app.use(helmet());

app.use(cors({
  origin: 'https://aliiqbal3096-art.github.io',
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));

// Store login sessions in MongoDB.
app.use(
  session({
    name: 'dm.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl,
      dbName: 'dangerous_mind',
      collectionName: 'sessions',
      ttl: 7 * 24 * 60 * 60,
      autoRemove: 'native'
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    }
  })
);

// Backend health check
app.get('/', (req, res) => {
  res.json({
    message: 'DANGEROUS MIND backend is running.'
  });
});

// Connect to MongoDB before handling API requests.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);

    return res.status(503).json({
      error: 'Database temporarily unavailable.'
    });
  }
});

// Existing API routes
app.use('/api', healthRoutes);
app.use('/api', profileRoutes);
app.use('/api', authRoutes);
app.use('/api', reflectionRoutes);

// Local development server.
// Vercel can import the Express app directly.
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`DANGEROUS MIND API running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error.message);
      process.exitCode = 1;
    });
}

module.exports = app;
