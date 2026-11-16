import assert from 'node:assert/strict';
import { test } from 'node:test';
import { INITIAL_LESSONS } from '../data/curriculumData.ts';
import { FOCUS_SUBJECTS, getFocusLesson } from '../learning/catalog.ts';
import { KNOWLEDGE_CARDS, knowledgeForLesson } from '../learning/knowledge/catalog.ts';
import { checkKnowledgeAnswer, matchesKnowledge, recordReflection } from '../learning/knowledge/notebook.ts';

test('each subject has complete foundation cards and all linked labs and exercises exist', () => {
  assert.equal(new Set(KNOWLEDGE_CARDS.map((card) => card.id)).size, KNOWLEDGE_CARDS.length);
  for (const subject of FOCUS_SUBJECTS) {
    assert.ok(KNOWLEDGE_CARDS.filter((card) => card.subject === subject.id).length >= 10, subject.id);
  }
  for (const card of KNOWLEDGE_CARDS) {
    const { id, rule, scenes, examples, guided, practice } = card;
    assert.ok(card.concept && card.use && card.why && card.topic, id);
    assert.ok(rule.expression && rule.parts && rule.when && rule.mistake, id);
    assert.ok(scenes.length >= 2 && scenes.every((scene) => scene.picture && scene.explanation), id);
    assert.equal(examples.length, 2, id);
    assert.ok(examples.every((example) => example.steps.length >= 2 && example.steps.every(Boolean)), id);
    assert.ok(guided.prompt && guided.answer && guided.hints.every(Boolean), id);
    assert.equal(practice.length, 5, id);
    assert.ok(practice.every((question) => question.prompt && question.answer), id);
    if (card.lessonId) assert.ok(INITIAL_LESSONS.some((lesson) => lesson.id === card.lessonId), id);
    if (card.focusLessonId) assert.ok(getFocusLesson(card.focusLessonId)?.tasks.length, id);
  }
  assert.ok(knowledgeForLesson('lesson-g4-science-water-cycle').some((card) => card.id === 'science-evaporation'));
});

test('notebook search handles Vietnamese without accents and tracks review per question', () => {
  const card = KNOWLEDGE_CARDS.find((item) => item.id === 'math-equivalent')!;
  assert.equal(matchesKnowledge(card, undefined, 'phan so bang nhau', 'all', false), true);
  assert.equal(matchesKnowledge(card, undefined, 'phan so bang nhau', 'all', true), false);
  assert.equal(matchesKnowledge(card, { favorite: true }, '  PHÂN số  ', 'favorite', true), true);

  const favorite = { favorite: true, learned: true };
  const first = recordReflection(favorite, 'guided', true);
  const second = recordReflection(first, 'practice-2', true);
  const retried = recordReflection(second, 'guided', false);
  assert.deepEqual(retried, { ...favorite, reviewItems: ['practice-2'] });
  assert.equal(matchesKnowledge(card, retried, '', 'review', true), true);
  const cleared = recordReflection(retried, 'practice-2', false);
  assert.equal(matchesKnowledge(card, cleared, '', 'review', true), false);
  assert.equal(matchesKnowledge(card, cleared, '', 'favorite', true), true);
});

test('closed questions accept intentional spelling and notation variants', () => {
  const question = KNOWLEDGE_CARDS.find((item) => item.id === 'math-area')!.practice[0];
  assert.equal(checkKnowledgeAnswer(' 1 cm^2. ', question.accepted!), true);
  assert.equal(checkKnowledgeAnswer('1 cm', question.accepted!), false);
  assert.equal(checkKnowledgeAnswer('HÀNG CHỤC', ['hàng chục']), true);
});
