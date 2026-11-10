// ============================================================================
// Little Genius – Focused Learning: Danh mục 5 môn × 8 chủ đề × 3 bài (120 bài)
// ============================================================================

import type { FocusLesson, FocusSubjectId, FocusSubjectMeta, FocusTopic } from './types.ts';
import { MATH_LESSONS, MATH_TOPICS } from './content/math.ts';
import { VIETNAMESE_LESSONS, VIETNAMESE_TOPICS } from './content/vietnamese.ts';
import { ENGLISH_LESSONS, ENGLISH_TOPICS } from './content/english.ts';
import { SCIENCE_LESSONS, SCIENCE_TOPICS } from './content/science.ts';
import { LOGIC_LESSONS, LOGIC_TOPICS } from './content/logic.ts';

export const FOCUS_SUBJECTS: FocusSubjectMeta[] = [
  { id: 'math', name: 'Toán học', icon: '🔢', color: '#7C5CFC', soft: '#F3EFFE', border: '#D8CBF8' },
  { id: 'vietnamese', name: 'Tiếng Việt', icon: '📖', color: '#D9488F', soft: '#FDF2F7', border: '#F5B8D1' },
  { id: 'english', name: 'Tiếng Anh', icon: '🌍', color: '#2F9E7E', soft: '#EFFAF6', border: '#A7DCCB' },
  { id: 'science', name: 'Khoa học', icon: '🔬', color: '#2B7BB9', soft: '#EEF6FC', border: '#B9DAF2' },
  { id: 'logic', name: 'Câu đố & Logic', icon: '🧩', color: '#B7791F', soft: '#FFF8E8', border: '#F6DFA4' },
];

export const FOCUS_TOPICS: FocusTopic[] = [
  ...MATH_TOPICS,
  ...VIETNAMESE_TOPICS,
  ...ENGLISH_TOPICS,
  ...SCIENCE_TOPICS,
  ...LOGIC_TOPICS,
];

export const FOCUS_LESSONS: FocusLesson[] = [
  ...MATH_LESSONS,
  ...VIETNAMESE_LESSONS,
  ...ENGLISH_LESSONS,
  ...SCIENCE_LESSONS,
  ...LOGIC_LESSONS,
];

const LESSON_INDEX = new Map(FOCUS_LESSONS.map((l) => [l.id, l]));

export function getFocusLesson(id: string): FocusLesson | undefined {
  return LESSON_INDEX.get(id);
}

export function getSubjectMeta(id: FocusSubjectId): FocusSubjectMeta {
  return FOCUS_SUBJECTS.find((s) => s.id === id) ?? FOCUS_SUBJECTS[0];
}

export function topicsOf(subject: FocusSubjectId): FocusTopic[] {
  return FOCUS_TOPICS.filter((t) => t.subject === subject).sort((a, b) => a.order - b.order);
}

/** Thứ tự học đề xuất của các bài đã hoàn chỉnh trong một môn (theo chủ đề, rồi theo bài) */
export function readyLessonsOf(subject: FocusSubjectId): FocusLesson[] {
  const order: string[] = topicsOf(subject).flatMap((t) => t.lessons.map((p) => p.id));
  return FOCUS_LESSONS.filter((l) => l.subject === subject).sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
  );
}

export interface CurriculumStats {
  subject: FocusSubjectId;
  topics: number;
  plannedLessons: number;
  readyLessons: number;
  tasks: number;
}

export function curriculumStats(): CurriculumStats[] {
  return FOCUS_SUBJECTS.map((s) => {
    const ready = FOCUS_LESSONS.filter((l) => l.subject === s.id);
    return {
      subject: s.id,
      topics: topicsOf(s.id).length,
      plannedLessons: topicsOf(s.id).reduce((n, t) => n + t.lessons.length, 0),
      readyLessons: ready.length,
      tasks: ready.reduce((n, l) => n + l.tasks.length, 0),
    };
  });
}
