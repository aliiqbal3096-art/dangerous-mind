
require('dotenv').config();

const { connectDB } = require('./config/db');

async function createIndexes() {
  try {
    const db = await connectDB();

    await db.collection('users').createIndex(
      { email: 1 },
      { unique: true, name: 'unique_user_email' }
    );

    console.log('Unique email index created successfully.');
  } catch (error) {
    console.error('Failed to create database indexes:', error.message);
    process.exitCode = 1;
  } finally {
    // The database connection is closed by this script below.
    const { closeDB } = require('./config/db');
    if (typeof closeDB === 'function') {
      await closeDB();
    }
  }
}

createIndexes();
