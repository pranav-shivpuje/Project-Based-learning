const prisma = require('../prisma/client');

const getNotes = async (req, res) => {
  try {
    const note = await prisma.note.findUnique({
      where: { lectureId: parseInt(req.params.lectureId) },
    });
    if (!note) return res.status(404).json({ error: 'Notes not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getNotes };  