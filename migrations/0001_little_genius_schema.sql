-- ============================================================================
-- Little Genius (EduExplore) – Cloudflare D1 (SQLite) Production Schema
-- Migration: 0001_little_genius_schema.sql
-- Bao gồm đầy đủ 24 bảng dữ liệu với PK, FK, Index, Constraints, Idempotency
-- và Phân quyền bảo vệ dữ liệu trẻ em (Child Privacy by Design)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Bảng Phụ huynh (Quản lý hồ sơ của trẻ, quyền xuất/xóa dữ liệu)
CREATE TABLE IF NOT EXISTS parents (
  id TEXT PRIMARY KEY,
  email_hash TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  mfa_enabled INTEGER NOT NULL DEFAULT 0 CHECK (mfa_enabled IN (0, 1)),
  consent_verified INTEGER NOT NULL DEFAULT 1 CHECK (consent_verified IN (0, 1)),
  daily_limit_minutes_default INTEGER NOT NULL DEFAULT 45 CHECK (daily_limit_minutes_default BETWEEN 10 AND 180),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Bảng Học sinh (Trẻ sử dụng hồ sơ con, không cần email riêng)
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  birth_year INTEGER NOT NULL CHECK (birth_year BETWEEN 2010 AND 2025),
  grade_level INTEGER NOT NULL DEFAULT 3 CHECK (grade_level BETWEEN 1 AND 5),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
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
  public_sharing_allowed INTEGER NOT NULL DEFAULT 0 CHECK (public_sharing_allowed = 0), -- Mặc định luôn riêng tư
  scientist_notebook_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
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

-- 5. Bảng Chủ đề Môn học (Topics - Ít nhất 2 chủ đề mỗi môn)
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
  level_order INTEGER NOT NULL DEFAULT 1,
  overview TEXT NOT NULL
);

-- 7. Bảng Bài học (Lessons - Tách nội dung khỏi React components)
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL REFERENCES learning_units(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  min_age INTEGER NOT NULL DEFAULT 8,
  grade_level INTEGER NOT NULL DEFAULT 3 CHECK (grade_level BETWEEN 1 AND 5),
  difficulty INTEGER NOT NULL DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
  estimated_minutes INTEGER NOT NULL DEFAULT 15,
  prerequisite_summary TEXT NOT NULL,
  explanation_text TEXT NOT NULL,
  scientific_fact_note TEXT NOT NULL,
  model_simplification_note TEXT NOT NULL,
  simulation_type TEXT NOT NULL,
  evaluation_criteria TEXT NOT NULL,
  related_knowledge_json TEXT NOT NULL DEFAULT '[]',
  current_version TEXT NOT NULL DEFAULT '1.0.0',
  review_status TEXT NOT NULL DEFAULT 'approved' CHECK (review_status IN ('draft', 'in_review', 'approved', 'archived')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lessons_subject_topic ON lessons(subject_id, topic_id, review_status);

-- 8. Bảng Mục tiêu Bài học (Learning Objectives)
CREATE TABLE IF NOT EXISTS learning_objectives (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  cognitive_stage TEXT NOT NULL
);

-- 9. Bảng Kỹ năng (Skills)
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty_tier INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_tier BETWEEN 1 AND 5)
);

-- 10. Bảng Điều kiện Tiên quyết Kỹ năng (Skill Prerequisites - Knowledge Graph)
CREATE TABLE IF NOT EXISTS skill_prerequisites (
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  prerequisite_skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (skill_id, prerequisite_skill_id),
  CHECK (skill_id != prerequisite_skill_id)
);

-- 11. Bảng Khuôn mẫu Hoạt động Tương tác (Activity Templates - 36 dạng bài tập)
CREATE TABLE IF NOT EXISTS activity_templates (
  id TEXT PRIMARY KEY,
  group_code TEXT NOT NULL,
  sub_type_number INTEGER NOT NULL UNIQUE CHECK (sub_type_number BETWEEN 1 AND 36),
  name TEXT NOT NULL,
  interaction_engine TEXT NOT NULL,
  supports_open_ended INTEGER NOT NULL DEFAULT 0 CHECK (supports_open_ended IN (0, 1)),
  schema_config_json TEXT NOT NULL DEFAULT '{}'
);

-- 12. Bảng Hoạt động Thực hành trong Bài học (Activities)
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES activity_templates(id),
  activity_tier TEXT NOT NULL CHECK (activity_tier IN ('basic', 'applied', 'reasoning', 'creative')),
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  config_json TEXT NOT NULL,
  step_order INTEGER NOT NULL DEFAULT 1
);

-- 13. Bảng Ngân hàng Câu hỏi & Bài tập Tham số (Question Bank)
CREATE TABLE IF NOT EXISTS question_bank (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES activity_templates(id),
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 3),
  context_theme TEXT NOT NULL,
  parameter_schema_json TEXT NOT NULL,
  hints_json TEXT NOT NULL,
  explanation_template TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_question_bank_lesson_skill ON question_bank(lesson_id, skill_id);

-- 14. Bảng Biến thể Bài tập Sinh có Kiểm soát (Question Variants)
CREATE TABLE IF NOT EXISTS question_variants (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
  variant_code TEXT NOT NULL,
  cognitive_mode TEXT NOT NULL,
  parameters_json TEXT NOT NULL,
  expected_solution_json TEXT NOT NULL,
  verified_solvable INTEGER NOT NULL DEFAULT 1 CHECK (verified_solvable = 1),
  UNIQUE(question_id, variant_code)
);

-- 15. Bảng Đáp án & Quy tắc Chấm (Answers)
CREATE TABLE IF NOT EXISTS answers (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
  validator_type TEXT NOT NULL,
  deterministic_rule_json TEXT NOT NULL,
  accept_multiple_expressions INTEGER NOT NULL DEFAULT 0 CHECK (accept_multiple_expressions IN (0, 1))
);

-- 16. Bảng Lượt Làm Bài của Học sinh (Attempts - Có Idempotency Key chống ghi trùng)
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT UNIQUE NOT NULL,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_id TEXT,
  is_correct INTEGER NOT NULL CHECK (is_correct IN (0, 1)),
  attempt_number INTEGER NOT NULL DEFAULT 1,
  hints_used INTEGER NOT NULL DEFAULT 0,
  can_explain_verified INTEGER NOT NULL DEFAULT 0 CHECK (can_explain_verified IN (0, 1)),
  submitted_payload_json TEXT NOT NULL,
  diagnostic_code TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_attempts_student_lesson ON attempts(student_id, lesson_id);

-- 17. Bảng Phiên Học Tập (Learning Sessions)
CREATE TABLE IF NOT EXISTS learning_sessions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  synced_from_offline INTEGER NOT NULL DEFAULT 0 CHECK (synced_from_offline IN (0, 1))
);

-- 18. Bảng Mức độ Thành thạo Kỹ năng (Skill Mastery - Adaptive Learning)
CREATE TABLE IF NOT EXISTS skill_mastery (
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  mastery_state TEXT NOT NULL DEFAULT 'not_started' CHECK (
    mastery_state IN ('not_started', 'exploring', 'practicing', 'mastered_with_hints', 'mastered_independently', 'can_explain')
  ),
  attempts_total INTEGER NOT NULL DEFAULT 0,
  independent_success_count INTEGER NOT NULL DEFAULT 0,
  explanations_verified_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (student_id, skill_id)
);

-- 19. Bảng Tiến độ Bài học của Học sinh (Student Progress - Hỗ trợ đồng bộ đa thiết bị)
CREATE TABLE IF NOT EXISTS student_progress (
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  mastery_level TEXT NOT NULL DEFAULT 'not_started',
  completed_activities_json TEXT NOT NULL DEFAULT '[]',
  attempts_count INTEGER NOT NULL DEFAULT 0,
  hints_used_count INTEGER NOT NULL DEFAULT 0,
  can_explain INTEGER NOT NULL DEFAULT 0 CHECK (can_explain IN (0, 1)),
  version_vector INTEGER NOT NULL DEFAULT 1,
  last_updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (student_id, lesson_id)
);

-- 20. Bảng Dự án Sáng tạo Liên môn (Creative Projects - Riêng tư mặc định)
CREATE TABLE IF NOT EXISTS creative_projects (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  project_code TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  artifact_data_json TEXT NOT NULL,
  reflection_journal TEXT NOT NULL DEFAULT '',
  r2_media_key TEXT,
  is_private INTEGER NOT NULL DEFAULT 1 CHECK (is_private = 1),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(student_id, project_code)
);

-- 21. Bảng Thành tựu & Khen ngợi Lành mạnh (Achievement Records)
CREATE TABLE IF NOT EXISTS achievement_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  badge_code TEXT NOT NULL,
  badge_title TEXT NOT NULL,
  specific_praise TEXT NOT NULL,
  awarded_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(student_id, badge_code)
);

-- 22. Bảng Phiên bản Nội dung (Content Versions)
CREATE TABLE IF NOT EXISTS content_versions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL,
  changelog TEXT NOT NULL,
  payload_snapshot_json TEXT NOT NULL,
  author_role TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(lesson_id, version_number)
);

-- 23. Bảng Trạng thái Kiểm duyệt Nội dung (Content Review Status)
CREATE TABLE IF NOT EXISTS content_review_status (
  lesson_id TEXT PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'in_review', 'approved', 'archived')),
  reviewer_id TEXT,
  pedagogy_verified INTEGER NOT NULL DEFAULT 1 CHECK (pedagogy_verified IN (0, 1)),
  scientific_accuracy_verified INTEGER NOT NULL DEFAULT 1 CHECK (scientific_accuracy_verified IN (0, 1)),
  age_safety_verified INTEGER NOT NULL DEFAULT 1 CHECK (age_safety_verified IN (0, 1)),
  review_notes TEXT,
  reviewed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 24. Bảng Nhật ký Kiểm toán Bảo mật (Audit Logs - Không ghi PII nhạy cảm)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_role TEXT NOT NULL,
  actor_id_hash TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_resource TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
