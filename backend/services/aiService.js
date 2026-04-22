require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const { AssemblyAI } = require('assemblyai');
const prisma = require('../prisma/client');

// Groq for text generation
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// AssemblyAI for transcription
const aai = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

const transcribeAudio = async (audioFilePath) => {
  console.log('Uploading to AssemblyAI...');
  const transcript = await aai.transcripts.transcribe({
    audio: audioFilePath,
    speech_models: ['universal-2'],
  });

  if (transcript.status === 'error') {
    throw new Error(`AssemblyAI transcription failed: ${transcript.error}`);
  }

  console.log('Transcription complete.');
  return transcript.text;
};

// Truncate transcript to avoid token limits on free tier (~10000 tokens ≈ 8000 words)
const truncateTranscript = (text, maxWords = 8000) => {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  console.log(`Transcript truncated from ${words.length} to ${maxWords} words for AI generation`);
  return words.slice(0, maxWords).join(' ') + '\n\n[Transcript truncated due to length]';
};

const generateFlashcards = async (transcript) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert educator creating high-quality study flashcards from a lecture transcript.

Generate as many flashcards as needed to thoroughly cover all important concepts — for a long lecture (1+ hours) generate 25-40 flashcards. Do not pad with trivial questions, and do not skip important concepts.

Each flashcard must:
- Ask a specific, meaningful question that tests real understanding
- Have a clear, complete answer (2-4 sentences)
- Cover a distinct concept (no duplicates)
- Be exam-worthy

Return ONLY valid JSON: {"flashcards": [{"question": "...", "answer": "..."}, ...]}`,
      },
      { role: 'user', content: `Generate flashcards covering all key concepts from this lecture. Return JSON:\n\n${transcript}` },
    ],
    response_format: { type: 'json_object' },
  });
  const parsed = JSON.parse(response.choices[0].message.content);
  return Array.isArray(parsed) ? parsed : parsed.flashcards ?? Object.values(parsed)[0];
};

const generateMCQs = async (transcript) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert educator creating multiple choice quiz questions from a lecture transcript.

Generate questions across 3 difficulty levels. For a long lecture (1+ hours) generate 25-35 total questions — roughly equal across easy, medium, and hard.

EASY: Direct recall questions based on facts, definitions, and concepts explicitly stated in the lecture.
MEDIUM: Application-based questions that require understanding and applying the concept to a scenario.
HARD: Challenging questions requiring deep understanding, analysis, comparison, or reasoning beyond what was directly stated.

Return ONLY valid JSON:
{
  "mcqs": [
    {
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "answer": "B",
      "explanation": "...",
      "difficulty": "easy"
    }
  ]
}
difficulty must be exactly one of: "easy", "medium", "hard"`,
      },
      { role: 'user', content: `Generate MCQ questions with difficulty levels from this lecture. Return JSON:\n\n${transcript}` },
    ],
    response_format: { type: 'json_object' },
  });
  const parsed = JSON.parse(response.choices[0].message.content);
  return Array.isArray(parsed) ? parsed : parsed.mcqs ?? Object.values(parsed)[0];
};

const generateNotes = async (transcript) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert academic note-taker. Given a lecture transcript, generate comprehensive, well-structured study notes in Markdown format.

Use this exact structure:

## 📌 Overview
A 2-3 sentence summary of what the lecture covers.

## 🔑 Key Concepts
### [Concept Name]
- Clear explanation
- Important details or sub-points

(repeat for each major concept)

## 📝 Important Points to Remember
- Critical facts, definitions, formulas
- Use **bold** for key terms

## 🔗 How It All Connects
- How the concepts relate to each other
- Real-world applications mentioned in the lecture

## ❓ Likely Exam Topics
1. First important exam topic
2. Second important exam topic
3. (continue as needed)

Keep language clear, concise, and student-friendly. Use markdown formatting throughout.`,
      },
      { role: 'user', content: `Generate structured study notes from this lecture transcript:\n\n${transcript}` },
    ],
  });
  return response.choices[0].message.content;
};

const generateGlossary = async (transcript) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert educator. Extract all important technical terms, concepts, and jargon from the lecture transcript and provide clear, plain-English definitions a student can understand.

Return ONLY valid JSON:
{
  "glossary": [
    { "term": "Mitosis", "definition": "The process by which a cell divides into two identical daughter cells, each with the same number of chromosomes as the parent cell." },
    ...
  ]
}

Rules:
- Include all domain-specific terms, acronyms, and key concepts
- Definitions should be concise (1-2 sentences) and student-friendly
- Order terms alphabetically
- Include as many terms as are genuinely present in the lecture`,
      },
      { role: 'user', content: `Extract all key terms and definitions from this lecture. Return JSON:\n\n${transcript}` },
    ],
    response_format: { type: 'json_object' },
  });
  const parsed = JSON.parse(response.choices[0].message.content);
  return Array.isArray(parsed) ? parsed : parsed.glossary ?? Object.values(parsed)[0];
};

const processLecture = async (lectureId, audioUrl, originalFilePath = null) => {
  try {
    const localPath = originalFilePath;
    if (!localPath || !fs.existsSync(localPath)) {
      throw new Error('Audio file not found for processing');
    }

    const transcript = await transcribeAudio(localPath);

    // Clean up original file after transcription
    try { fs.unlinkSync(localPath); } catch {}

    await prisma.transcript.create({ data: { lectureId, content: transcript } });
    await prisma.lecture.update({ where: { id: lectureId }, data: { status: 'transcribed' } });

    // Small delay between AI calls to avoid TPM rate limits
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const truncated = truncateTranscript(transcript);
    const flashcards = await generateFlashcards(truncated);
    await sleep(3000);
    const mcqs = await generateMCQs(truncated);
    await sleep(3000);
    const notes = await generateNotes(truncated);
    await sleep(3000);
    const glossary = await generateGlossary(truncated);

    await prisma.flashcard.createMany({
      data: [
        // Regular flashcards (plain Q&A)
        ...flashcards.map((f) => ({
          lectureId,
          question: f.question,
          answer: f.answer,
        })),
        // MCQs stored with type prefix so frontend can distinguish
        ...mcqs.map((f) => ({
          lectureId,
          question: f.question,
          answer: JSON.stringify({
            type: 'mcq',
            options: f.options,
            correct: f.answer,
            explanation: f.explanation,
            difficulty: f.difficulty || 'medium',
          }),
        })),
      ],
    });
    console.log('Saved', flashcards.length, 'flashcards +', mcqs.length, 'MCQs');
    await prisma.note.create({ data: { lectureId, content: notes } });

    // Save glossary — don't let this block the ready status
    try {
      await prisma.transcript.update({
        where: { lectureId },
        data: { content: transcript + '\n\n__GLOSSARY__' + JSON.stringify(glossary) },
      });
      console.log('Glossary saved,', glossary.length, 'terms');
    } catch (glossaryErr) {
      console.error('Glossary save failed (non-fatal):', glossaryErr.message);
    }

    await prisma.lecture.update({ where: { id: lectureId }, data: { status: 'ready' } });
    console.log('Lecture', lectureId, 'is ready');
  } catch (err) {
    console.error('Processing failed:', err);
    await prisma.lecture.update({ where: { id: lectureId }, data: { status: 'failed' } });
  }
};

module.exports = { processLecture };
