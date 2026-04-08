const express = require('express');
const router = express.Router();
const { getFlashcards } = require('../controllers/flashcardController');
const authMiddleware = require('../middleware/auth');

router.get('/:lectureId', authMiddleware, getFlashcards);

module.exports = router;
