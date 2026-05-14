# Student Career Guide

Student Career Guide is a three-part project for Nigerian students:

- `frontend/` is the student-facing React app.
- `backend/` is the API with a seeded file-based database, recommendation logic, auth, admin protection, image upload support, and future-service extension points.
- `admin/` is the React admin dashboard for managing courses and survival guide articles.

## What is implemented

- Seeded backend database with 30+ Nigerian-relevant courses.
- Course recommendation quiz that returns the top 3 matched courses.
- JAMB and WAEC CBT practice section with yearly subject drills, exam-year past paper sets, 40 to 60 question full mock exams, scoring, review, saved attempt history, streak tracking, leaderboard support, and performance analytics.
- Recommendation output with match percentage, fit explanation, required subjects, careers, and recommended side skills.
- Save Course flow backed by the API.
- AI Mentor chat UI with a real backend endpoint and placeholder response logic that is ready to swap for OpenAI later.
- Student Survival Guide article categories:
  - Financial discipline
  - Avoiding bad influence
  - Study techniques
  - Skill development
  - Internship preparation
- Admin dashboard for:
  - Adding and editing courses
  - Updating cut-off marks
  - Adding, editing, and deleting guide articles
  - Adding, editing, and deleting CBT practice questions
  - Bulk importing CBT practice questions from pasted or uploaded JSON and CSV files
  - Exporting the filtered practice bank as downloadable JSON or CSV
  - Uploading article images
  - Viewing total users
  - Viewing most selected courses
  - Viewing practice question and attempt totals
- Security basics:
  - Input validation
  - Protected admin routes
  - Sanitized query handling
  - Signed auth tokens with expiry
- Future scalability structure for:
  - Premium subscriptions
  - Push notifications
  - University ads
  - Scholarship integrations

## Architecture

### Backend

- Express API
- Database backends: File (default), PostgreSQL, or Supabase
- Authentication: JWT with optional Supabase Auth integration

### Database Setup

The project supports multiple database backends:

#### File Storage (Default)
- No setup required
- Data stored in `backend/.data/` as JSON files
- Suitable for development and small deployments

#### PostgreSQL
- Set `DATABASE_URL` environment variable
- Requires PostgreSQL server
- Better performance for larger datasets

#### Supabase (Recommended for Production)
Supabase provides a PostgreSQL database with additional features like real-time subscriptions, authentication, and storage.

**Setup Steps:**

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for setup to complete

2. **Get Your Credentials:**
   - Go to Settings > API in your Supabase dashboard
   - Copy your Project URL and anon/public key
   - Go to Settings > API > Service Role and copy the service_role key

3. **Configure Environment Variables:**
   ```bash
   # Backend (.env)
   DATABASE_PROVIDER=supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_STORAGE_BUCKET=your-storage-bucket-name

   # Frontend (.env)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Create Database Tables:**
   Run the following SQL in your Supabase SQL Editor:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     name TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Courses table
   CREATE TABLE courses (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     institution_type TEXT NOT NULL,
     category TEXT NOT NULL,
     summary TEXT NOT NULL,
     overview TEXT NOT NULL,
     cutoff_mark INTEGER DEFAULT 180,
     required_subjects TEXT[] DEFAULT '{}',
     jamb_combination TEXT NOT NULL,
     careers TEXT[] DEFAULT '{}',
     side_skills TEXT[] DEFAULT '{}',
     tags TEXT[] DEFAULT '{}',
     strengths TEXT[] DEFAULT '{}',
     interests TEXT[] DEFAULT '{}',
     work_styles TEXT[] DEFAULT '{}',
     goals TEXT[] DEFAULT '{}',
     study_preferences TEXT[] DEFAULT '{}',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Articles table
   CREATE TABLE articles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     category TEXT NOT NULL,
     content TEXT NOT NULL,
     excerpt TEXT NOT NULL,
     tags TEXT[] DEFAULT '{}',
     image_url TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Practice questions table
   CREATE TABLE practice_questions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     subject TEXT NOT NULL,
     question TEXT NOT NULL,
     options TEXT[] NOT NULL,
     correct_answer INTEGER NOT NULL,
     explanation TEXT NOT NULL,
     year INTEGER,
     exam_type TEXT NOT NULL,
     difficulty TEXT NOT NULL,
     tags TEXT[] DEFAULT '{}',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Practice attempts table
   CREATE TABLE practice_attempts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     question_id UUID REFERENCES practice_questions(id) ON DELETE CASCADE,
     selected_answer INTEGER NOT NULL,
     is_correct BOOLEAN NOT NULL,
     time_spent INTEGER NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Saved courses table
   CREATE TABLE saved_courses (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable Row Level Security (optional, for advanced auth)
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
   ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE practice_attempts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE saved_courses ENABLE ROW LEVEL SECURITY;
   ```

5. **Run the Application:**
   ```bash
   npm run setup
   npm run dev
   ```

**Benefits of Supabase:**
- Real-time data synchronization
- Built-in authentication and authorization
- Automatic API generation
- File storage integration
- Better scalability than file storage
- Real-time subscriptions for live updates
- Repositories, controllers, models, routes, middleware, and services separated by responsibility
- Seed data is initialized automatically on first start

### Student frontend

- React + Vite
- Student auth, quiz, course explorer, mentor chat, survival guide, profile, careers, planner, and scholarships screens
- API-backed recommendations, saved courses, course catalog, and guide content

### Admin frontend

- React + Vite
- Protected admin login
- Overview stats, course management, article management, image upload workflow, and practice-bank import/export tools

## Project structure

```text
student-career-guide/
├─ admin/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ utils/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ styles.css
│  ├─ .env.example
│  ├─ index.html
│  ├─ package.json
│  └─ vite.config.js
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ constants/
│  │  ├─ controllers/
│  │  ├─ data/
│  │  ├─ database/
│  │  │  └─ repositories/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ scripts/
│  │  ├─ services/
│  │  │  └─ future/
│  │  ├─ uploads/
│  │  ├─ utils/
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ .env.example
│  ├─ package.json
│  └─ server.js
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ data/
│  │  ├─ hooks/
│  │  ├─ pages/
│  │  ├─ utils/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ styles.css
│  ├─ .env.example
│  ├─ package.json
│  └─ vite.config.js
├─ scripts/
│  └─ dev.js
├─ package.json
└─ README.md
```

## Setup

### 1. Install dependencies

From the repo root:

```bash
npm run setup
```

### 2. Copy environment files

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
copy admin\.env.example admin\.env
```

### 3. Start everything

```bash
npm run dev
```

This starts:

- Student frontend: `http://127.0.0.1:5173`
- Admin frontend: `http://127.0.0.1:5174`
- Backend API: `http://127.0.0.1:5000`

## Default seeded accounts

- Admin:
  - Email: `admin@studentguide.ng`
  - Password: `Admin@12345`
- Demo student:
  - Email: `student@example.com`
  - Password: `Student@12345`

You can change the admin seed credentials in `backend/.env`.

## Seed data

Seed data is created automatically on first backend start and includes:

- 30+ Nigerian-relevant courses
- 5 survival guide articles across the required categories
- 210 JAMB and WAEC practice questions across 14 subjects and multiple exam years
- 1 admin account
- 1 demo student account

The core seed definitions live in:

- `backend/src/data/seedData.js`

The recommendation algorithm lives in:

- `backend/src/services/recommendationAlgorithm.js`

## Important API endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Courses and recommendations

- `GET /api/courses`
- `GET /api/courses/:courseId`
- `GET /api/courses/saved`
- `POST /api/courses/:courseId/save`
- `DELETE /api/courses/saved/:savedCourseId`
- `GET /api/recommendations/questions`
- `POST /api/recommendations/quiz`

### AI mentor

- `POST /api/mentor/query`

### CBT practice

- `GET /api/practice/catalog`
- `GET /api/practice/questions`
- `POST /api/practice/past-paper-session`
- `POST /api/practice/mock-session`
- `POST /api/practice/submit`
- `GET /api/practice/history`
- `POST /api/practice/history`
- `GET /api/practice/analytics`
- `GET /api/practice/streak`
- `GET /api/practice/leaderboard`

### Survival guide

- `GET /api/articles`
- `GET /api/articles/:articleId`

### Admin

- `GET /api/admin/overview`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `PUT /api/admin/courses/:courseId`
- `DELETE /api/admin/courses/:courseId`
- `GET /api/admin/articles`
- `POST /api/admin/articles`
- `PUT /api/admin/articles/:articleId`
- `DELETE /api/admin/articles/:articleId`
- `GET /api/admin/practice-questions`
- `GET /api/admin/practice-questions/export`
- `POST /api/admin/practice-questions`
- `POST /api/admin/practice-questions/import`
- `PUT /api/admin/practice-questions/:questionId`
- `DELETE /api/admin/practice-questions/:questionId`
- `POST /api/admin/uploads/image`

## Basic API testing instructions

### Health check

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:5000/api/health
```

### Login as admin

```powershell
$body = @{
  email = "admin@studentguide.ng"
  password = "Admin@12345"
} | ConvertTo-Json

$login = Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:5000/api/auth/login `
  -ContentType "application/json" `
  -Body $body

$token = $login.token
```

### Get quiz questions

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:5000/api/recommendations/questions
```

### Test course recommendations

```powershell
$quiz = @{
  answers = @{
    strengths = "mathematics"
    interests = "technology"
    workStyles = "technology"
    goals = "build-products"
    studyPreferences = "practical-builds"
  }
} | ConvertTo-Json -Depth 4

Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:5000/api/recommendations/quiz `
  -ContentType "application/json" `
  -Body $quiz
```

### Fetch admin overview

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:5000/api/admin/overview `
  -Headers @{ Authorization = "Bearer $token" }
```

### Bulk import CBT questions from JSON

```powershell
$questions = @(
  @{
    examType = "JAMB"
    subject = "Use of English"
    topic = "Grammar"
    year = "2026"
    prompt = "Choose the best option."
    options = @("A", "B", "C", "D")
    correctOption = "A"
    explanation = "Option A is correct."
  }
) | ConvertTo-Json -Depth 6

$importBody = @{
  format = "json"
  content = $questions
} | ConvertTo-Json -Depth 6

Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:5000/api/admin/practice-questions/import `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body $importBody
```

### Admin practice bank file tools

- In the admin `Practice Bank` tab, use `Choose file` or drag a local `.json` or `.csv` file into the drop zone to load it into the bulk import panel.
- Use `Export JSON` or `Export CSV` to download the currently filtered practice question list for backup, review, or reuse.
- The backend also exposes `GET /api/admin/practice-questions/export?format=json|csv` so exports can be automated later for scheduled backups.

### Start a 60-question JAMB mock exam

```powershell
$mock = @{
  examType = "JAMB"
  subjects = @("Use of English", "Mathematics", "Biology", "Chemistry")
  totalQuestions = 60
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:5000/api/practice/mock-session `
  -ContentType "application/json" `
  -Body $mock
```

### Open a JAMB past paper set by year

```powershell
$pastPaper = @{
  examType = "JAMB"
  year = "2024"
  subjects = @("Use of English", "Mathematics", "Biology", "Chemistry")
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:5000/api/practice/past-paper-session `
  -ContentType "application/json" `
  -Body $pastPaper
```

### Fetch practice analytics for a student

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:5000/api/practice/analytics `
  -Headers @{ Authorization = "Bearer $token" }
```

### Fetch streak and leaderboard data

```powershell
Invoke-RestMethod `
  -Uri http://127.0.0.1:5000/api/practice/streak `
  -Headers @{ Authorization = "Bearer $token" }

Invoke-RestMethod `
  -Uri http://127.0.0.1:5000/api/practice/leaderboard `
  -Headers @{ Authorization = "Bearer $token" }
```

## Security notes

- All write endpoints validate expected fields.
- Admin APIs require a valid token plus admin role.
- User tokens are signed and time-limited.
- Search and filtering use sanitized string matching rather than dynamic query execution.
- Uploaded images are restricted to image MIME types and size-limited on the backend.

## Future scalability notes

Placeholders for future product areas already exist in:

- `backend/src/services/future/subscriptionService.js`
- `backend/src/services/future/notificationService.js`
- `backend/src/services/future/advertisingService.js`
- `backend/src/services/future/scholarshipService.js`

This keeps the current codebase ready for premium reports, notifications, ads, and scholarship integrations without needing to rewrite the main app structure first.
