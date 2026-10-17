# 🧠 MindMate – Student Mental Wellness AI

> An anonymous, judgment-free mental wellness companion designed for students. Track daily mood, detect burnout & anxiety patterns using Gemini AI, and receive personalized coping exercises with interactive trend analytics.

[![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20Gemini%20AI-blueviolet)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com)

---

## 📌 Project Overview (Capstone Project #9)

Students face unique academic pressures, competitive stress, and burnout. **MindMate** provides a safe, **100% anonymous, judgment-free space** where students can:
- Perform daily emoji-based mood check-ins with optional journaling.
- Leverage **Google Gemini AI** to detect anxiety, burnout, and stress signals from journal entries.
- Receive immediate, tailored coping strategies (guided 4-7-8 breathing, focus breaks, calming ambient audio suggestions, physical activity prompts).
- Visualize mood trends and emotional patterns across weeks and months using interactive analytics.

---

## 🚀 Key Features

- **🎭 Emoji-based Quick Check-in**: Fast 1-click emotional state logging (Rad, Good, Meh, Bad, Awful) with intensity sliders and custom tags (`#exams`, `#deadlines`, `#sleep`, `#social`).
- **📝 Confidential Journaling**: Freeform journal space that stores entries securely or client-side/anonymously.
- **🤖 Gemini AI Sentiment & Stress Analyzer**: Deep analysis of journal text detecting:
  - Stress Level (Low, Moderate, High, Severe)
  - Emotional burnout & exam anxiety indicators
  - Tone & recurring cognitive patterns
- **🧘 Personalized Coping Toolkits**:
  - Interactive Visual Breathing Guide (Box Breathing, 4-7-8)
  - Study Break Pomodoro & Reset Timer
  - Calming lo-fi sound generator & recommendations
  - Quick grounding exercises (5-4-3-2-1 technique)
- **📊 Longitudinal Trend Analytics**: Weekly and monthly mood charts, tag correlation breakdown, and burnout alerts.
- **🛡️ 100% Anonymous & Judgment-Free**: No mandatory email signup or identity leaks. Uses secure anonymous UUID/session keys.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS, Lucide Icons, Recharts, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB & Mongoose |
| **AI Engine** | Google Gemini API (`@google/genai` / `gemini-1.5-flash`) |
| **Architecture** | REST API, Anonymous Session Token Auth |

---

## 📂 Project Structure

```text
mindmate-ai/
├── client/                     # Frontend React Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MoodCheckIn.jsx       # Emoji selector & quick logger
│   │   │   ├── JournalEditor.jsx     # Journal writing & AI trigger
│   │   │   ├── AIInsightCard.jsx     # Gemini analysis breakdown
│   │   │   ├── CopingToolkit.jsx     # Breathing & grounding exercises
│   │   │   ├── MoodAnalytics.jsx     # Graphs & trend visualizations
│   │   │   └── Navbar.jsx            # Header & Anonymous status
│   │   ├── App.jsx                   # Main Dashboard
│   │   ├── index.css                 # Tailwind & custom styles
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js / Express API
│   ├── controllers/
│   │   ├── moodController.js         # Mood log CRUD
│   │   └── aiController.js           # Gemini AI analysis & coping prompt
│   ├── models/
│   │   └── MoodEntry.js              # Mongoose schema for mood & insights
│   ├── routes/
│   │   ├── moodRoutes.js
│   │   └── aiRoutes.js
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── .env.example
│   ├── package.json
│   └── server.js                     # Entry point
│
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB installed locally or MongoDB Atlas URI
- Google Gemini API Key ([Get it for free at Google AI Studio](https://aistudio.google.com/))

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY and MONGODB_URI
npm run dev
```
Backend will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
Frontend will open on `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindmate
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

---

## 🧠 Gemini AI Prompt Engineering
MindMate uses structured JSON system instructions to ensure compassionate, clinically safe, non-diagnostic, and constructive feedback.

Example AI response payload:
```json
{
  "burnoutScore": 72,
  "sentiment": "Anxious / Overwhelmed",
  "primaryTriggers": ["upcoming finals", "sleep deprivation"],
  "summary": "You are carrying significant cognitive load due to impending exams.",
  "recommendedActivities": [
    {
      "type": "breathing",
      "title": "4-7-8 De-escalation Breathing",
      "duration": "3 mins",
      "instruction": "Inhale for 4s, hold for 7s, exhale slowly for 8s."
    },
    {
      "type": "study-break",
      "title": "Eyes-Off Screen Reset",
      "duration": "10 mins",
      "instruction": "Step out into natural light, drink a glass of water, avoid your phone."
    }
  ]
}
```

---

## 🚢 Pushing to GitHub

To publish this project to your own GitHub profile:

```bash
# 1. Initialize git from the project folder
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "feat: complete MindMate MERN + Gemini AI project"

# 4. Rename branch to main
git branch -M main

# 5. Link to your GitHub repo
git remote add origin https://github.com/DivyanshSingh04/MindMate.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
