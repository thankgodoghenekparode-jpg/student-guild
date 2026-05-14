import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

// Database schema information (for reference)
// Tables: users, articles, courses, practice_questions, user_progress, user_practice_sessions