# 🎓 LectureAI — Product Requirements Document & Development Plan

> **Project:** AI-Powered Lecture Audio → Flashcards & Notes  
> **Version:** 1.0  
> **Audience:** Beginner Developer  
> **Date:** March 2026

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Objectives](#3-goals--objectives)
4. [Target Users](#4-target-users)
5. [Feature List (PRD)](#5-feature-list-prd)
6. [User Stories](#6-user-stories)
7. [System Architecture](#7-system-architecture)
8. [Tech Stack (Beginner-Friendly)](#8-tech-stack-beginner-friendly)
9. [Development Plan — Phase by Phase](#9-development-plan--phase-by-phase)
10. [Detailed Implementation Guide](#10-detailed-implementation-guide)
11. [API & Data Flow](#11-api--data-flow)
12. [Database Design](#12-database-design)
13. [UI/UX Screens](#13-uiux-screens)
14. [Testing Plan](#14-testing-plan)
15. [Timeline](#15-timeline)
16. [Common Mistakes to Avoid](#16-common-mistakes-to-avoid)
17. [Resources & Learning Links](#17-resources--learning-links)

---

## 1. PROJECT OVERVIEW

**Project Name:** LectureAI (you can rename this)

**One-Line Description:**  
An AI-powered web application that takes audio recordings of college/school lectures, converts them to text, and automatically generates flashcards and concise notes to help absent students catch up.

**The Core Flow:**

```
Teacher Records Lecture (Audio File)
        ↓
Upload Audio to LectureAI
        ↓
AI Converts Speech → Text (Transcription)
        ↓
AI Reads Text → Generates Flashcards + Notes
        ↓
Students View / Download their Study Material
```

---

## 2. PROBLEM STATEMENT

### The Problem:
- Students who miss lectures due to illness, travel, or personal reasons have **no reliable way** to catch up on what they missed.
- Borrowing notes from classmates gives unstructured, incomplete information.
- Watching full recorded videos takes as much time as the original lecture.
- There is no tool that automatically converts a lecture recording into **study-ready material**.

### Who Suffers:
- Students who were absent from class.
- Students with attention difficulties who couldn't follow the full lecture.
- Students reviewing for exams who need a quick refresher.

### Why Existing Solutions Are Insufficient:
| Existing Option | Why It Fails |
|---|---|
| Borrowing classmate notes | Incomplete, hard to read, subjective |
| Re-watching recorded lecture | Time-consuming (1 hour = 1 hour) |
| Asking the teacher to re-explain | Not scalable, teacher's time is limited |
| Generic AI chatbots (e.g., ChatGPT) | Student has to manually paste everything |

---

## 3. GOALS & OBJECTIVES

### Primary Goals:
1. Allow teachers or students to **upload lecture audio files**.
2. Automatically **transcribe** the audio to text using AI.
3. Use AI to **generate flashcards** (question + answer format) from the transcription.
4. Use AI to **generate short notes** (bullet-point summary) from the transcription.
5. Allow students to **view, download, or share** the flashcards and notes.

### Secondary Goals (Nice to Have):
- Allow students to **quiz themselves** using the flashcards.
- Support **multiple languages**.
- Allow **editing** of generated flashcards/notes.
- Send generated notes via **email**.

### What This Project Is NOT:
- It is NOT a video platform (no video recording/streaming).
- It is NOT a live real-time transcription tool (we handle recorded audio only, for now).
- It is NOT a plagiarism checker or grading tool.

---

## 4. TARGET USERS

### User Type 1: The Uploader (Teacher or Student Rep)
- Uploads the audio file after a lecture.
- Could be the teacher themselves, or a responsible student in the class.
- Needs: Simple upload interface, sees transcription progress, can review before publishing.

### User Type 2: The Student (Consumer)
- Was absent or wants a quick summary.
- Views the flashcards and notes generated from the lecture.
- Needs: Clean, readable flashcards, easy navigation, download option.

### User Type 3: Admin (Optional for V1)
- Manages courses, user accounts, and content.
- Can delete inappropriate content.

---

## 5. FEATURE LIST (PRD)

### 5.1 MUST HAVE (Version 1.0 — MVP)

| Feature ID | Feature Name | Description |
|---|---|---|
| F1 | Audio Upload | User can upload .mp3, .wav, .m4a files (max 100MB) |
| F2 | Audio Transcription | System converts audio to text using Whisper AI API |
| F3 | Flashcard Generation | AI reads transcript and creates 10–20 flashcards (Q&A pairs) |
| F4 | Short Notes Generation | AI creates a bullet-point summary of the lecture |
| F5 | View Flashcards | Student can flip through flashcards on screen |
| F6 | View Notes | Student can read the summary notes |
| F7 | Download Notes | Download notes as a .txt or .pdf file |
| F8 | Basic Authentication | Simple login/signup (email + password) |
| F9 | Lecture Library | List of all uploaded lectures with title and date |

### 5.2 SHOULD HAVE (Version 1.5)

| Feature ID | Feature Name | Description |
|---|---|---|
| F10 | Edit Flashcards | User can edit auto-generated Q&A before saving |
| F11 | Edit Notes | User can edit the generated notes |
| F12 | Self-Quiz Mode | Student can test themselves: see question, guess, then reveal answer |
| F13 | Course Tagging | Assign lectures to a Subject/Course (e.g., "Physics 101") |
| F14 | Progress Bar | Show transcription and generation status in real-time |

### 5.3 NICE TO HAVE (Version 2.0)

| Feature ID | Feature Name | Description |
|---|---|---|
| F15 | Email Notes | Send generated notes to student's email |
| F16 | Multi-language | Detect lecture language, generate notes in same language |
| F17 | Keyword Highlights | Highlight important terms in notes |
| F18 | Share Link | Generate shareable link for a lecture's notes |
| F19 | Export to PDF | Download flashcards as a formatted PDF |

---

## 6. USER STORIES

User stories follow the format: **"As a [user], I want to [action], so that [benefit]."**

### Uploader Stories:
- As a **teacher**, I want to upload my lecture audio file, so that students who were absent can access study material.
- As a **student rep**, I want to see a progress bar while the audio is being processed, so that I know it hasn't crashed.
- As an **uploader**, I want to give the lecture a title and subject tag, so that students can find it easily.
- As an **uploader**, I want to review the generated flashcards before they go live, so that I can remove any incorrect ones.

### Student Stories:
- As an **absent student**, I want to see a list of lectures I missed, so that I can quickly find the right one.
- As a **student**, I want to flip through flashcards, so that I can test myself on the key concepts.
- As a **student**, I want to download the notes as a PDF, so that I can study offline.
- As a **student preparing for exams**, I want a short bullet-point summary, so that I don't have to read the full transcript.

---

## 7. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                    │
│  - Upload Page   - Lecture List   - Flashcard Viewer     │
│  - Notes Viewer  - Login/Signup   - Dashboard            │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP Requests (REST API)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js + Express)            │
│  - Auth Routes      - Upload Handler                     │
│  - Transcription    - AI Generation    - DB Queries      │
└────────┬──────────────────┬────────────────┬────────────┘
         │                  │                │
         ▼                  ▼                ▼
┌──────────────┐  ┌──────────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  OpenAI Whisper  │  │  OpenAI GPT  │
│  (Database)  │  │  (Transcription) │  │  (Flashcards │
│              │  │                  │  │   & Notes)   │
└──────────────┘  └──────────────────┘  └──────────────┘
         │
         ▼
┌──────────────┐
│  Cloudinary  │
│  or AWS S3   │
│ (Audio Files)│
└──────────────┘
```

### How Each Part Works:

**Frontend (React):**  
The visual part of your app that users see and click. It sends requests to the backend when a user uploads a file or clicks a button.

**Backend (Node.js + Express):**  
The "brain" of the app. It receives requests from the frontend, talks to the database, and calls external AI APIs.

**PostgreSQL (Database):**  
Stores all your data — user accounts, lecture metadata, transcriptions, flashcards, and notes.

**OpenAI Whisper API:**  
An AI model by OpenAI that converts audio to text. You send it an audio file, it returns the transcript.

**OpenAI GPT API:**  
The same ChatGPT you know. You send it the transcript and a prompt like "generate 10 flashcards from this," and it returns them.

**Cloudinary / AWS S3:**  
Cloud storage for the audio files (you don't store audio files in your database — they're too large).

---

## 8. TECH STACK (BEGINNER-FRIENDLY)

### Why These Technologies?

| Layer | Technology | Why This Choice |
|---|---|---|
| Frontend | React.js | Most popular, huge community, beginner resources everywhere |
| Styling | Tailwind CSS | Write beautiful UI fast without fighting CSS |
| Backend | Node.js + Express | JavaScript on the server — same language as frontend |
| Database | PostgreSQL | Industry standard relational DB, free, powerful |
| ORM | Prisma | Makes database queries feel like writing JavaScript |
| Auth | JWT + bcrypt | Simple, secure, widely used |
| File Storage | Cloudinary (free tier) | Easiest cloud storage to set up as a beginner |
| Transcription | OpenAI Whisper API | Best-in-class accuracy, easy API |
| AI Generation | OpenAI GPT-4o-mini | Fast, cheap, powerful for text generation |
| Hosting (Frontend) | Vercel (free) | One-click React deployment |
| Hosting (Backend) | Railway.app (free) | Easiest Node.js + PostgreSQL hosting |

### Installation Prerequisites:
```
- Node.js v18+          → https://nodejs.org
- VS Code               → https://code.visualstudio.com
- Git                   → https://git-scm.com
- PostgreSQL            → https://postgresql.org (or use Railway cloud)
- An OpenAI Account     → https://platform.openai.com
- A Cloudinary Account  → https://cloudinary.com (free)
```

---

## 9. DEVELOPMENT PLAN — PHASE BY PHASE

---

### PHASE 0 — SETUP (Week 1)
**Goal:** Get all tools installed and a "Hello World" app running.

**Tasks:**
- [ ] Install Node.js, VS Code, Git, PostgreSQL
- [ ] Create an OpenAI account and get your API key
- [ ] Create a Cloudinary account and get your credentials
- [ ] Create a new GitHub repository for your project
- [ ] Initialize a React app for the frontend
- [ ] Initialize a Node.js + Express app for the  
- [ ] Connect your backend to PostgreSQL using Prisma

**Deliverable:** Both frontend and backend run locally without errors.

---

### PHASE 1 — AUTHENTICATION (Week 2)
**Goal:** Users can sign up and log in securely.

**Tasks:**
- [ ] Design the `User` database table (id, name, email, password, role)
- [ ] Build the `/signup` API endpoint (backend)
- [ ] Build the `/login` API endpoint (backend)
- [ ] Hash passwords using `bcrypt` before saving
- [ ] Return a JWT token on successful login
- [ ] Build the Login page (frontend)
- [ ] Build the Signup page (frontend)
- [ ] Store the JWT token in localStorage on the frontend
- [ ] Protect backend routes so only logged-in users can access them

**Deliverable:** Users can create an account and log in.

---

### PHASE 2 — AUDIO UPLOAD (Week 3)
**Goal:** Users can upload a lecture audio file, which gets saved to Cloudinary.

**Tasks:**
- [ ] Design the `Lecture` database table (id, title, subject, audioUrl, status, uploadedBy, createdAt)
- [ ] Install `multer` (Node.js package for handling file uploads)
- [ ] Install `cloudinary` npm package and configure it
- [ ] Build the `/upload` API endpoint that:
  - Accepts the audio file
  - Uploads it to Cloudinary
  - Saves the Cloudinary URL + lecture info to the database
  - Returns the new lecture's ID
- [ ] Build the Upload Page (frontend) with:
  - A file picker (only accept audio formats)
  - A text input for lecture title
  - A subject/course dropdown
  - An Upload button
  - A success/error message after upload

**Deliverable:** User can upload an audio file and see it saved in the database.

---

### PHASE 3 — TRANSCRIPTION (Week 4)
**Goal:** Uploaded audio gets converted to text automatically.

**Tasks:**
- [ ] Install the `openai` npm package in your backend
- [ ] Design the `Transcript` database table (id, lectureId, content, createdAt)
- [ ] After audio upload, trigger a transcription function that:
  - Downloads the audio from Cloudinary
  - Sends it to OpenAI Whisper API
  - Saves the returned text to the Transcript table
  - Updates the Lecture status to "transcribed"
- [ ] Display the transcription status on the frontend ("Processing...", "Done!")
- [ ] Allow users to view the raw transcript on a lecture detail page

**Key Code — Calling Whisper API:**
```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const fs = require('fs');

async function transcribeAudio(audioFilePath) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: "whisper-1",
  });
  return transcription.text; // This is your lecture text!
}
```

**Deliverable:** Audio files are converted to text transcripts automatically.

---

### PHASE 4 — FLASHCARD GENERATION (Week 5)
**Goal:** AI reads the transcript and generates flashcards.

**Tasks:**
- [ ] Design the `Flashcard` database table (id, lectureId, question, answer, createdAt)
- [ ] Build a `generateFlashcards(transcript)` function that:
  - Takes the transcript text
  - Sends it to GPT with a well-crafted prompt
  - Parses the response into individual Q&A pairs
  - Saves them to the Flashcard table
- [ ] Build the Flashcard Viewer page (frontend):
  - Show one card at a time (Question on front, click to flip for Answer)
  - Navigation arrows (Previous / Next)
  - Show "Card 3 of 15" counter

**Key Code — GPT Prompt for Flashcards:**
```javascript
async function generateFlashcards(transcript) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an educational assistant. Given a lecture transcript, generate exactly 10 flashcards. Each flashcard should have a clear question and a concise answer. Return ONLY a JSON array in this format: [{\"question\": \"...\", \"answer\": \"...\"}, ...]"
      },
      {
        role: "user",
        content: `Generate 10 flashcards from this lecture transcript:\n\n${transcript}`
      }
    ]
  });
  
  const jsonText = response.choices[0].message.content;
  return JSON.parse(jsonText); // Array of {question, answer} objects
}
```

**Deliverable:** Flashcards are auto-generated and viewable on the frontend.

---

### PHASE 5 — SHORT NOTES GENERATION (Week 6)
**Goal:** AI generates bullet-point study notes from the transcript.

**Tasks:**
- [ ] Design the `Note` database table (id, lectureId, content, createdAt)
- [ ] Build a `generateNotes(transcript)` function using GPT
- [ ] Save notes to the database
- [ ] Build the Notes Viewer page (frontend):
  - Display notes as a clean bullet-point list
  - Include a "Download as .txt" button
- [ ] Show both Flashcards and Notes tabs on the lecture detail page

**Key Code — GPT Prompt for Notes:**
```javascript
async function generateNotes(transcript) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a study assistant. Given a lecture transcript, generate concise bullet-point notes. Cover all major topics discussed. Use clear, simple language a student can understand. Format as: '• [Key point]'"
      },
      {
        role: "user",
        content: `Generate study notes from this lecture:\n\n${transcript}`
      }
    ]
  });
  
  return response.choices[0].message.content;
}
```

**Deliverable:** Students can view and download short notes for each lecture.

---

### PHASE 6 — LECTURE LIBRARY & DASHBOARD (Week 7)
**Goal:** Students can browse all available lectures.

**Tasks:**
- [ ] Build the Lecture Library page:
  - List all lectures with title, subject, date, and status
  - Filter by subject
  - Search by title
  - Click to open a lecture's flashcards/notes
- [ ] Build a simple dashboard showing:
  - Total lectures uploaded
  - Your recently viewed lectures
- [ ] Add a navigation bar with links to all pages

**Deliverable:** Full navigation flow from dashboard → library → lecture → flashcards/notes.

---

### PHASE 7 — POLISH & DEPLOY (Week 8)
**Goal:** Make the app look good and put it on the internet.

**Tasks:**
- [ ] Add loading spinners everywhere an API call is happening
- [ ] Add proper error messages (e.g., "File too large", "Invalid format")
- [ ] Make the UI mobile-responsive using Tailwind CSS
- [ ] Write a README.md explaining how to run the project
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend + database to Railway.app
- [ ] Set all environment variables (API keys) in the deployment platform
- [ ] Test the entire flow end-to-end on the live URL

**Deliverable:** Working live app accessible via a public URL.

---

## 10. DETAILED IMPLEMENTATION GUIDE

### Step 1 — Project Folder Structure

```
lectureai/
├── frontend/                  ← React app
│   ├── src/
│   │   ├── components/        ← Reusable UI pieces (Button, Card, Navbar)
│   │   ├── pages/             ← Full pages (LoginPage, UploadPage, etc.)
│   │   ├── services/          ← API call functions
│   │   ├── context/           ← Auth state management
│   │   └── App.jsx            ← Main app with routes
│   └── package.json
│
└── backend/                   ← Node.js + Express API
    ├── routes/                ← API endpoints (auth, lectures, flashcards)
    ├── controllers/           ← Business logic functions
    ├── middleware/             ← Auth check, file upload handlers
    ├── prisma/
    │   └── schema.prisma      ← Database table definitions
    ├── services/              ← OpenAI & Cloudinary helpers
    ├── .env                   ← Secret keys (NEVER commit this to GitHub!)
    └── server.js              ← Entry point
```

---

### Step 2 — Initialize the Projects

**Backend setup commands (run in your terminal):**
```bash
mkdir lectureai && cd lectureai
mkdir backend && cd backend
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken prisma @prisma/client multer cloudinary openai
npm install --save-dev nodemon
npx prisma init
```

**Frontend setup commands:**
```bash
cd ..
npx create-react-app frontend
cd frontend
npm install axios react-router-dom tailwindcss
npx tailwindcss init
```

---

### Step 3 — Environment Variables (.env file)

Create a `.env` file in your backend folder. **Never share this file or push it to GitHub.**

```env
# Server
PORT=5000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lectureai"

# JWT Secret (make this a long random string)
JWT_SECRET="your_super_secret_jwt_key_make_it_long_and_random"

# OpenAI
OPENAI_API_KEY="sk-..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

### Step 4 — Express Server Entry Point (server.js)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const lectureRoutes = require('./routes/lectures');
const flashcardRoutes = require('./routes/flashcards');
const noteRoutes = require('./routes/notes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/notes', noteRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'LectureAI backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 11. API & DATA FLOW

### All API Endpoints

| Method | Endpoint | What it does | Auth Required? |
|---|---|---|---|
| POST | /api/auth/signup | Create a new account | No |
| POST | /api/auth/login | Log in, get JWT token | No |
| POST | /api/lectures/upload | Upload audio + create lecture | Yes |
| GET | /api/lectures | Get all lectures (your library) | Yes |
| GET | /api/lectures/:id | Get one lecture's details | Yes |
| GET | /api/flashcards/:lectureId | Get all flashcards for a lecture | Yes |
| GET | /api/notes/:lectureId | Get notes for a lecture | Yes |
| DELETE | /api/lectures/:id | Delete a lecture | Yes (owner only) |

### Data Flow Example — Upload & Process

```
1. User selects audio file in React UI
2. Frontend sends POST /api/lectures/upload with:
   - audioFile (the actual file)
   - title: "Photosynthesis Lecture"
   - subject: "Biology"
3. Backend receives it:
   a. Uploads audio to Cloudinary → gets back audioUrl
   b. Saves Lecture record to DB (status: "uploaded")
   c. Returns lectureId to frontend immediately
   d. Starts background processing:
      i.  Downloads audio → sends to Whisper → gets transcript
      ii. Saves transcript to DB (status: "transcribed")
      iii. Sends transcript to GPT → gets 10 flashcards
      iv. Saves flashcards to DB
      v.  Sends transcript to GPT → gets bullet notes
      vi. Saves notes to DB
      vii. Updates Lecture status to "ready"
4. Frontend polls GET /api/lectures/:id every 3 seconds
5. When status === "ready", shows flashcards and notes to the user
```

---

## 12. DATABASE DESIGN

### Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  password  String
  role      String    @default("student")  // "student" or "teacher"
  lectures  Lecture[]
  createdAt DateTime  @default(now())
}

model Lecture {
  id          Int        @id @default(autoincrement())
  title       String
  subject     String
  audioUrl    String
  status      String     @default("uploaded")
  // status values: "uploaded" → "transcribed" → "ready" → "failed"
  uploadedBy  User       @relation(fields: [userId], references: [id])
  userId      Int
  transcript  Transcript?
  flashcards  Flashcard[]
  notes       Note[]
  createdAt   DateTime   @default(now())
}

model Transcript {
  id        Int      @id @default(autoincrement())
  lecture   Lecture  @relation(fields: [lectureId], references: [id])
  lectureId Int      @unique
  content   String   @db.Text   // Full transcript text (can be very long)
  createdAt DateTime @default(now())
}

model Flashcard {
  id        Int      @id @default(autoincrement())
  lecture   Lecture  @relation(fields: [lectureId], references: [id])
  lectureId Int
  question  String
  answer    String   @db.Text
  createdAt DateTime @default(now())
}

model Note {
  id        Int      @id @default(autoincrement())
  lecture   Lecture  @relation(fields: [lectureId], references: [id])
  lectureId Int      @unique
  content   String   @db.Text   // Full notes text
  createdAt DateTime @default(now())
}
```

---

## 13. UI/UX SCREENS

### Screen 1: Landing/Login Page
- App name + tagline: "Never miss a lesson again."
- Login form (email + password)
- Link to Signup

### Screen 2: Dashboard
- Welcome message ("Hello, Priya!")
- Quick stats: "12 lectures available"
- "Recent Uploads" section (last 3 lectures)
- Big button: "+ Upload New Lecture"

### Screen 3: Upload Page
- Title: "Upload a Lecture"
- Input: Lecture Title
- Input: Subject / Course
- Drag-and-drop area for audio file (or click to browse)
- Accepted formats shown: ".mp3, .wav, .m4a (max 100MB)"
- Upload button
- Progress bar (after clicking upload)

### Screen 4: Lecture Library
- Search bar
- Filter by Subject dropdown
- Grid of Lecture Cards, each showing:
  - Lecture title
  - Subject
  - Date uploaded
  - Status badge (Processing / Ready)
  - "View" button

### Screen 5: Lecture Detail Page
- Lecture title and subject at the top
- Two tabs: **Flashcards** | **Notes**

**Flashcards Tab:**
- Large card in the center
- Shows Question text
- "Flip" button to reveal Answer
- Previous / Next arrows
- "Card 4 of 12" counter

**Notes Tab:**
- Clean bullet-point list
- Scroll down to see all
- "Download as .txt" button

---

## 14. TESTING PLAN

### Manual Testing Checklist

**Authentication:**
- [ ] Can a new user sign up?
- [ ] Does signup fail if email already exists?
- [ ] Can a user log in with correct credentials?
- [ ] Does login fail with wrong password?
- [ ] Does a logged-out user get redirected if they try to access the dashboard?

**Upload:**
- [ ] Can a user upload a valid .mp3 file?
- [ ] Does an error appear if they try to upload a .pdf or .jpg?
- [ ] Does an error appear if file is over 100MB?
- [ ] Does the status update from "Processing" to "Ready" after a few seconds?

**Flashcards:**
- [ ] Are flashcards generated after upload?
- [ ] Does flipping work (Question → Answer)?
- [ ] Do Next/Previous buttons work?

**Notes:**
- [ ] Are notes generated after upload?
- [ ] Does the download button produce a .txt file?

**Beginner Tip:** Create a short 2-minute audio recording on your phone with a simple topic (e.g., "The water cycle has three stages: evaporation, condensation, precipitation...") and use that as your test file. It's cheap on API credits too!

---

## 15. TIMELINE

| Week | Phase | Goal |
|---|---|---|
| Week 1 | Phase 0 — Setup | All tools installed, Hello World running |
| Week 2 | Phase 1 — Auth | Users can sign up and log in |
| Week 3 | Phase 2 — Upload | Audio files upload to Cloudinary |
| Week 4 | Phase 3 — Transcription | Whisper converts audio to text |
| Week 5 | Phase 4 — Flashcards | GPT generates and displays flashcards |
| Week 6 | Phase 5 — Notes | GPT generates downloadable study notes |
| Week 7 | Phase 6 — Library | Full navigation and lecture browsing |
| Week 8 | Phase 7 — Deploy | Live app on Vercel + Railway |

**Total: 8 weeks for a working MVP**

---

## 16. COMMON MISTAKES TO AVOID

1. **Committing your .env file to GitHub**  
   Add `.env` to your `.gitignore` file BEFORE your first commit. Leaked API keys will cost you real money.

2. **Forgetting to handle the async nature of processing**  
   Transcription + AI generation takes 30–60 seconds. Never make the user wait with a frozen screen. Use background processing and status polling.

3. **Not validating file types on the backend**  
   Always validate on the server, not just the frontend. A user can bypass frontend checks.

4. **Sending huge transcripts to GPT at once**  
   For very long lectures (>1 hour), the transcript might exceed GPT's context limit. Split it into chunks if needed.

5. **Not setting a file size limit**  
   Add `limits: { fileSize: 100 * 1024 * 1024 }` to your multer config (100MB).

6. **Storing API keys directly in your code**  
   Always use `process.env.YOUR_KEY`. Never write the actual key in your code files.

7. **Not testing with short audio first**  
   Use a 1–2 minute recording for all your testing. Don't waste API credits on full lectures until everything works.

8. **Skipping error handling**  
   Every `await` call to an external API (OpenAI, Cloudinary) needs a `try/catch` block. APIs fail sometimes. Handle it gracefully.

---

## 17. RESOURCES & LEARNING LINKS

### Getting Started:
- Node.js + Express basics: https://expressjs.com/en/starter/hello-world.html
- React crash course: https://react.dev/learn
- Tailwind CSS: https://tailwindcss.com/docs/installation
- Prisma ORM tutorial: https://www.prisma.io/docs/getting-started

### APIs You'll Use:
- OpenAI Whisper (audio → text): https://platform.openai.com/docs/guides/speech-to-text
- OpenAI GPT API: https://platform.openai.com/docs/guides/text-generation
- Cloudinary upload guide: https://cloudinary.com/documentation/node_image_and_video_upload

### Authentication:
- JWT guide: https://jwt.io/introduction
- bcrypt in Node.js: https://www.npmjs.com/package/bcryptjs

### Deployment:
- Deploy React to Vercel: https://vercel.com/docs
- Deploy Node.js to Railway: https://docs.railway.app

### Helpful YouTube Searches:
- "MERN stack tutorial for beginners"
- "OpenAI Whisper API Node.js"
- "JWT authentication Node.js Express"
- "Prisma PostgreSQL tutorial"
- "Deploy React app Vercel"

---

*Document Version 1.0 — LectureAI Project*  
*Good luck with your project! Build one phase at a time, test as you go, and don't rush. 🚀*
