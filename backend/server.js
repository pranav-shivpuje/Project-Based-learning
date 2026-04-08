const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const lectureRoutes = require('./routes/lectures');
const flashcardRoutes = require('./routes/flashcards');
const noteRoutes = require('./routes/notes');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/glossary', require('./routes/glossary'));

app.get('/', (req, res) => {
  res.json({ message: 'LectureAI backend is running!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.message, err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
