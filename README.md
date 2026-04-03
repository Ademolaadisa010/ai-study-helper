# 📚 AI Study Helper

> Turn your notes into smart study materials instantly — powered by AI.

Built for the **[Devpost Learning Hackathon: Spec Driven Development](https://devpost.com/hackathons)** • April 2026

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-blue?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🚀 Live Demo

👉 **[Try the App](https://your-app-url.vercel.app)**
📄 **[Landing Page](https://your-app-url.vercel.app)**

---

## 📖 What Is This?

AI Study Helper is a web app that helps students learn faster by turning their notes into useful study materials using AI.

Paste your notes and instantly get:

- **📋 Concise Summary** — key points extracted so you know what matters
- **❓ Practice Questions** — 3 AI-generated questions with instant grading and feedback
- **💡 Simple Explanation** — complex content rewritten in plain, everyday language

No login. No setup. Just paste and go.

---

## 🎯 Why I Built This

Students waste hours rereading notes without retaining anything. Most AI tools are either too complex or not interactive enough. This app solves that with a single-session, zero-friction experience that meets students exactly where they are.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 Summarize | Bullet-point summary of your notes with key terms highlighted |
| ❓ Practice Questions | 3 questions generated from your notes |
| ✅ AI Grading | Type your answer and get Correct / Partial / Incorrect feedback |
| 💡 Explain Simply | Plain-language breakdown using analogies |
| 🧪 Sample Note | One-click demo — no typing required |
| 📊 Progress Tracker | See how many questions you got right at a glance |

---

## 🛠️ Tech Stack

- **Frontend** — Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend** — Next.js API Routes (server-side AI calls)
- **AI** — Google Gemini 2.0 Flash API
- **Hosting** — Vercel

---

## 📁 Project Structure

```
ai-study-helper/
├── app/
│   ├── page.tsx              # Landing page
│   ├── study/
│   │   └── page.tsx          # Main app page
│   └── api/
│       └── claude/
│           └── route.ts      # Gemini API route
├── docs/                     # Planning artifacts (hackathon requirement)
│   ├── scope.md
│   ├── prd.md
│   ├── technical-spec.md
│   └── build-checklist.md
├── .env.local                # API key (not committed)
└── README.md
```

---

## ⚙️ Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/ademolaadisa010/ai-study-helper.git
cd ai-study-helper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a free Gemini API key

1. Go to **[aistudio.google.com](https://aistudio.google.com)**
2. Sign in with Google → click **Get API Key** → **Create API Key**
3. Copy the key (starts with `AIzaSy...`)

### 4. Add your API key

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=AIzaSy-your-key-here
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel

1. Push your code to GitHub
2. Go to **[vercel.com](https://vercel.com)** and import your repo
3. In **Environment Variables**, add `GEMINI_API_KEY` with your key
4. Click **Deploy** — done!

---

## 🏆 Hackathon — Spec Driven Development

This project was built for the **Devpost Learning Hackathon: Spec Driven Development**.

The goal of the hackathon is not competition — it's learning the habit of **planning before building**. The process:

1. **Scope** — define what's in v1 and what's explicitly out
2. **PRD** — write user stories and acceptance criteria before touching code
3. **Technical Spec** — make architecture decisions upfront
4. **Build Checklist** — build feature by feature against the spec
5. **Ship** — working app, not a prototype

### What I Learned

- **Spec-driven development** produces cleaner code and a clearer scope than vibe-coding
- **Flipped prompting** — having the AI interview me surfaced requirements I'd have missed
- **Context management** — keeping AI productive across sessions requires deliberate state
- **Scope discipline** — explicitly deciding what's out (file upload, auth, history) saved hours

### Planning Artifacts

All planning documents are in the `/docs` folder:

| Document | What It Covers |
|---|---|
| `scope.md` | What's in v1, what's out, and why |
| `prd.md` | User stories and acceptance criteria |
| `technical-spec.md` | Architecture, stack, API design |
| `build-checklist.md` | Step-by-step tasks tracked during the build |

---

## 🔒 Privacy

- No login required
- Notes are never stored or saved
- Each session is completely independent
- API calls go server-side (your notes never touch the client's network directly)

---

## 📄 License

MIT — free to use, fork, and build on.

---

Built with ❤️ by Abdulrosheed Abdulmalik (https://github.com/Ademolaadisa010)