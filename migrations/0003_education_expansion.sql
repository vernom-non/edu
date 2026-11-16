-- Versioned foundation lessons. Existing lab IDs and their progress remain independent.
CREATE TABLE IF NOT EXISTS foundation_lessons (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 3 AND 5)
);

CREATE TABLE IF NOT EXISTS foundation_lesson_versions (
  lesson_id TEXT NOT NULL REFERENCES foundation_lessons(id) ON DELETE CASCADE,
  revision INTEGER NOT NULL CHECK (revision > 0),
  status TEXT NOT NULL CHECK (status IN ('draft', 'ready_for_review', 'verified', 'published')),
  objective TEXT NOT NULL,
  -- Structured concept, rule, examples, activities, hints and creative criteria.
  content_json TEXT NOT NULL CHECK (json_valid(content_json) AND json_type(content_json) = 'object'),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (lesson_id, revision)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_foundation_single_published
  ON foundation_lesson_versions (lesson_id) WHERE status = 'published';

CREATE TABLE IF NOT EXISTS foundation_notebook (
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES foundation_lessons(id) ON DELETE CASCADE,
  learned INTEGER NOT NULL DEFAULT 0 CHECK (learned IN (0, 1)),
  favorite INTEGER NOT NULL DEFAULT 0 CHECK (favorite IN (0, 1)),
  review_items_json TEXT NOT NULL DEFAULT '[]'
    CHECK (json_valid(review_items_json) AND json_type(review_items_json) = 'array'),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (student_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS foundation_attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  activity_id TEXT NOT NULL,
  is_correct INTEGER NOT NULL CHECK (is_correct IN (0, 1)),
  hints_used INTEGER NOT NULL DEFAULT 0 CHECK (hints_used BETWEEN 0 AND 4),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (lesson_id, revision) REFERENCES foundation_lesson_versions(lesson_id, revision)
);

CREATE INDEX IF NOT EXISTS idx_foundation_attempts_student_lesson
  ON foundation_attempts (student_id, lesson_id, created_at);
