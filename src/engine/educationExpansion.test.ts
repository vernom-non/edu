import assert from 'node:assert/strict';
import { test } from 'node:test';
import { EXPANDED_LESSONS, expandedLesson, isStudentVisible, quickReview, recommendedTask, recordActivity } from '../learning/expansion/program.ts';
import { FOCUS_SUBJECTS } from '../learning/catalog.ts';
import { gradeTask, solutionResponse } from '../learning/grader.ts';
import { validateTask } from '../learning/validate.ts';

test('first release includes five verified lessons per subject with nine distinct activities per lesson', () => {
  assert.equal(EXPANDED_LESSONS.length, 25);
  assert.equal(new Set(EXPANDED_LESSONS.map((lesson) => lesson.id)).size, 25);
  const ids = new Set<string>();
  for (const subject of FOCUS_SUBJECTS) {
    assert.equal(EXPANDED_LESSONS.filter((lesson) => lesson.card.subject === subject.id).length, 5);
  }
  for (const lesson of EXPANDED_LESSONS) {
    assert.equal(lesson.status, 'verified');
    assert.ok(lesson.objective && lesson.criteria.every(Boolean));
    assert.equal(lesson.tasks.length + lesson.card.practice.length + Number(!!lesson.card.guided), 9);
    assert.equal(new Set([lesson.card.guided.prompt, ...lesson.card.practice.map((q) => q.prompt), ...lesson.tasks.map((task) => (
      task.kind === 'fill_blank' ? task.text : task.prompt
    ))]).size, 9, lesson.id);
    assert.ok(new Set(lesson.tasks.map((task) => task.kind)).size >= 2, lesson.id);
    for (const task of lesson.tasks) {
      assert.ok(!ids.has(task.id));
      ids.add(task.id);
      assert.deepEqual(validateTask(task, lesson.card.subject, lesson.id), []);
      const grade = gradeTask(task, solutionResponse(task));
      assert.ok(grade.status === 'correct' || grade.status === 'accepted', task.id);
    }
  }
  assert.equal(ids.size, 75);
  assert.equal(isStudentVisible('draft'), false);
  assert.equal(isStudentVisible('ready_for_review'), false);
  assert.equal(isStudentVisible('verified'), true);
  assert.equal(isStudentVisible('published'), true);
});

test('practice advances after a correct answer and suggests an easier warmup after an error', () => {
  const lesson = expandedLesson('math-perimeter')!;
  let record = recordActivity({}, lesson.tasks[0].id, true);
  assert.equal(recommendedTask(lesson, record), 1);
  record = recordActivity(record, lesson.tasks[1].id, false);
  assert.equal(recommendedTask(lesson, record), 0);
  assert.deepEqual(record.reviewItems, [lesson.tasks[1].id]);
  assert.equal(quickReview({ 'math-area': { learned: true }, [lesson.id]: record }, () => true)?.id, lesson.id);
  record = recordActivity(record, lesson.tasks[1].id, true);
  assert.equal(recommendedTask(lesson, record), 2);
  assert.deepEqual(record.reviewItems, []);
  assert.equal(quickReview({ [lesson.id]: record }, () => true), undefined);
});
