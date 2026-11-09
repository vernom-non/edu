-- ============================================================================
-- EduExplore – Học bằng khám phá
-- PostgreSQL Database Schema (Chương trình GDPT Việt Nam Cấp Tiểu học Lớp 1 - 5)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Phân quyền người dùng (Role-Based Access Control)
CREATE TYPE user_role AS ENUM ('student', 'parent', 'teacher', 'admin');

-- 2. Trạng thái kiểm duyệt nội dung bài học
CREATE TYPE content_status AS ENUM ('draft', 'in_review', 'approved', 'archived');

-- 3. Mức độ làm chủ kiến thức (Không chỉ dựa trên % đúng/sai)
CREATE TYPE mastery_level AS ENUM (
  'not_started',
  'needs_practice',          -- Còn nhầm lẫn, cần thao tác trực quan thêm
  'mastered_with_hints',     -- Làm đúng nhưng cần gợi ý từ Trợ giảng
  'mastered_independently',  -- Tự giải quyết đúng không cần gợi ý
  'can_explain'              -- Hiểu sâu bản chất và giải thích được vì sao đúng
);

-- Bảng Người dùng (Bảo mật dữ liệu trẻ em: không thu thập dữ liệu nhạy cảm thừa)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role user_role NOT NULL DEFAULT 'student',
  display_name VARCHAR(100) NOT NULL,
  grade_level SMALLINT CHECK (grade_level BETWEEN 1 AND 5),
  parent_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  daily_time_limit_minutes SMALLINT NOT NULL DEFAULT 45,
  prefer_voice_guide BOOLEAN NOT NULL DEFAULT TRUE,
  prefer_reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
  prefer_large_text BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bảng Khung chương trình (Curriculum)
CREATE TABLE curriculums (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  country VARCHAR(50) NOT NULL DEFAULT 'VN',
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Bảng Khối lớp (Grade: Lớp 1 -> Lớp 5)
CREATE TABLE grades (
  id SMALLINT PRIMARY KEY CHECK (id BETWEEN 1 AND 5),
  curriculum_id VARCHAR(50) NOT NULL REFERENCES curriculums(id),
  name VARCHAR(50) NOT NULL,
  age_range VARCHAR(30) NOT NULL,
  summary TEXT NOT NULL
);

-- Bảng Môn học (Subject)
CREATE TABLE subjects (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  lab_title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  theme_color VARCHAR(30) NOT NULL
);

-- Bảng Chủ đề kiến thức (Topic)
CREATE TABLE topics (
  id VARCHAR(80) PRIMARY KEY,
  subject_id VARCHAR(50) NOT NULL REFERENCES subjects(id),
  grade_id SMALLINT NOT NULL REFERENCES grades(id),
  title VARCHAR(200) NOT NULL,
  summary TEXT NOT NULL,
  display_order SMALLINT NOT NULL DEFAULT 1
);

-- Bảng Bài học tương tác (Lesson) - Tách biệt nội dung khỏi giao diện
CREATE TABLE lessons (
  id VARCHAR(100) PRIMARY KEY,
  topic_id VARCHAR(80) NOT NULL REFERENCES topics(id),
  grade_id SMALLINT NOT NULL REFERENCES grades(id),
  subject_id VARCHAR(50) NOT NULL REFERENCES subjects(id),
  slug VARCHAR(120) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  subtitle TEXT NOT NULL,
  simulation_type VARCHAR(80) NOT NULL,
  estimated_minutes SMALLINT NOT NULL DEFAULT 15,
  difficulty SMALLINT NOT NULL CHECK (difficulty BETWEEN 1 AND 3),
  version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  status content_status NOT NULL DEFAULT 'approved',
  prerequisite_lesson_id VARCHAR(100) REFERENCES lessons(id),
  scientific_note TEXT NOT NULL,
  model_simplification_note TEXT NOT NULL,
  lesson_payload JSONB NOT NULL,
  created_by UUID REFERENCES users(id),
  reviewed_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bảng Mục tiêu đầu ra (Learning Outcomes)
CREATE TABLE learning_outcomes (
  id VARCHAR(100) PRIMARY KEY,
  lesson_id VARCHAR(100) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  bloom_stage VARCHAR(40) NOT NULL -- Quan sát, Tương tác, Suy luận, Thử nghiệm, Hiểu bản chất, Vận dụng, Sáng tạo
);

-- Bảng Hoạt động tương tác & Câu hỏi kiểm tra trong bài học
CREATE TABLE interactive_activities (
  id VARCHAR(100) PRIMARY KEY,
  lesson_id VARCHAR(100) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  step_order SMALLINT NOT NULL,
  pedagogy_stage VARCHAR(40) NOT NULL,
  prompt TEXT NOT NULL,
  validator_type VARCHAR(60) NOT NULL,
  validator_config JSONB NOT NULL,
  socratic_hints JSONB NOT NULL,
  core_explanation TEXT NOT NULL
);

-- Bảng Hồ sơ tiến độ học tập cá nhân hóa
CREATE TABLE student_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(100) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  mastery mastery_level NOT NULL DEFAULT 'not_started',
  attempts_count INTEGER NOT NULL DEFAULT 0,
  correct_without_hints INTEGER NOT NULL DEFAULT 0,
  hints_used_count INTEGER NOT NULL DEFAULT 0,
  explanation_submitted TEXT,
  common_misconceptions JSONB NOT NULL DEFAULT '[]'::jsonb,
  simulation_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- Chỉ mục tối ưu truy vấn
CREATE INDEX idx_lessons_grade_subject ON lessons(grade_id, subject_id, status);
CREATE INDEX idx_progress_student ON student_lesson_progress(student_id, mastery);
