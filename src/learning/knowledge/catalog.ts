import type { SubjectId } from '../../types/education.ts';
import type { FocusSubjectId } from '../types.ts';
import { mathCards } from './math.ts';
import { vietnameseCards } from './vietnamese.ts';
import { englishCards } from './english.ts';
import { scienceCards } from './science.ts';
import { logicCards } from './logic.ts';

export const KNOWLEDGE_CARDS = [
  ...mathCards,
  ...vietnameseCards,
  ...englishCards,
  ...scienceCards,
  ...logicCards,
];

export function knowledgeSubject(subject: SubjectId): FocusSubjectId | undefined {
  switch (subject) {
    case 'math':
    case 'vietnamese':
    case 'english':
    case 'science':
      return subject;
    case 'logic_lifeskills_finance':
      return 'logic';
  }
}

export function knowledgeForLesson(lessonId: string) {
  return KNOWLEDGE_CARDS.filter((card) => card.lessonId === lessonId);
}

export const PRACTICE_LEVELS = [
  'Dễ · Ghi nhớ',
  'Trung bình · Hiểu và giải thích',
  'Thử thách · Tìm lỗi',
  'Vận dụng · Tình huống mới',
  'Sáng tạo · Tự nghĩ cách',
] as const;
