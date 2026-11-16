import type { FocusSubjectId } from '../types.ts';

export interface KnowledgeExample {
  prompt: string;
  steps: readonly string[];
}

export interface KnowledgeRule {
  name: string;
  expression: string;
  parts: string;
  when: string;
  unit?: string;
  mistake: string;
}

export interface Scene {
  label: string;
  picture: string;
  explanation: string;
  fractionBars?: readonly (readonly [shaded: number, parts: number])[];
}

export interface KnowledgeQuestion {
  prompt: string;
  answer: string;
  accepted?: readonly string[];
}

export interface KnowledgeCard {
  id: string;
  subject: FocusSubjectId;
  topic: string;
  title: string;
  concept: string;
  use: string;
  why: string;
  rule: KnowledgeRule;
  scenes: readonly [Scene, Scene, ...Scene[]];
  examples: readonly [KnowledgeExample, KnowledgeExample];
  guided: { prompt: string; hints: readonly [string, string]; answer: string };
  practice: readonly [KnowledgeQuestion, KnowledgeQuestion, KnowledgeQuestion, KnowledgeQuestion, KnowledgeQuestion];
  audio?: string;
  lessonId?: string;
  focusLessonId?: string;
}

export interface KnowledgeRecord {
  favorite?: boolean;
  learned?: boolean;
  reviewItems?: string[];
}

export type KnowledgeProgress = Record<string, KnowledgeRecord>;

type SceneInput = readonly [label: string, picture: string, explanation: string, fractionBars?: Scene['fractionBars']];
type ExampleInput = readonly [prompt: string, firstStep: string, secondStep: string, ...moreSteps: string[]];
type QuestionInput = readonly [prompt: string, answer: string, accepted?: readonly string[]];

interface CardInput {
  topic: string;
  title: string;
  concept: string;
  use: string;
  why: string;
  rule: readonly [expression: string, parts: string, when: string, mistake: string, unit?: string];
  scenes: readonly [SceneInput, SceneInput, ...SceneInput[]];
  examples: readonly [ExampleInput, ExampleInput];
  guided: readonly [prompt: string, firstHint: string, secondHint: string, answer: string];
  practice: readonly [QuestionInput, QuestionInput, QuestionInput, QuestionInput, QuestionInput];
  audio?: string;
  lessonId?: string;
  focusLessonId?: string;
}

export function forSubject(subject: FocusSubjectId) {
  return (slug: string, input: CardInput): KnowledgeCard => {
    const [expression, parts, when, mistake, unit] = input.rule;
    const scene = ([label, picture, explanation, fractionBars]: SceneInput) => ({ label, picture, explanation, fractionBars });
    const example = ([prompt, ...steps]: ExampleInput) => ({ prompt, steps });
    const question = ([prompt, answer, accepted]: QuestionInput) => ({ prompt, answer, accepted });
    const [first, second, ...rest] = input.scenes;
    const [basic, realLife] = input.examples;
    const [prompt, firstHint, secondHint, answer] = input.guided;
    const [recall, understand, error, apply, create] = input.practice;
    return {
      id: `${subject}-${slug}`,
      subject,
      topic: input.topic,
      title: input.title,
      concept: input.concept,
      use: input.use,
      why: input.why,
      rule: { name: input.title, expression, parts, when, mistake, unit },
      scenes: [scene(first), scene(second), ...rest.map(scene)],
      examples: [example(basic), example(realLife)],
      guided: { prompt, hints: [firstHint, secondHint], answer },
      practice: [question(recall), question(understand), question(error), question(apply), question(create)],
      audio: input.audio,
      lessonId: input.lessonId,
      focusLessonId: input.focusLessonId,
    };
  };
}
