
const { MongoClient } = require('mongodb');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

const client = new MongoClient(MONGO_URI);

let database;

async function connectDB() {
  if (database) {
    return database;
  }

  await client.connect();

  database = client.db('dangerous_mind');

  console.log('MongoDB connected to dangerous_mind');

  return database;
}

function getDB() {
  if (!database) {
    throw new Error('Database is not connected yet.');
  }

  return database;
}

async function closeDB() {
  await client.close();
  database = undefined;
}

module.exports = {
  connectDB,
  getDB,
  closeDB
};
