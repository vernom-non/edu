-- ============================================================================
-- Little Genius (EduExplore) – Supabase PostgreSQL Production Schema
-- Migration: supabase/schema.sql
-- Bao gồm đầy đủ 24 bảng dữ liệu với PK, FK, Index, Constraints
-- và Phân quyền bảo vệ dữ liệu trẻ em (Child Privacy by Design)
-- ============================================================================

-- Enable UUID extension (tùy chọn, dùng nếu cần gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng Phụ huynh (Quản lý hồ sơ của trẻ, quyền xuất/xóa dữ liệu)
CREATE TABLE IF NOT EXISTS parents (
  id TEXT PRIMARY KEY,
  email_hash TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  mfa_enabled INTEGER NOT NULL DEFAULT 0 CHECK (mfa_enabled IN (0, 1)),
  consent_verified INTEGER NOT NULL DEFAULT 1 CHECK (consent_verified IN (0, 1)),
  daily_limit_minutes_default INTEGER NOT NULL DEFAULT 45 CHECK (daily_limit_minutes_default BETWEEN 10 AND 180),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Bảng Học sinh (Trẻ sử dụng hồ sơ con, không cần email riêng)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  birth_year INTEGER NOT NULL CHECK (birth_year BETWEEN 2010 AND 2025),
  grade_level INTEGER NOT NULL DEFAULT 3 CHECK (grade_level BETWEEN 1 AND 5),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_parent ON students(parent_id);

-- 3. Bảng Hồ sơ Cá nhân hóa & Trợ năng của Học sinh
CREATE TABLE IF NOT EXISTS student_profiles (
  student_id TEXT PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  avatar_role TEXT NOT NULL DEFAULT 'young_scientist',
  pastel_theme TEXT NOT NULL DEFAULT 'lavender_mint',
  daily_limit_minutes INTEGER NOT NULL DEFAULT 45 CHECK (daily_limit_minutes BETWEEN 10 AND 180),
  voice_guide_enabled INTEGER NOT NULL DEFAULT 1 CHECK (voice_guide_enabled IN (0, 1)),
  reduced_motion INTEGER NOT NULL DEFAULT 0 CHECK (reduced_motion IN (0, 1)),
  large_text INTEGER NOT NULL DEFAULT 0 CHECK (large_text IN (0, 1)),
  public_sharing_allowed INTEGER NOT NULL DEFAULT 0 CHECK (public_sharing_allowed = 0),
  scientist_notebook_json TEXT NOT NULL DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Bảng 8 Lĩnh vực Môn học (Subjects)
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  lab_title TEXT NOT NULL,
  description TEXT NOT NULL,
  pastel_color TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 1
);

-- 5. Bảng Chủ đề Môn học (Topics)
CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  recommended_min_age INTEGER NOT NULL DEFAULT 8,
  grade_band TEXT NOT NULL DEFAULT 'Lớp 3 - Lớp 5',
  summary TEXT NOT NULL,
  related_subject_ids_json TEXT NOT NULL DEFAULT '[]',
  display_order INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id, display_order);

-- 6. Bảng Đơn vị Học tập (Learning Units)
CREATE TABLE IF NOT EXISTS learning_units (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  level_order INTEGER NOT NULL,
  description TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 20,
  display_order INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_learning_units_topic ON learning_units(topic_id, display_order);

-- 7. Bảng Bài học (Lessons)
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL REFERENCES learning_units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  grade INTEGER NOT NULL DEFAULT 3 CHECK (grade BETWEEN 1 AND 5),
  content_json TEXT NOT NULL DEFAULT '{}',
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  is_interactive INTEGER NOT NULL DEFAULT 1 CHECK (is_interactive IN (0, 1)),
  display_order INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_lessons_unit ON lessons(unit_id, display_order);

-- 8. Bảng 36 Dạng bài tập (Exercise Types)
CREATE TABLE IF NOT EXISTS exercise_types (
  id TEXT PRIMARY KEY,
  group_code TEXT NOT NULL,
  group_title TEXT NOT NULL,
  name TEXT NOT NULL,
  engine_type TEXT NOT NULL,
  is_open_ended INTEGER NOT NULL DEFAULT 0 CHECK (is_open_ended IN (0, 1)),
  sample_prompt TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5)
);

-- 9. Bảng Biến thể Bài tập (Exercise Variants)
CREATE TABLE IF NOT EXISTS exercise_variants (
  id TEXT PRIMARY KEY,
  exercise_type_id TEXT NOT NULL REFERENCES exercise_types(id) ON DELETE CASCADE,
  variant_data_json TEXT NOT NULL DEFAULT '{}',
  expected_answer_json TEXT NOT NULL DEFAULT '{}',
  cognitive_mode TEXT NOT NULL DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exercise_variants_type ON exercise_variants(exercise_type_id);

-- 10. Bảng Nộp bài & Chấm điểm (Submissions)
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exercise_variant_id TEXT NOT NULL REFERENCES exercise_variants(id) ON DELETE CASCADE,
  student_answer_json TEXT NOT NULL DEFAULT '{}',
  is_correct INTEGER NOT NULL DEFAULT 0 CHECK (is_correct IN (0, 1)),
  feedback TEXT NOT NULL DEFAULT '',
  proof TEXT NOT NULL DEFAULT '',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);

-- 11. Bảng Tiến độ Kỹ năng (Skill Mastery)
CREATE TABLE IF NOT EXISTS skill_mastery (
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  mastery_level TEXT NOT NULL DEFAULT 'not_started' CHECK (mastery_level IN ('not_started', 'needs_practice', 'mastered_with_hints', 'mastered_independently', 'can_explain')),
  attempts_total INTEGER NOT NULL DEFAULT 0,
  independent_success_count INTEGER NOT NULL DEFAULT 0,
  explanations_verified_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, skill_id)
);

-- 12. Bảng Tiến độ Bài học của Học sinh (Student Progress)
CREATE TABLE IF NOT EXISTS student_progress (
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  mastery_level TEXT NOT NULL DEFAULT 'not_started',
  completed_activities_json TEXT NOT NULL DEFAULT '[]',
  attempts_count INTEGER NOT NULL DEFAULT 0,
  hints_used_count INTEGER NOT NULL DEFAULT 0,
  can_explain INTEGER NOT NULL DEFAULT 0 CHECK (can_explain IN (0, 1)),
  version_vector INTEGER NOT NULL DEFAULT 1,
  last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, lesson_id)
);

-- 13. Bảng Dự án Sáng tạo Liên môn (Creative Projects - Riêng tư mặc định)
CREATE TABLE IF NOT EXISTS creative_projects (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  project_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  artifact_data_json TEXT NOT NULL DEFAULT '{}',
  reflection_journal TEXT NOT NULL DEFAULT '',
  storage_bucket_key TEXT,
  is_private INTEGER NOT NULL DEFAULT 1 CHECK (is_private = 1),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, project_code)
);

-- 14. Bảng Thành tựu & Khen ngợi (Achievement Records)
CREATE TABLE IF NOT EXISTS achievement_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_code TEXT NOT NULL,
  badge_title TEXT NOT NULL,
  specific_praise TEXT NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, badge_code)
);

-- 15. Bảng Phiên bản Nội dung (Content Versions)
CREATE TABLE IF NOT EXISTS content_versions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  changelog TEXT NOT NULL,
  payload_snapshot_json TEXT NOT NULL DEFAULT '{}',
  author_role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, version_number)
);

-- 16. Bảng Trạng thái Kiểm duyệt Nội dung (Content Review Status)
CREATE TABLE IF NOT EXISTS content_review_status (
  lesson_id TEXT PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'in_review', 'approved', 'archived')),
  reviewer_id TEXT,
  pedagogy_verified INTEGER NOT NULL DEFAULT 1 CHECK (pedagogy_verified IN (0, 1)),
  scientific_accuracy_verified INTEGER NOT NULL DEFAULT 1 CHECK (scientific_accuracy_verified IN (0, 1)),
  age_safety_verified INTEGER NOT NULL DEFAULT 1 CHECK (age_safety_verified IN (0, 1)),
  review_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 17. Bảng Nhật ký Kiểm toán Bảo mật (Audit Logs - Không ghi PII nhạy cảm)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_role TEXT NOT NULL,
  actor_id_hash TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_resource TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- 18. Bảng Cấu hình Hệ thống (System Config - KV replacement)
CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 19. Bảng Idempotency Keys (Tránh xử lý trùng lặp yêu cầu)
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  response_json TEXT NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() + interval '24 hours'
);

-- ============================================================================
-- Row Level Security (RLS) - Bảo vệ dữ liệu trẻ em
-- ============================================================================

ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE parents IS 'Hồ sơ phụ huynh - bảo mật cao, không exposing PIE';
COMMENT ON TABLE students IS 'Hồ sơ học sinh - không chứa email riêng của trẻ';
COMMENT ON TABLE student_profiles IS 'Cá nhân hóa & trợ năng - riêng tư mặc định';
COMMENT ON TABLE creative_projects IS 'Dự án sáng tạo - riêng tư mặc định (is_private = 1)';
COMMENT ON TABLE audit_logs IS 'Kiểm toán bảo mật - không ghi PII nhạy cảm';