
const { MongoClient } = require('mongodb');

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

const client = new MongoClient(MONGO_URI);

let database;
let connectionPromise;

async function connectDB() {
  if (database) {
    return database;
  }

  if (!connectionPromise) {
    connectionPromise = client.connect()
      .then(() => {
        database = client.db('dangerous_mind');

        console.log('MongoDB connected to dangerous_mind');

        return database;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

function getDB() {
  if (!database) {
    throw new Error('Database is not connected yet.');
  }

  return database;
}

async function closeDB() {
  if (connectionPromise) {
    await connectionPromise;
  }

  await client.close();

  database = undefined;
  connectionPromise = undefined;
}

module.exports = {
  connectDB,
  getDB,
  closeDB
};
