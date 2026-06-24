import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Stream = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
};

export type Course = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  stream_id: string | null;
  duration_years: number | null;
  level: string;
  avg_fees: number | null;
  career_prospects: string | null;
  skills_gained: string[] | null;
};

export type College = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  city: string | null;
  state: string | null;
  type: string | null;
  established_year: number | null;
  rating: number;
  total_reviews: number;
  website_url: string | null;
  image_url: string | null;
};

export type CollegeCourse = {
  id: string;
  college_id: string;
  course_id: string;
  annual_fees: number | null;
  eligibility: string | null;
  seats: number | null;
};

export type CareerPath = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  avg_salary: number | null;
  growth_outlook: string | null;
  recommended_courses: string[] | null;
  skills_required: string[] | null;
  industries: string[] | null;
};

export type Review = {
  id: string;
  college_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  created_at: string;
};
