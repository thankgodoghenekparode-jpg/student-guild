# Student Career Guide

Modern mobile-first web app for secondary and university students to discover careers, explore courses, and plan study goals.

## Project Structure
- `frontend/` React + Tailwind mobile web app
- `backend/` lightweight Node API for auth and health checks, with file-based local storage

## Features
- Career quiz with AI-style recommendations
- Course explorer with WAEC + JAMB requirements
- Scholarships & opportunities feed
- Student advice blog
- Study planner with weekly progress
- Dark mode
- Bookmarks and saved quiz results
- Notifications for scholarship updates
- Auth that prefers the backend API and falls back to `localStorage` when the API is unavailable

## Run Locally

### Quick start from repo root

```bash
npm run setup
npm run dev
npm run build
```

`npm run dev` starts both the backend API and the frontend dev server together.

### Backend API

```bash
cd backend
copy .env.example .env
npm run dev
```

API runs on `http://localhost:5000`.
Health check: `http://localhost:5000/api/health`

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Notes
- In local development, Vite proxies `/api` requests to `http://localhost:5000` by default.
- The frontend keeps working even if the backend is offline by falling back to `localStorage` for auth.
- The backend stores local development users in `backend/.data/users.json`, which is gitignored.
- From the repo root, use `npm run dev` for both apps, `npm run dev:backend` for the API only, and `npm run dev:frontend` for the frontend only.
