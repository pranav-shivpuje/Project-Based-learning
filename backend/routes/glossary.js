const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

require('dotenv').config();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

router.get('/:lectureId', authMiddleware, async (req, res) => {
  try {
    const transcript = await prisma.transcript.findUnique({
      where: { lectureId: parseInt(req.params.lectureId) },
    });
    if (!transcript) return res.status(404).json({ error: 'Not found' });

    const parts = transcript.content.split('\n\n__GLOSSARY__');
    if (parts.length < 2) return res.json({ glossary: [] });

    const glossary = JSON.parse(parts[1]);
    res.json({ glossary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
