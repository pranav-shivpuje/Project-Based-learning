const express = require('express');
const router = express.Router();
const { getLectures, getLecture, uploadLecture, deleteLecture } = require('../controllers/lectureController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', authMiddleware, getLectures);
router.get('/:id', authMiddleware, getLecture);
router.post('/upload', authMiddleware, (req, res, next) => {
  upload.single('audio')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadLecture);
router.delete('/:id', authMiddleware, deleteLecture);

module.exports = router;
