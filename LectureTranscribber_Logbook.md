# LectureTranscribber — Project Logbook

**Project:** LectureTranscribber — AI-Powered Lecture Audio to Study Material  
**Team:** Pranav Shivpuje  
**Duration:** 7 Weeks  
**Tech Stack:** React.js, Node.js, Express, PostgreSQL, Prisma, Groq API (Whisper + LLaMA)

---

## Week 1 — Project Planning & Environment Setup

**Objective:** Understand the project requirements and set up the development environment.

**Activities:**
- Studied the Project Requirements Document (PRD) and development plan
- Identified the core problem: students who miss lectures have no reliable way to catch up
- Defined the tech stack: React (frontend), Node.js + Express (backend), PostgreSQL (database), Groq API (AI)
- Installed Node.js v22, PostgreSQL, and VS Code
- Initialized the backend with `npm init` and installed core packages: `express`, `cors`, `dotenv`, `prisma`, `bcryptjs`, `jsonwebtoken`, `multer`, `openai`
- Scaffolded the React frontend using Vite with Tailwind CSS v4
- Set up the project folder structure:
  - `frontend/src/pages/` — all UI pages
  - `frontend/src/components/` — reusable components
  - `backend/routes/` — API endpoints
  - `backend/controllers/` — business logic
  - `backend/services/` — AI and cloud integrations
  - `backend/prisma/` — database schema

**Outcome:** Both frontend and backend running locally. "Hello World" confirmed on port 5000 and port 3000.

---

## Week 2 — Database Design & Authentication

**Objective:** Design the database schema and implement user authentication.

**Activities:**
- Designed 5 database models in Prisma schema:
  - `User` — stores name, email, hashed password, role (student/teacher)
  - `Lecture` — stores title, subject, audio URL, processing status
  - `Transcript` — stores full lecture text
  - `Flashcard` — stores Q&A pairs and MCQ data
  - `Note` — stores AI-generated study notes
- Ran `prisma db push` to create tables in PostgreSQL
- Generated Prisma client with `prisma generate`
- Implemented `/api/auth/signup` — hashes password with bcrypt, saves user
- Implemented `/api/auth/login` — verifies password, returns JWT token
- Built Login and Signup pages in React with form validation
- Implemented `AuthContext` for global auth state management
- Stored JWT in localStorage, attached to all API requests via axios interceptor
- Tested authentication with Postman — signup and login working correctly

**Outcome:** Users can create accounts and log in securely. JWT-protected routes working.

---

## Week 3 — Audio Upload & File Handling

**Objective:** Allow users to upload lecture audio files.

**Activities:**
- Configured `multer` middleware for handling `multipart/form-data` file uploads
- Set file type validation: only `.mp3`, `.wav`, `.m4a` accepted
- Set file size limit: 100MB maximum
- Built `/api/lectures/upload` endpoint — saves file locally to `backend/uploads/`
- Created `Lecture` record in database with status `"uploaded"`
- Built the Upload Page in React:
  - Lecture title input
  - Subject dropdown (6 subjects: ADC, MA, ML, OOP, ISPM, ICSR)
  - Drag-and-drop audio file zone
  - Upload progress feedback
- Debugged Cloudinary integration issue — temporarily switched to local file storage
- Confirmed uploaded files are saved and lecture record created in database

**Outcome:** Audio files upload successfully and are stored locally. Lecture record created in DB with correct metadata.

---

## Week 4 — AI Transcription & Content Generation

**Objective:** Integrate Groq AI to transcribe audio and generate study material.

**Activities:**
- Integrated Groq API using the OpenAI-compatible SDK (base URL: `https://api.groq.com/openai/v1`)
- Implemented `transcribeAudio()` using Whisper Large v3 model
- Implemented `generateFlashcards()` using LLaMA 3.3 70B — generates Q&A flashcards based on lecture content
- Implemented `generateMCQs()` using LLaMA 3.3 70B — generates multiple choice questions with 4 options, correct answer, and explanation
- Implemented `generateNotes()` using LLaMA 3.3 70B — generates structured markdown notes with sections: Overview, Key Concepts, Important Points, Connections, Exam Topics
- Implemented `generateGlossary()` using LLaMA 3.3 70B — extracts technical terms with plain-English definitions
- All 4 AI tasks run in parallel using `Promise.all()` for efficiency
- Results saved to respective database tables
- Lecture status updated: `uploaded` → `transcribed` → `ready`
- Frontend polls `/api/lectures/:id` every 4 seconds to detect status change

**Outcome:** Full AI pipeline working. Uploading a lecture automatically generates flashcards, MCQs, notes, and glossary within 30–90 seconds.

---

## Week 5 — Frontend Development & UI Polish

**Objective:** Build all frontend pages and improve the user interface.

**Activities:**
- Built all 5 pages: Dashboard, Library, Upload, Lecture Detail, Login/Signup
- Lecture Detail page has 4 tabs:
  - **Notes** — formatted markdown with download button
  - **Flashcards** — flip cards (question front, answer back)
  - **MCQ Quiz** — 4-option questions with answer reveal and explanation
  - **Glossary** — alphabetical list of key terms with definitions
- Applied Tailwind CSS styling: gradient hero, card layouts, color-coded subject badges
- Made navbar active-link aware
- Added user avatar initials in navbar
- Dashboard shows stats: total lectures, ready count, processing count
- Library has search by title and filter by subject
- Renamed app from "LectureAI" to "LectureTranscribber"
- Updated browser tab title in `index.html`

**Outcome:** Complete, polished UI across all pages. App is fully navigable and visually consistent.

---

## Week 6 — Advanced Features

**Objective:** Add intelligent features that improve the learning experience.

**Activities:**
- **Context-Aware Chatbot (RAG-lite):** Built a lecture tutor chatbot that answers questions strictly based on the lecture transcript. System prompt: "Answer ONLY using the lecture transcript below." Prevents hallucination and keeps students focused on lecture content.
  - Backend: `/api/chat/:lectureId` — fetches transcript, builds context, calls LLaMA
  - Frontend: Chat panel displayed side-by-side with notes (70/30 split)
  - Maintains conversation history for follow-up questions
- **Glossary Tab:** Technical terms extracted from lecture with plain-English definitions, displayed as a searchable card list
- **MCQ Quiz Mode:** Replaced simple flashcard flip with interactive quiz — select an option, see correct/incorrect feedback, read explanation
- **Notes Quality Improvement:** Upgraded AI prompt to generate structured markdown with emoji section headers, bold key terms, and exam topic predictions
- **react-markdown + @tailwindcss/typography:** Notes now render as properly formatted HTML instead of plain text

**Outcome:** App now has 5 distinct AI-powered features beyond basic transcription.

---

## Week 7 — Testing, Debugging & Final Review

**Objective:** Test all features end-to-end, fix bugs, and review the complete project.

**Activities:**
- Tested full upload flow with multiple lecture audio files across different subjects
- Debugged and fixed issues:
  - Prisma v7 adapter configuration (`@prisma/adapter-pg` required)
  - Groq API `json_object` format requiring "json" keyword in prompt
  - Missing `async` keyword on `processLecture` function after code edit
  - `useRef` missing from React imports causing blank screen crash
  - Glossary save blocking `ready` status — wrapped in try/catch
- Verified all 4 tabs load correctly for newly uploaded lectures
- Confirmed chatbot responds only from lecture content
- Reviewed project against original PRD requirements — all MVP features completed
- Documented tech stack, APIs used, and architecture

**Features Completed:**
- ✅ Audio upload
- ✅ AI transcription (Whisper)
- ✅ Flashcard generation
- ✅ MCQ quiz generation
- ✅ Structured notes generation
- ✅ Glossary extraction
- ✅ Context-aware lecture chatbot
- ✅ User authentication (JWT)
- ✅ Lecture library with search and filter
- ✅ Responsive, polished UI

**Pending / Future Work:**
- Cloud storage for audio files (Cloudinary)
- Deployment to Vercel (frontend) and Railway (backend)
- Edit flashcards/notes feature
- Email notes to students

---

## Summary

| Week | Focus | Status |
|------|-------|--------|
| 1 | Planning & Setup | ✅ Complete |
| 2 | Database & Auth | ✅ Complete |
| 3 | Audio Upload | ✅ Complete |
| 4 | AI Pipeline | ✅ Complete |
| 5 | Frontend & UI | ✅ Complete |
| 6 | Advanced Features | ✅ Complete |
| 7 | Testing & Review | ✅ Complete |
