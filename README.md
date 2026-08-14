# AI Interview System

A full-stack web application that automates the technical interview process. Admins create and configure interviews; candidates complete them through either a structured question-answer flow or a live voice-driven conversational session powered by a large language model. At the end of each session, the system evaluates responses and generates a structured performance report.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [User Roles and Flows](#user-roles-and-flows)
- [Key Design Decisions](#key-design-decisions)

---

## Architecture Overview

The system is split into two independent applications that communicate over HTTP.

```
┌─────────────────────────────┐        ┌──────────────────────────────────┐
│         Frontend            │        │            Backend               │
│   React 19 + TypeScript     │ <----> │   FastAPI + SQLAlchemy + LangChain│
│   Vite + Redux Toolkit      │  REST  │   Llama 3.1 via HuggingFace      │
│   TailwindCSS + shadcn/ui   │        │   PostgreSQL / SQLite             │
└─────────────────────────────┘        └──────────────────────────────────┘
```

The backend exposes a versioned REST API under `/api`. All endpoints requiring authentication read a signed JWT from an `httpOnly` cookie, which prevents client-side token access.

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy (sync) |
| Database | Any SQLAlchemy-compatible DB (tested with PostgreSQL) |
| Auth | JWT via `python-jose`, bcrypt password hashing |
| AI / LLM | LangChain + HuggingFace Inference API (Llama 3.1 8B Instruct) |
| Rate Limiting | SlowAPI |
| Config | Pydantic Settings (`.env` file) |

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Bundler | Vite 7 |
| State Management | Redux Toolkit |
| Routing | React Router v7 |
| UI Components | shadcn/ui + Radix UI |
| Styling | TailwindCSS v4 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Voice / TTS | Web Speech API (SpeechRecognition + SpeechSynthesis) |

---

## Project Structure

```
ai_interview_system/
├── backend/
│   └── app/
│       ├── main.py                  # FastAPI app, middleware, router registration
│       ├── core/
│       │   ├── config.py            # Pydantic settings loaded from .env
│       │   └── database.py          # SQLAlchemy engine and session factory
│       ├── models/                  # SQLAlchemy ORM models
│       │   ├── user.py
│       │   ├── interview.py
│       │   ├── interview_session.py
│       │   ├── interview_question.py
│       │   ├── answer.py
│       │   ├── conversation_message.py
│       │   ├── interview_evaluation.py
│       │   └── question_evaluation.py
│       ├── schemas/                 # Pydantic request/response schemas
│       ├── repositories/            # Data access layer (raw DB queries)
│       ├── services/                # Business logic layer
│       ├── api/                     # Route handlers
│       │   ├── auth.py
│       │   ├── user.py
│       │   ├── candidate.py
│       │   ├── interview.py
│       │   ├── interview_session.py
│       │   ├── conversation.py
│       │   └── evaluation.py
│       ├── ai/
│       │   ├── llm.py               # LangChain LLM client (Llama 3.1)
│       │   ├── chains/              # LangChain chains (question gen, chat, evaluation)
│       │   ├── prompts/             # Prompt templates
│       │   └── schemas/             # Structured output schemas for LLM responses
│       └── utils/
│           ├── security.py          # JWT creation and password hashing
│           └── rate_limit.py        # SlowAPI limiter instance
│
└── frontend/
    └── src/
        ├── app/                     # Redux store configuration
        ├── features/                # Redux slices and thunks
        │   ├── candidate/
        │   ├── interview/
        │   ├── interviewSession/
        │   └── conversationInterview/
        ├── hooks/
        │   └── useVoiceConversation.ts  # Speech recognition + TTS hook
        ├── pages/
        │   ├── admin/               # Interview management dashboard
        │   └── candidate/
        │       ├── CandidateInterviews.tsx
        │       ├── InterviewInstructionsPage.tsx
        │       ├── InterviewWorkspace.tsx       # Structured Q&A mode
        │       ├── ConversationalWorkspace.tsx  # Voice conversation mode
        │       └── InterviewResultPage.tsx
        ├── components/
        ├── layouts/                 # AdminLayout, CandidateLayout
        └── routes/
            ├── AppRouter.tsx
            └── ProtectedRoute.tsx   # Role-based route guard
```

---

## Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- A database supported by SQLAlchemy (PostgreSQL recommended)
- A HuggingFace account with API access to `meta-llama/Llama-3.1-8B-Instruct`

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file (see Environment Variables section below)
# Then start the development server from the app directory
cd app
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive documentation is at `http://localhost:8000/docs`.

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | SQLAlchemy connection string | `postgresql://user:pass@localhost/db` |
| `PROJECT_NAME` | Title shown in the OpenAPI docs | `AI Interview System` |
| `SECRET_KEY` | Secret used to sign JWTs | A long, random string |
| `ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes | `1440` |
| `HF_TOKEN` | HuggingFace API token | `hf_...` |

---

## API Reference

All routes are prefixed with `/api`.

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Authenticate and set session cookie |
| GET | `/auth/me` | Required | Return the current user's profile |
| POST | `/auth/logout` | Public | Clear the session cookie |

### Interviews — `/api/interviews` (Admin only)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/interviews` | Create a new interview |
| GET | `/interviews` | List all interviews |
| GET | `/interviews/{id}` | Get a single interview |
| PATCH | `/interviews/{id}` | Update a draft interview |
| DELETE | `/interviews/{id}` | Delete a draft interview |
| POST | `/interviews/{id}/generate-questions` | Generate questions via LLM |
| GET | `/interviews/{id}/questions` | List generated questions |
| POST | `/interviews/{id}/assign` | Assign candidates to an interview |

### Interview Sessions — `/api/interview_session` (Candidate only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/interview_session/{session_id}/question` | Get the current question |
| POST | `/interview_session/{session_id}/answer` | Submit an answer |

### Conversational Interview — `/api/interview_session` (Candidate only)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/interview_session/{session_id}/conversation/start` | Start a session and get the AI's opening message |
| POST | `/interview_session/{session_id}/conversation/message` | Send a candidate message and receive the AI's reply |

### Evaluation — `/api/candidate`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/candidate/sessions/{session_id}/evaluate` | Trigger LLM-based evaluation of a completed session |
| GET | `/candidate/sessions/{session_id}/result` | Retrieve the evaluation report |

---

## User Roles and Flows

The system has two distinct roles, each with a separate UI layout and a dedicated set of routes.

### Admin

1. Log in at `/login`.
2. Navigate to `/admin/interviews` to create an interview, specifying job position, seniority level, and the number of questions.
3. Trigger question generation. The LLM produces role-appropriate technical questions and persists them to the database.
4. When the interview is in `ready` state, assign one or more candidates by user ID. This creates a session record for each candidate.

### Candidate

1. Log in at `/login`.
2. Navigate to `/candidate/interviews` to view assigned sessions.
3. Open the instructions page for a session, then proceed to the workspace.
4. In the conversational workspace, the AI speaks the first question aloud using the browser's `SpeechSynthesis` API. The candidate responds via microphone using the browser's `SpeechRecognition` API. After a period of silence is detected, the transcript is sent to the backend and the AI replies.
5. When the session ends, the candidate triggers evaluation and views the result at `/candidate/result/:sessionId`.

---

## Key Design Decisions

**Cookie-based authentication.** JWTs are stored in `httpOnly` cookies rather than `localStorage`. This prevents XSS attacks from reading the token directly. The tradeoff is that cross-origin requests require the `credentials: "include"` flag and a matching CORS policy on the server, both of which are already configured.

**Repository pattern on the backend.** Database queries are isolated in `repositories/`, business rules live in `services/`, and route handlers in `api/` deal only with request and response concerns. This keeps each layer independently testable and prevents business logic from leaking into route handlers.

**Stable voice recognition lifecycle.** The `useVoiceConversation` hook owns the `SpeechRecognition` instance for its entire lifetime. The `onTranscriptFinalized` callback is stored in a ref internally, so the recognition object is never torn down and recreated when the parent component re-renders. Chrome terminates active recognition sessions whenever the underlying object is garbage-collected, making this pattern essential for a reliable microphone experience.

**Rate limiting.** SlowAPI middleware is applied globally. The limiter instance is defined in `utils/rate_limit.py` and attached to `app.state`, which makes it available for per-route overrides when stricter limits are needed on specific endpoints.

**LangChain abstraction.** The `ai/` module wraps the HuggingFace endpoint behind a standard `ChatHuggingFace` interface. Swapping the underlying model only requires changing the `repo_id` in `llm.py`. The chains, prompt templates, and structured output schemas remain unchanged.
