import type { AudioClip, FocusTask } from '../types.ts';

type ActivityKind = 'number_input' | 'fill_blank' | 'multiple_choice' | 'multiple_select' | 'order'
  | 'matching' | 'drag_drop' | 'find_mistake' | 'step_reasoning' | 'pattern' | 'evidence'
  | 'experiment' | 'logic_grid' | 'maze' | 'geometry' | 'fraction' | 'creative_construction';
export type Activity = Extract<FocusTask, { kind: ActivityKind }>;

type ActivityMetadata = 'id' | 'stage' | 'skill' | 'hints' | 'twin';
type ActivityBody<T = Activity> = T extends Activity ? Omit<T, ActivityMetadata> : never;
export type ActivityInput = ActivityBody & { hint: string };

export function number(prompt: string, answer: number, expr: string, hint: string, explanation: string, unit?: string): ActivityInput {
  return { kind: 'number_input', prompt, answer, expr, hint, explanation, unit };
}

export function blanks(text: string, blanks: string[][], hint: string, explanation: string, audio?: AudioClip): ActivityInput {
  return { kind: 'fill_blank', prompt: 'Điền vào chỗ trống.', text, blanks, hint, explanation, audio };
}

export function order(prompt: string, items: string[], hint: string, explanation: string): ActivityInput {
  return { kind: 'order', prompt, items, hint, explanation };
}

export function match(prompt: string, pairs: [string, string][], hint: string, explanation: string): ActivityInput {
  return { kind: 'matching', prompt, pairs, hint, explanation };
}

export function choose(prompt: string, options: string[], answer: number, hint: string, explanation: string): ActivityInput {
  return { kind: 'multiple_choice', prompt, options, answer, hint, explanation };
}

export function select(prompt: string, options: string[], answers: number[], hint: string, explanation: string): ActivityInput {
  return { kind: 'multiple_select', prompt, options, answers, hint, explanation };
}

export function sort(prompt: string, bins: string[], items: { label: string; bin: number }[], hint: string, explanation: string): ActivityInput {
  return { kind: 'drag_drop', prompt, bins, items, hint, explanation };
}

export function fix(prompt: string, lines: string[], wrongLine: number, fix: string[], hint: string, explanation: string): ActivityInput {
  return { kind: 'find_mistake', prompt, lines, wrongLine, fix, hint, explanation };
}

export function lab(input: Omit<ActivityBody<Extract<Activity, { kind: 'experiment' }>>, 'kind' | 'modelNote'> & { hint: string; modelNote: string }): ActivityInput {
  return { kind: 'experiment', ...input };
}

export interface LessonInput {
  cardId: string;
  grade: 3 | 4 | 5;
  objective: string;
  criteria: [string, string];
  activities: [ActivityInput, ActivityInput, ActivityInput];
}

export function lesson(
  cardId: string,
  grade: LessonInput['grade'],
  objective: string,
  criteria: LessonInput['criteria'],
  ...activities: LessonInput['activities']
): LessonInput {
  return { cardId, grade, objective, criteria, activities };
}
