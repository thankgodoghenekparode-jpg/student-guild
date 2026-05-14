import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Database types (you can generate these from your Supabase project)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          institution_type: string
          category: string
          summary: string
          overview: string
          cutoff_mark: number
          required_subjects: string[]
          jamb_combination: string
          careers: string[]
          side_skills: string[]
          tags: string[]
          strengths: string[]
          interests: string[]
          work_styles: string[]
          goals: string[]
          study_preferences: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          institution_type: string
          category: string
          summary: string
          overview: string
          cutoff_mark?: number
          required_subjects?: string[]
          jamb_combination: string
          careers?: string[]
          side_skills?: string[]
          tags?: string[]
          strengths?: string[]
          interests?: string[]
          work_styles?: string[]
          goals?: string[]
          study_preferences?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          institution_type?: string
          category?: string
          summary?: string
          overview?: string
          cutoff_mark?: number
          required_subjects?: string[]
          jamb_combination?: string
          careers?: string[]
          side_skills?: string[]
          tags?: string[]
          strengths?: string[]
          interests?: string[]
          work_styles?: string[]
          goals?: string[]
          study_preferences?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          category: string
          content: string
          excerpt: string
          tags: string[]
          image_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          content: string
          excerpt: string
          tags?: string[]
          image_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          content?: string
          excerpt?: string
          tags?: string[]
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      practice_questions: {
        Row: {
          id: string
          subject: string
          question: string
          options: string[]
          correct_answer: number
          explanation: string
          year?: number
          exam_type: string
          difficulty: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject: string
          question: string
          options: string[]
          correct_answer: number
          explanation: string
          year?: number
          exam_type: string
          difficulty: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject?: string
          question?: string
          options?: string[]
          correct_answer?: number
          explanation?: string
          year?: number
          exam_type?: string
          difficulty?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      practice_attempts: {
        Row: {
          id: string
          user_id: string
          question_id: string
          selected_answer: number
          is_correct: boolean
          time_spent: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          selected_answer: number
          is_correct: boolean
          time_spent: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          selected_answer?: number
          is_correct?: boolean
          time_spent?: number
          created_at?: string
        }
      }
      saved_courses: {
        Row: {
          id: string
          user_id: string
          course_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}