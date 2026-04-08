const prisma = require('../prisma/client');
const { uploadToCloudinary } = require('../services/cloudinaryService');
const { processLecture } = require('../services/aiService');

const getLectures = async (req, res) => {
  try {
    const lectures = await prisma.lecture.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLecture = async (req, res) => {
  try {
    const lecture = await prisma.lecture.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { transcript: true, flashcards: true, notes: true },
    });
    if (!lecture) return res.status(404).json({ error: 'Lecture not found' });
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadLecture = async (req, res) => {
  try {
    const { title, subject } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No audio file provided' });

    const filePath = require('path').resolve(req.file.path);
    console.log('File received:', filePath, `(${(req.file.size / 1024 / 1024).toFixed(1)}MB)`);

    const audioUrl = await uploadToCloudinary(filePath);

    const lecture = await prisma.lecture.create({
      data: { title, subject, audioUrl, userId: req.user.userId, status: 'uploaded' },
    });

    res.status(201).json({ lectureId: lecture.id });

    // Process in background — filePath passed so it can be cleaned up after transcription
    processLecture(lecture.id, audioUrl, filePath).catch(console.error);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLecture = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const lecture = await prisma.lecture.findUnique({ where: { id } });
    if (!lecture) return res.status(404).json({ error: 'Not found' });
    if (lecture.userId !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });

    await prisma.lecture.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLectures, getLecture, uploadLecture, deleteLecture };
