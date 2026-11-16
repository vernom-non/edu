import { KNOWLEDGE_CARDS } from '../knowledge/catalog.ts';
import { recordReflection } from '../knowledge/notebook.ts';
import type { KnowledgeProgress, KnowledgeRecord } from '../knowledge/types.ts';
import type { TaskStage } from '../types.ts';
import type { Activity } from './activities.ts';
import { firstWave } from './content.ts';

export type LessonStatus = 'draft' | 'ready_for_review' | 'verified' | 'published';

const cards = new Map(KNOWLEDGE_CARDS.map((card) => [card.id, card]));
const stages: readonly TaskStage[] = ['warmup', 'practice', 'advanced'];

export const EXPANDED_LESSONS = firstWave.map(({ cardId, grade, objective, criteria, activities }) => {
  const card = cards.get(cardId);
  if (!card) throw new Error(`Missing theory card ${cardId}`);
  const status: LessonStatus = 'verified';
  const tasks: Activity[] = activities.map(({ hint, ...task }, index) => ({
    ...task,
    id: `${cardId}-activity-${index + 1}`,
    stage: stages[index],
    skill: cardId,
    hints: [hint, card.why, card.examples[0].steps[0], card.scenes[0].explanation],
  }));
  return { id: cardId, grade, objective, criteria, status, card, tasks };
});

export type ExpandedLesson = (typeof EXPANDED_LESSONS)[number];

export function isStudentVisible(status: LessonStatus) {
  return status === 'verified' || status === 'published';
}

const visibleLessons = new Map(EXPANDED_LESSONS.filter(({ status }) => isStudentVisible(status)).map((item) => [item.id, item]));
export function expandedLesson(cardId: string): ExpandedLesson | undefined {
  return visibleLessons.get(cardId);
}

export function learningPath(subject: string | null, grade: string | null) {
  return [...visibleLessons.values()]
    .filter((lesson) => (!subject || lesson.card.subject === subject) && (!grade || String(lesson.grade) === grade))
    .map(({ id, grade, objective, status, card, tasks }) => ({
      id, grade, objective, status, subject: card.subject, topic: card.topic, title: card.title,
      activityCount: tasks.length + card.practice.length + 1,
    }));
}

export function recordActivity(record: KnowledgeRecord, id: string, correct: boolean): KnowledgeRecord {
  return {
    ...recordReflection(record, id, !correct),
    activityResults: { ...record.activityResults, [id]: correct },
  };
}

export function recommendedTask(lesson: ExpandedLesson, record: KnowledgeRecord) {
  const results = record.activityResults;
  const retry = lesson.tasks.findIndex((task) => results?.[task.id] === false);
  if (retry !== -1) return Math.max(0, retry - 1);
  return Math.max(0, lesson.tasks.findIndex((task) => results?.[task.id] !== true));
}

export function quickReview(progress: KnowledgeProgress, filter: (cardId: string) => boolean) {
  const entries = Object.entries(progress).filter(([id, record]) =>
    cards.has(id) && filter(id) && (record.learned || record.reviewItems?.length));
  const next = entries.find(([, record]) => record.reviewItems?.length) ?? entries[0];
  return next ? cards.get(next[0]) : undefined;
}
