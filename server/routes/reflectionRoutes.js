
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const router = express.Router();

const MAX_ANSWER_LENGTH = 10000;

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Please log in to access your reflections.'
    });
  }

  if (!ObjectId.isValid(req.session.userId)) {
    return res.status(401).json({
      error: 'Your session is invalid. Please log in again.'
    });
  }

  next();
}

// GET /api/reflections
// Return only the reflections owned by the logged-in user.
router.get('/reflections', requireAuth, async (req, res) => {
  try {
    const db = getDB();

    const reflections = await db
      .collection('reflections')
      .find({
        userId: new ObjectId(req.session.userId)
      })
      .sort({ savedAt: -1 })
      .limit(200)
      .toArray();

    return res.status(200).json({
      reflections: reflections.map((reflection) => ({
        id: reflection._id.toString(),
        world: reflection.world,
        question: reflection.question,
        answer: reflection.answer,
        savedAt: reflection.savedAt
      }))
    });
  } catch (error) {
    console.error('Failed to retrieve reflections:', error.message);

    return res.status(500).json({
      error: 'Unable to load your reflections.'
    });
  }
});

// POST /api/reflections
// Save a reflection under the authenticated user's ID.
router.post('/reflections', requireAuth, async (req, res) => {
  try {
    const { world, question, answer } = req.body || {};

    if (
      typeof world !== 'string' ||
      typeof question !== 'string' ||
      typeof answer !== 'string'
    ) {
      return res.status(400).json({
        error: 'World, question, and answer are required.'
      });
    }

    const cleanWorld = world.trim();
    const cleanQuestion = question.trim();
    const cleanAnswer = answer.trim();

    if (
      !cleanWorld ||
      cleanWorld.length > 120 ||
      !cleanQuestion ||
      cleanQuestion.length > 1000 ||
      !cleanAnswer ||
      cleanAnswer.length > MAX_ANSWER_LENGTH
    ) {
      return res.status(400).json({
        error: 'Please provide valid reflection details. Answers must be no longer than 10,000 characters.'
      });
    }

    const reflection = {
      userId: new ObjectId(req.session.userId),
      world: cleanWorld,
      question: cleanQuestion,
      answer: cleanAnswer,
      savedAt: new Date()
    };

    const result = await getDB()
      .collection('reflections')
      .insertOne(reflection);

    return res.status(201).json({
      message: 'Reflection saved successfully.',
      reflection: {
        id: result.insertedId.toString(),
        world: reflection.world,
        question: reflection.question,
        answer: reflection.answer,
        savedAt: reflection.savedAt
      }
    });
  } catch (error) {
    console.error('Failed to save reflection:', error.message);

    return res.status(500).json({
      error: 'Unable to save your reflection.'
    });
  }
});

// DELETE /api/reflections/:id
// A user can delete only their own reflection.
router.delete('/reflections/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid reflection ID.'
      });
    }

    const result = await getDB()
      .collection('reflections')
      .deleteOne({
        _id: new ObjectId(id),
        userId: new ObjectId(req.session.userId)
      });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: 'Reflection not found.'
      });
    }

    return res.status(200).json({
      message: 'Reflection deleted successfully.'
    });
  } catch (error) {
    console.error('Failed to delete reflection:', error.message);

    return res.status(500).json({
      error: 'Unable to delete your reflection.'
    });
  }
});

module.exports = router;
