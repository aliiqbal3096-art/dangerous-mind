
const { MongoClient } = require('mongodb');
const profiles = require('../shared/profiles.json');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

async function seedProfiles() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();

    const db = client.db('dangerous_mind');
    const collection = db.collection('profiles');

    // Add a unique index so each profile ID stays unique.
    await collection.createIndex({ id: 1 }, { unique: true });

    // Insert profiles that don't already exist.
    for (const profile of profiles) {
      await collection.updateOne(
        { id: profile.id },
        { $setOnInsert: profile },
        { upsert: true }
      );
    }

    console.log(`Seed complete. Checked ${profiles.length} profiles.`);
    console.log('Database now contains:', await collection.countDocuments());
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seedProfiles();
