<div align="center">

# 🎯 Resume.AI

### AI-Powered Resume Builder & ATS Optimizer

*Upload your resume · Get AI analysis · Export ATS-ready PDFs in seconds*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://your-app.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://your-backend.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

![Resume.AI Banner](docs/banner.png)

</div>

---

## ✨ What It Does

Resume.AI is a full-stack web application that helps job seekers:

1. **Parse their resume** — Upload a PDF or paste plain text. Gemini AI extracts structured data (name, experience, education, skills) automatically.
2. **Build & edit** — Edit every section inline with a live preview in 5 professional ATS-compatible templates.
3. **Analyze vs. a JD** — Paste a job description and receive an ATS score (0–100), a keyword gap report, and AI-generated bullet-point rewrites tailored to the role.
4. **Export** — Print or save the final resume as a PDF directly from the browser.

---

## 🖼️ Features at a Glance

| Feature | Description |
|---|---|
| 📄 **PDF Upload & Parse** | Drag & drop a PDF; text is extracted server-side and sent to Gemini AI |
| ✏️ **Inline Editing** | Click any field on the resume to edit it live |
| 🎨 **5 ATS Templates** | Jake/FAANG Classic, Executive, Austere, Alex Webb, Modern Split |
| 🤖 **ATS Score & Gap Analysis** | Keyword matching against any job description |
| 💡 **AI Bullet Rewrites** | Gemini suggests stronger, metric-driven bullet points |
| 🔁 **Heuristic Fallback** | Works even when Gemini API is rate-limited |
| 🖨️ **PDF Export** | Browser `window.print()` — clean, no extra dependencies |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────┐
│                   User's Browser                   │
│                                                    │
│  React 19 SPA (Vite + TanStack Router + Tailwind)  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │ Upload   │  │ Resume   │  │   ATS Analyzer    │ │
│  │ Panel    │  │ Editor   │  │  (Score + Gaps)   │ │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘ │
└───────┼─────────────┼─────────────────┼────────────┘
        │             │                 │
        └─────────────┴─────────────────┘
                      │  REST API (JSON)
                      ▼
        ┌─────────────────────────────┐
        │   Express Backend (Node.js) │
        │                             │
        │  POST /api/upload-parse-resume  │
        │  POST /api/parse-resume         │
        │  POST /api/analyze-ats          │
        │  GET  /api/health               │
        │                             │
        │  ┌───────────────────────┐  │
        │  │   pdf-parse library   │  │
        │  │   (text extraction)   │  │
        │  └──────────┬────────────┘  │
        │             ▼               │
        │  ┌───────────────────────┐  │
        │  │   Google Gemini AI    │  │
        │  │  (parse + analyze)    │  │
        │  └──────────┬────────────┘  │
        │             │               │
        │  ┌──────────▼────────────┐  │
        │  │  Heuristic Fallback   │  │
        │  │  (if Gemini is down)  │  │
        │  └───────────────────────┘  │
        └─────────────────────────────┘
```

---

## 📁 Project Structure

```
Resume.AI/
│
├── 📂 frontend/                    # React SPA (deployed on Vercel)
│   ├── index.html                  # SPA entry point
│   ├── vercel.json                 # SPA routing rewrite rules
│   ├── vite.config.ts              # Vite + Tailwind + TanStack Router
│   ├── .env.example                # Environment variable template
│   └── src/
│       ├── main.tsx                # React DOM entry
│       ├── router.tsx              # TanStack Router setup
│       ├── styles.css              # Global design system + Tailwind
│       ├── routes/
│       │   ├── __root.tsx          # App shell (header, layout)
│       │   └── index.tsx           # Main page (all panels)
│       ├── components/
│       │   ├── resume/             # Section editors (Experience, Education, Skills...)
│       │   └── templates/          # 5 ATS resume templates + renderer
│       ├── services/
│       │   └── api.ts              # All backend API calls
│       ├── data/
│       │   └── defaultResumeData.ts  # Placeholder data for first load
│       ├── types/
│       │   └── resume.ts           # TypeScript interfaces
│       └── hooks/
│           └── use-mobile.tsx      # Responsive breakpoint hook
│
├── 📂 backend/                     # Express API (deployed on Render)
│   ├── .env.example                # Environment variable template
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts               # All API routes + Gemini integration
│       └── checkModels.ts          # Dev utility: list available Gemini models
│
├── 📂 docs/
│   └── sample-resumes/             # Sample PDFs for testing
│
├── render.yaml                     # One-click Render.com deployment config
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) *(free tier available)*

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resume-ai.git
cd resume-ai
```

### 2. Set Up the Backend

```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# → Edit .env and add your GEMINI_API_KEY

# Start the development server
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Set Up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# (Optional) Configure the API URL
cp .env.example .env.local
# Default: VITE_API_BASE_URL=http://localhost:5000/api

# Start the development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Open the App

Visit **http://localhost:5173** in your browser.

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port for the Express server (default: `5000`) |
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key for AI parsing & analysis |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | No | Backend URL (default: `http://localhost:5000/api`) |

---

## ☁️ Deployment

### Frontend → Vercel

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Framework Preset** | Vite |

Add this environment variable in the Vercel dashboard:
```
VITE_API_BASE_URL = https://your-backend.onrender.com/api
```

> The `frontend/vercel.json` handles SPA routing — all paths serve `index.html`.

### Backend → Render

The `render.yaml` at the root auto-configures deployment:

1. Go to [render.com](https://render.com) → **New → Blueprint**
2. Connect your GitHub repository
3. Render detects `render.yaml` automatically
4. Add `GEMINI_API_KEY` manually in the Render dashboard → **Environment**

---

## 🤖 API Reference

All endpoints return JSON. Base URL: `http://localhost:5000`

### `GET /api/health`
Returns server status and whether the Gemini key is configured.

```json
{
  "status": "ok",
  "service": "Resume AI Backend",
  "hasGeminiKey": true
}
```

---

### `POST /api/upload-parse-resume`
Upload a PDF file. Returns structured resume data.

**Request:** `multipart/form-data` with field `file` (PDF).

**Response:**
```json
{
  "success": true,
  "source": "gemini-ai (gemini-flash-latest)",
  "data": {
    "personal": { "fullName": "...", "email": "...", "phone": "..." },
    "summary": "...",
    "experience": [ { "company": "...", "role": "...", "bullets": [] } ],
    "education": [ { "institution": "...", "degree": "..." } ],
    "skills": [ { "category": "Languages", "skills": ["Python", "JS"] } ]
  }
}
```

---

### `POST /api/parse-resume`
Parse plain-text resume. Same response shape as above.

**Request body:**
```json
{ "rawText": "JOHN DOE\njohn@example.com\n..." }
```

---

### `POST /api/analyze-ats`
Analyze a resume against a job description.

**Request body:**
```json
{
  "resumeText": "...",
  "jobTitle": "Senior Engineer",
  "company": "Google",
  "jobDescription": "..."
}
```

**Response:**
```json
{
  "success": true,
  "source": "gemini-ai (gemini-flash-latest)",
  "score": 87,
  "gaps": [
    { "label": "Kubernetes", "missing": true },
    { "label": "Python", "missing": false }
  ],
  "suggestions": [
    {
      "id": "s1",
      "title": "Quantify Backend Impact",
      "rationale": "The JD emphasizes scale. Add throughput metrics.",
      "rewrite": "Engineered backend services handling 50k req/sec with P99 < 20ms.",
      "targetBulletId": "exp_1",
      "priority": true
    }
  ]
}
```

---

## 🎨 Resume Templates

| Template | Style | Best For |
|---|---|---|
| **Jake / FAANG Classic** | Serif, single-column, ATS-safe | Software engineering roles at FAANG |
| **Executive** | Serif, formal header | Senior / leadership positions |
| **Austere** | Monospace, minimal | Developer-focused, creative roles |
| **Alex Webb** | Sans-serif, emerald accent | Design & product roles |
| **Modern Split** | Two-column, sidebar | Visually rich, non-ATS applications |

---

## 🧠 How the AI Works

```
User uploads PDF
    ↓
[Backend] pdf-parse extracts raw text
    ↓
[Backend] Sends text to Gemini AI with a structured JSON prompt
    ↓
  ┌── Gemini responds → parse JSON → return to frontend
  │
  └── Gemini fails (rate limit / 503)
        ↓
       [Backend] Heuristic parser runs:
        • Scans first 10 lines for name / email / phone / links
        • Detects section headings (Experience, Education, Skills…)
        • Extracts bullet points and categorizes by section
        • Returns structured data (same shape as Gemini response)
```

> **No AI, no problem.** The heuristic fallback ensures the app always returns usable data, even when Gemini is unavailable.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Routing** | TanStack Router (file-based) |
| **UI Components** | Radix UI primitives + Lucide icons |
| **Backend** | Node.js + Express |
| **Language** | TypeScript (both frontend & backend) |
| **PDF Parsing** | `pdf-parse` |
| **AI** | Google Gemini API (`gemini-flash-latest`) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## 🤝 Contributing

Pull requests are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push and open a PR

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ by **Murari Venkata Sai Manoj**

[⭐ Star this repo](https://github.com/your-username/resume-ai) · [🐛 Report a Bug](https://github.com/your-username/resume-ai/issues) · [💡 Request a Feature](https://github.com/your-username/resume-ai/issues)

</div>
