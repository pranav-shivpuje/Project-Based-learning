const express = require('express');
const router = express.Router();
const { chatWithLecture } = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

router.post('/:lectureId', authMiddleware, chatWithLecture);

module.exports = router;
