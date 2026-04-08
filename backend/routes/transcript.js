const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const prisma = require('../prisma/client');

router.get('/:lectureId', authMiddleware, async (req, res) => {
  try {
    const record = await prisma.transcript.findUnique({
      where: { lectureId: parseInt(req.params.lectureId) },
    });
    if (!record) return res.status(404).json({ error: 'Transcript not found' });

    // Parse out plain text and segments
    const parts = record.content.split('\n\n__SEGMENTS__');
    const text = parts[0];
    let segments = [];
    if (parts[1]) {
      const rest = parts[1].split('\n\n__GLOSSARY__')[0];
      try { segments = JSON.parse(rest); } catch { segments = []; }
    }

    res.json({ text, segments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
