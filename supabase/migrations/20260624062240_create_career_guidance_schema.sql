-- Streams (e.g., Science, Commerce, Arts, Engineering, Medical)
CREATE TABLE streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Courses (e.g., B.Tech Computer Science, B.Com, B.A. Psychology)
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  stream_id uuid REFERENCES streams(id) ON DELETE SET NULL,
  duration_years numeric,
  level text NOT NULL DEFAULT 'UG', -- UG, PG, Diploma
  avg_fees numeric,
  career_prospects text,
  skills_gained text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Colleges
CREATE TABLE colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  city text,
  state text,
  type text, -- Public, Private, Deemed
  established_year int,
  rating numeric DEFAULT 0,
  total_reviews int DEFAULT 0,
  website_url text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- College-Course mapping (many-to-many with fees per college-course)
CREATE TABLE college_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  annual_fees numeric,
  eligibility text,
  seats int,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (college_id, course_id)
);

-- Career Paths (e.g., Software Engineer, Chartered Accountant, Doctor)
CREATE TABLE career_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  avg_salary numeric,
  growth_outlook text, -- High, Medium, Low
  recommended_courses uuid[] DEFAULT '{}', -- course ids
  skills_required text[],
  industries text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Reviews (authenticated users can review colleges)
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (college_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read policies (catalog data is public)
CREATE POLICY "read_streams" ON streams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_courses" ON courses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_colleges" ON colleges FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_college_courses" ON college_courses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_career_paths" ON career_paths FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);

-- Reviews: authenticated users can insert/update/delete their own
CREATE POLICY "insert_own_review" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_review" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_review" ON reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_courses_stream ON courses(stream_id);
CREATE INDEX idx_college_courses_college ON college_courses(college_id);
CREATE INDEX idx_college_courses_course ON college_courses(course_id);
CREATE INDEX idx_reviews_college ON reviews(college_id);
