
const express = require('express');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const router = express.Router();

// Normalize email addresses consistently.
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Basic email validation.
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Protect routes that require an authenticated user.
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Please log in first.',
    });
  }

  next();
}

// Limit authentication attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Try again later.',
  },
});

// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================
router.post('/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // Validate input.
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        error: 'Please provide a valid name, email, and password.',
      });
    }

    const cleanName = name.trim();

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        error: 'Name must be between 2 and 80 characters.',
      });
    }

    const cleanEmail = normalizeEmail(email);

    if (!validEmail(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({
        error: 'Please provide a valid email address.',
      });
    }

    if (password.length < 12 || password.length > 128) {
      return res.status(400).json({
        error: 'Password must be between 12 and 128 characters.',
      });
    }

    const db = getDB();
    const users = db.collection('users');

    // Check whether the email is already registered.
    const existingUser = await users.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists.',
      });
    }

    // Never store a plain-text password.
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await users.insertOne({
      name: cleanName,
      email: cleanEmail,
      password: passwordHash,
      createdAt: new Date(),
    });

    const user = {
      id: result.insertedId.toString(),
      name: cleanName,
      email: cleanEmail,
    };

    // Create a fresh session after registration.
    req.session.regenerate((sessionError) => {
      if (sessionError) {
        console.error(
          'Session regeneration failed during registration:',
          sessionError
        );

        return res.status(500).json({
          error:
            'Account created, but automatic login failed. Please log in.',
        });
      }

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) {
          console.error(
            'Session save failed during registration:',
            saveError
          );

          return res.status(500).json({
            error:
              'Account created, but automatic login failed. Please log in.',
          });
        }

        return res.status(201).json({
          message: 'Account created successfully.',
          user,
        });
      });
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'An account with this email already exists.',
      });
    }

    console.error('Registration error:', error);

    return res.status(500).json({
      error: 'Unable to create your account right now.',
    });
  }
});

// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================
router.post('/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validate input before querying the database.
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !validEmail(email.trim()) ||
      password.length === 0 ||
      password.length > 128
    ) {
      return res.status(400).json({
        error: 'Please provide a valid email and password.',
      });
    }

    const cleanEmail = normalizeEmail(email);
    const db = getDB();

    const user = await db.collection('users').findOne({
      email: cleanEmail,
    });

    // IMPORTANT FIX:
    // Older or incomplete user records may not contain a password hash.
    // Check for a valid hash before calling bcrypt.compare().
    if (
      !user ||
      typeof user.password !== 'string' ||
      user.password.length === 0
    ) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // Compare the submitted password with the stored hash.
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // Start a fresh session after successful authentication.
    req.session.regenerate((sessionError) => {
      if (sessionError) {
        console.error(
          'Session regeneration failed during login:',
          sessionError
        );

        return res.status(500).json({
          error: 'Unable to log in right now.',
        });
      }

      req.session.userId = user._id.toString();

      req.session.save((saveError) => {
        if (saveError) {
          console.error(
            'Session save failed during login:',
            saveError
          );

          return res.status(500).json({
            error: 'Unable to log in right now.',
          });
        }

        return res.status(200).json({
          message: 'Login successful.',
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          },
        });
      });
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      error: 'Unable to log in right now.',
    });
  }
});

// ==========================================
// GET CURRENT USER
// GET /api/auth/me
// ==========================================
router.get('/auth/me', requireAuth, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.session.userId)) {
      return res.status(401).json({
        error: 'Invalid session. Please log in again.',
      });
    }

    const db = getDB();

    const user = await db.collection('users').findOne(
      {
        _id: new ObjectId(req.session.userId),
      },
      {
        projection: {
          name: 1,
          email: 1,
        },
      }
    );

    if (!user) {
      return res.status(401).json({
        error: 'Account not found. Please log in again.',
      });
    }

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);

    return res.status(500).json({
      error: 'Unable to retrieve your account right now.',
    });
  }
});

// ==========================================
// LOGOUT
// POST /api/auth/logout
// ==========================================
router.post('/auth/logout', (req, res) => {
  if (!req.session) {
    res.clearCookie('dm.sid');

    return res.status(200).json({
      message: 'Logged out successfully.',
    });
  }

  req.session.destroy((error) => {
    if (error) {
      console.error('Logout error:', error);

      return res.status(500).json({
        error: 'Unable to log out right now.',
      });
    }

    res.clearCookie('dm.sid');

    return res.status(200).json({
      message: 'Logged out successfully.',
    });
  });
});

module.exports = router;
