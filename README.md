# Sorout

A full-stack web application designed to automate and streamline the technical interview process. It provides role-based access for administrators to configure interview templates, manage candidate assignments, and review evaluations. Candidates can participate in either structured question-and-answer formats or live, conversational voice-driven sessions powered by large language models (LLMs). The system evaluates responses and generates structured performance reports.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Authentication and Authorization](#authentication-and-authorization)
6. [API Overview](#api-overview)
7. [Environment Configuration](#environment-configuration)
8. [Installation and Setup](#installation-and-setup)
9. [Running the Project Locally](#running-the-project-locally)

---

## Features

* **Role-Based Access Control:** Distinct workflows for Administrators (manage templates, assign candidates, view results) and Candidates (participate in interviews).
* **Organization Management:** Support for organizational structures, inviting members via join links, and isolating data by organization.
* **AI-Generated Interviews:** Automatically generate technical interview questions based on job position and seniority level.
* **Conversational Voice Interface:** Candidates can interact with the AI using their microphone via the Web Speech API (`SpeechRecognition` for input, `SpeechSynthesis` for output).
* **Structured Q&A Interface:** Alternative text-based interface for completing interview sessions.
* **Automated Evaluation:** Post-interview AI evaluation of candidate responses, resulting in structured performance reports.
* **Secure Sessions:** HTTP-only cookies for JWT storage, preventing cross-site scripting (XSS) attacks.

---

## Tech Stack

### Backend
* **Framework:** FastAPI
* **Database:** PostgreSQL / SQLite
* **ORM & Migrations:** SQLAlchemy (sync) and Alembic
* **Authentication:** JWT via `python-jose`, password hashing via `bcrypt`
* **AI / LLM Orchestration:** LangChain, LangGraph
* **LLM Providers:** HuggingFace Inference API (`meta-llama/Llama-3.1-8B-Instruct`), Google GenAI
* **Rate Limiting:** SlowAPI

### Frontend
* **Framework:** React 19 (TypeScript)
* **Build Tool:** Vite 7
* **State Management:** Redux Toolkit
* **Routing:** React Router v7
* **Styling:** Tailwind CSS v4, `shadcn/ui`, Radix UI
* **Form Handling:** React Hook Form with Zod validation
* **HTTP Client:** Axios
* **Tables:** TanStack React Table

---

## Architecture Overview

The system operates as a decoupled architecture where a React frontend communicates with a FastAPI backend via a versioned REST API.

```mermaid
flowchart LR
    subgraph Frontend [Frontend (React + Vite)]
        UI[User Interface]
        Redux[Redux Store]
        UI <--> Redux
    end

    subgraph Backend [Backend (FastAPI)]
        API[REST API]
        Services[Business Logic]
        Repo[Data Repositories]
        API <--> Services
        Services <--> Repo
    end

    subgraph External [External Services]
        LLM[HuggingFace / Google GenAI]
        DB[(PostgreSQL)]
    end

    Redux <-->|HTTP / REST| API
    Services <-->|LangChain| LLM
    Repo <-->|SQLAlchemy| DB
```

---

## Project Structure

```
ai_interview_system/
├── backend/
│   ├── alembic/                # Database migrations
│   ├── app/
│   │   ├── ai/                 # LangChain components, prompts, and chains
│   │   ├── api/                # Route handlers (admin, candidate, shared)
│   │   ├── core/               # App configuration and database setup
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── repositories/       # Data access layer
│   │   ├── routers/            # Router aggregation
│   │   ├── schemas/            # Pydantic models for request/response validation
│   │   ├── services/           # Core business logic
│   │   ├── utils/              # Security and rate limiting utilities
│   │   └── main.py             # FastAPI application entry point
│   ├── alembic.ini             # Alembic configuration
│   └── requirements.txt        # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── api/                # Axios instance configuration
    │   ├── app/                # Redux store setup
    │   ├── components/         # Reusable UI components (shadcn, tables, dialogs)
    │   ├── features/           # Redux slices, thunks, and types
    │   ├── hooks/              # Custom React hooks (e.g., useVoiceConversation)
    │   ├── layouts/            # Page layout wrappers
    │   ├── pages/              # Role-specific route components (admin, candidate)
    │   └── routes/             # React Router configuration
    ├── package.json            # Node.js dependencies and scripts
    ├── tailwind.css            # Global stylesheet
    └── vite.config.ts          # Vite configuration
```

---

## Authentication and Authorization

* **JWT Strategy:** The backend issues a signed JWT upon successful login. It is set as an `httpOnly` cookie (`access_token`) on the client.
* **CORS:** Cross-origin requests are configured with `allow_credentials=True` to ensure cookies are sent with every API request.
* **Role Verification:** Endpoints enforce access based on organization memberships and roles (`Admin` vs. `Candidate`). The frontend uses `ProtectedRoute` wrappers to enforce role-based routing.

---

## API Overview

The backend exposes a RESTful API under the `/api` prefix, divided into distinct routers:

### Shared Routes (`/api/auth`)
* `POST /auth/register` - Register a new user.
* `POST /auth/login` - Authenticate and receive an `httpOnly` cookie.
* `GET /auth/me` - Fetch the authenticated user's profile.
* `POST /auth/logout` - Clear the session cookie.

### Admin Routes (`/api/admin`)
* `/interviews` - CRUD operations for interview templates.
* `/interviews/{id}/generate` - Trigger AI generation of technical questions.
* `/candidates` - View available candidates within an organization.
* `/join-links` - Manage organization invitation links.

### Candidate Routes (`/api/candidate`)
* `/sessions` - View assigned interview sessions.
* `/sessions/{id}/conversation/start` - Initiate a voice conversational session.
* `/sessions/{id}/conversation/message` - Transmit candidate audio transcripts and receive AI replies.
* `/sessions/{id}/evaluate` - Trigger the final evaluation and performance report generation.

---

## Environment Configuration

Both the frontend and backend require environment variables. 

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PROJECT_NAME="AI Interview System"
SECRET_KEY=<your-secure-random-string>
HF_TOKEN=<your-huggingface-access-token>
GEMINI_API_KEY=<your-google-genai-api-key>
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

Ensure the frontend points to the correct backend API URL. By default, Vite proxies `/api` or the Axios instance targets `http://localhost:8000` via its base URL configuration.

---

## Installation and Setup

### Prerequisites

* Python 3.10+
* Node.js 18+
* PostgreSQL (or SQLite for local development)
* HuggingFace API Token (for LLM inference)

### 1. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

---

## Running the Project Locally

### Start the Backend

```bash
cd backend
source venv/bin/activate
cd app

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
The API documentation (Swagger UI) is available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### Start the Frontend

```bash
cd frontend

# Start the Vite development server
npm run dev
```
The frontend application is available at: [http://localhost:5173](http://localhost:5173)
