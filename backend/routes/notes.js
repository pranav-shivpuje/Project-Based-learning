const express = require('express');
const router = express.Router();
const { getNotes } = require('../controllers/noteController');
const authMiddleware = require('../middleware/auth');

router.get('/:lectureId', authMiddleware, getNotes);

module.exports = router;
