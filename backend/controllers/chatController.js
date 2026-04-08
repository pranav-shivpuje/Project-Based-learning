const prisma = require('../prisma/client');
const OpenAI = require('openai');

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const chatWithLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { message, history = [] } = req.body;

    // Fetch the transcript for this lecture
    const transcript = await prisma.transcript.findUnique({
      where: { lectureId: parseInt(lectureId) },
    });

    if (!transcript) {
      return res.status(404).json({ error: 'Transcript not found for this lecture.' });
    }

    const parts = transcript.content.split('\n\n__GLOSSARY__');
    const transcriptText = parts[0].split('\n\n__SEGMENTS__')[0];
    // Truncate for chatbot to avoid token limits
    const words = transcriptText.split(/\s+/);
    const truncated = words.length > 6000 ? words.slice(0, 6000).join(' ') + '\n\n[Transcript truncated]' : transcriptText;

    const systemPrompt = `You are a helpful tutor assistant for a student reviewing their lecture notes.

Answer questions ONLY based on the lecture transcript provided below. 
- If the answer is clearly in the transcript, answer concisely and helpfully.
- If the question is not covered in the transcript, say: "This topic wasn't covered in this lecture."
- Keep answers focused, clear, and student-friendly.
- You may explain concepts in simpler terms if needed.

--- LECTURE TRANSCRIPT ---
${truncated}
--- END OF TRANSCRIPT ---`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6), // keep last 6 messages for context
      { role: 'user', content: message },
    ];

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 512,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { chatWithLecture };
