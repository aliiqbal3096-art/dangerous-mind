
const express = require('express');
const { getDB } = require('../config/db');

const router = express.Router();

// Return profile-card data from MongoDB
router.get('/profiles', async (req, res) => {
  try {
    const db = getDB();
    const profiles = await db
      .collection('profiles')
      .find({})
      .sort({ id: 1 })
      .toArray();

    res.status(200).json({
      project: 'DANGEROUS MIND',
      resource: 'profiles',
      count: profiles.length,
      profiles
    });
  } catch (error) {
    console.error('Failed to fetch profiles:', error.message);

    res.status(500).json({
      error: 'Unable to retrieve profiles.'
    });
  }
});

module.exports = router;
