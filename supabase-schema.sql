-- Supabase database schema for Student Career Guide
-- Run this in your Supabase SQL editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create practice_questions table
CREATE TABLE IF NOT EXISTS practice_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create user_practice_sessions table
CREATE TABLE IF NOT EXISTS user_practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES practice_questions(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_practice_questions_category ON practice_questions(category);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_practice_sessions_user ON user_practice_sessions(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_practice_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for articles table
CREATE POLICY "Anyone can view articles" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their articles" ON articles
  FOR UPDATE USING (auth.uid() = author_id);

-- Create policies for courses table
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

-- Create policies for practice_questions table
CREATE POLICY "Anyone can view practice questions" ON practice_questions
  FOR SELECT USING (true);

-- Create policies for user_progress table
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for user_practice_sessions table
CREATE POLICY "Users can view their own practice sessions" ON user_practice_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own practice sessions" ON user_practice_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert some sample data
INSERT INTO courses (title, description, category, duration, level) VALUES
('Introduction to Computer Science', 'Learn the fundamentals of computer science and programming', 'technology', '8 weeks', 'beginner'),
('Data Structures and Algorithms', 'Master essential data structures and algorithms', 'technology', '12 weeks', 'intermediate'),
('Web Development Fundamentals', 'Build modern web applications', 'technology', '10 weeks', 'beginner'),
('Career Planning for Students', 'Develop a strategic career plan', 'career', '6 weeks', 'beginner'),
('Interview Preparation', 'Ace your job interviews', 'career', '4 weeks', 'intermediate')
ON CONFLICT DO NOTHING;

INSERT INTO practice_questions (question, options, correct_answer, explanation, category, difficulty) VALUES
('What is the time complexity of binary search?', '["O(1)", "O(log n)", "O(n)", "O(n²)"]', 'O(log n)', 'Binary search divides the search space in half each time, resulting in logarithmic time complexity.', 'algorithms', 'medium'),
('Which data structure follows LIFO principle?', '["Queue", "Stack", "Array", "Linked List"]', 'Stack', 'Stack follows Last In First Out (LIFO) principle.', 'data-structures', 'easy'),
('What does HTML stand for?', '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"]', 'Hyper Text Markup Language', 'HTML stands for Hyper Text Markup Language.', 'web-development', 'easy')
ON CONFLICT DO NOTHING;