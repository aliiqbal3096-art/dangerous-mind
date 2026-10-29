
require('dotenv').config();

const express = require('express');
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

if (!process.env.SESSION_SECRET) {
  console.error('Missing SESSION_SECRET in server/.env');
  process.exit(1);
}

const mongoUrl =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

app.disable('x-powered-by');

app.use(helmet());

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
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    }
  })
);

// Backend health check.
app.get('/', (req, res) => {
  res.json({
    message: 'DANGEROUS MIND backend is running.'
  });
});

// Existing API routes.
app.use('/api', healthRoutes);
app.use('/api', profileRoutes);
app.use('/api', authRoutes);

// Reflection API: create, retrieve, and delete private reflections.
app.use('/api', reflectionRoutes);

// Start accepting requests only after MongoDB connects.
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `DANGEROUS MIND API running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exitCode = 1;
  }
}

startServer();
