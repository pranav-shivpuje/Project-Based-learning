const prisma = require('../prisma/client');

const getFlashcards = async (req, res) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      where: { lectureId: parseInt(req.params.lectureId) },
    });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getFlashcards };