// ============================================================================
// Little Genius (EduExplore) – Cloudflare Worker, Security, 8-Subject Ecosystem,
// 36-Exercise Bank, Variant Generator, Curiosity Engine & Offline Sync Tests
// ============================================================================

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRICULUM_TOPICS_MAP,
  INITIAL_LESSONS,
  SUBJECTS_META,
} from '../data/curriculumData.ts';
import { evaluateTaskSubmission } from './learningEngine.ts';
import {
  EXERCISE_36_CATALOG,
  generateControlledMultiplicationVariant,
  verifyGeneratedVariantSubmission,
  type MultiplicationCognitiveMode,
} from './exerciseBankEngine.ts';
import { CURIOSITY_10_LIBRARY } from '../data/curiosityData.ts';
import { resolveProgressConflict } from '../utils/offlineSync.ts';
import workerHandler from '../../worker/index.ts';

describe('Part II & III: 8-Subject Ecosystem, 48-Lesson Map, 36 Exercises & Variant Generator', () => {
  it('verifies all 8 subjects have at least 2 topics, 3 lessons per topic (48 total), and at least 1 interactive lab', () => {
    assert.equal(SUBJECTS_META.length, 8);
    assert.equal(CURRICULUM_TOPICS_MAP.length, 16);

    for (const sub of SUBJECTS_META) {
      const topicsForSub = CURRICULUM_TOPICS_MAP.filter((t) => t.subjectId === sub.id);
      assert.ok(
        topicsForSub.length >= 2,
        `Subject ${sub.id} must have at least 2 topics`
      );
      for (const topic of topicsForSub) {
        assert.ok(
          topic.lessons.length >= 3,
          `Topic ${topic.id} must have at least 3 lessons`
        );
      }

      const interactiveLabs = INITIAL_LESSONS.filter((l) => l.subjectId === sub.id);
      assert.ok(
        interactiveLabs.length >= 1,
        `Subject ${sub.id} must have at least 1 interactive simulation lesson`
      );
    }
  });

  it('validates the 3 new interactive subject labs: Tech/AI, Art/Symmetry, and Finance/Budget', () => {
    // 10. Tech & AI Lab
    const techLesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g4-tech-ai-coding-lab')!;
    const techTask = techLesson.tasks[0];
    assert.equal(
      evaluateTaskSubmission(techTask, {
        aiTrainedCorrectCount: 2,
        debugFixedCommand: 'TURN_LEFT',
      }).isCorrect,
      false
    );
    assert.equal(
      evaluateTaskSubmission(techTask, {
        aiTrainedCorrectCount: 4,
        debugFixedCommand: 'TURN_RIGHT',
      }).isCorrect,
      true
    );

    // 11. Art Pastel & Symmetry Studio
    const artLesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g3-art-color-symmetry-studio')!;
    const artTask = artLesson.tasks[0];
    assert.equal(
      evaluateTaskSubmission(artTask, {
        mixedColorCode: 'lavender',
        symmetryCellsCount: 2,
      }).isCorrect,
      false
    );
    assert.equal(
      evaluateTaskSubmission(artTask, {
        mixedColorCode: 'mint',
        symmetryCellsCount: 4,
      }).isCorrect,
      true
    );

    // 12. Smart Finance & Budget Lab
    const finLesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g3-finance-smart-budget-lab')!;
    const finTask = finLesson.tasks[0];
    // Overspending & missing needs
    assert.equal(
      evaluateTaskSubmission(finTask, {
        selectedBudgetItems: ['plush_toy', 'candy_box'],
      }).isCorrect,
      false
    );
    // Balanced needs + >= 20 coins saved
    assert.equal(
      evaluateTaskSubmission(finTask, {
        selectedBudgetItems: ['notebook', 'stationery', 'healthy_lunch'],
      }).isCorrect,
      true
    );
  });

  it('verifies all 36 exercise types across 6 groups and tests all 6 multiplication cognitive variant modes', () => {
    assert.equal(EXERCISE_36_CATALOG.length, 36);
    const numbers = EXERCISE_36_CATALOG.map((e) => e.subTypeNumber);
    for (let i = 1; i <= 36; i++) {
      assert.ok(numbers.includes(i), `Missing exercise sub-type #${i}`);
    }

    const modes: MultiplicationCognitiveMode[] = [
      'visual_array',
      'equal_groups',
      'shopping_math',
      'area_grid',
      'logic_riddle',
      'model_builder',
    ];

    for (const mode of modes) {
      for (const diff of [1, 2, 3] as const) {
        const v = generateControlledMultiplicationVariant(mode, diff, 2);
        assert.equal(v.verifiedSolvable, true);
        assert.equal(v.factorA * v.factorB, v.expectedProduct);
        assert.ok(v.hints.length >= 1);

        // Exact factor match
        const okRes = verifyGeneratedVariantSubmission(
          v,
          v.factorA,
          v.factorB,
          v.expectedProduct
        );
        assert.equal(okRes.isCorrect, true);

        // Wrong product
        const wrongRes = verifyGeneratedVariantSubmission(
          v,
          v.factorA,
          v.factorB,
          v.expectedProduct + 1
        );
        assert.equal(wrongRes.isCorrect, false);
      }
    }

    // Open-ended model_builder accepts alternative factorizations of 12 (e.g. 2x6 for 3x4=12)
    const builderVar = generateControlledMultiplicationVariant('model_builder', 2, 0); // 3x4 = 12
    assert.equal(builderVar.expectedProduct, 12);
    const altFactor = verifyGeneratedVariantSubmission(builderVar, 2, 6, 12);
    assert.equal(altFactor.isCorrect, true);
  });
});

describe('Part IV, V & VII: Curiosity Engine, Offline Multi-Device Conflict Resolution & Cloudflare Worker Security', () => {
  it('verifies all 10 Curiosity Engine journeys and multi-device progress conflict resolution', () => {
    assert.equal(CURIOSITY_10_LIBRARY.length, 10);
    for (const item of CURIOSITY_10_LIBRARY) {
      assert.ok(item.question.length > 5);
      assert.ok(item.simplificationDisclaimer.length > 10);
    }

    // Conflict resolution between Tablet (offline) and Desktop (online)
    const merged = resolveProgressConflict(
      {
        lessonId: 'lesson-g3-math-fraction-cake',
        mastery: 'mastered_with_hints',
        completedTaskIds: ['task-g3-frac-1'],
        attemptsCount: 2,
        correctFirstTryCount: 1,
        hintsUsedCount: 1,
        canExplainVerified: false,
        commonMistakes: ['DENOMINATOR_IGNORED'],
        timeSpentSeconds: 120,
        lastUpdated: '2026-11-09T10:00:00Z',
        versionVector: 2,
      },
      {
        lessonId: 'lesson-g3-math-fraction-cake',
        mastery: 'can_explain',
        completedTaskIds: ['task-g3-frac-2'],
        attemptsCount: 3,
        correctFirstTryCount: 2,
        hintsUsedCount: 1,
        canExplainVerified: true,
        commonMistakes: [],
        timeSpentSeconds: 180,
        lastUpdated: '2026-11-09T11:00:00Z',
        versionVector: 3,
      }
    );

    assert.equal(merged.mastery, 'can_explain');
    assert.equal(merged.completedTaskIds.length, 2);
    assert.equal(merged.canExplainVerified, true);
    assert.equal(merged.versionVector, 4);
  });

  it('verifies Cloudflare Worker endpoints: /api/health, /api/curriculum, /api/evaluate, Idempotency, and IDOR Child Protection', async () => {
    // 1. Health check
    const healthRes = await workerHandler.fetch(
      new Request('https://little-genius.example.com/api/health'),
      { APP_ENV: 'production', DEPLOYMENT_VERSION: '2.0.0-cloudflare' }
    );
    assert.equal(healthRes.status, 200);
    assert.equal(healthRes.headers.get('X-Frame-Options'), 'DENY');
    const healthJson = (await healthRes.json()) as { status: string };
    assert.equal(healthJson.status, 'healthy_24_7');

    // 2. Filtered Curriculum API (does not dump unneeded subjects)
    const currRes = await workerHandler.fetch(
      new Request('https://little-genius.example.com/api/curriculum?subjectId=tech_ai_coding')
    );
    assert.equal(currRes.status, 200);
    const currJson = (await currRes.json()) as { lessons: unknown[]; topicsMap: unknown[] };
    assert.equal(currJson.lessons.length, 1);
    assert.equal(currJson.topicsMap.length, 2);

    // 3. Cross-student IDOR attack blocked with 403 Forbidden
    const idorRes = await workerHandler.fetch(
      new Request('https://little-genius.example.com/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authenticatedStudentId: 'student-bap-01',
          studentId: 'other-student-99',
          lessonId: 'lesson-g1-math-fruit-addition',
          taskId: 'task-g1-fruit-1',
          submission: { basketA: 3, basketB: 2, userNumericAnswer: 5 },
        }),
      })
    );
    assert.equal(idorRes.status, 403);

    // 4. Valid evaluation with Idempotency Key deduplication
    const evalReq = () =>
      new Request('https://little-genius.example.com/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': 'idem-test-key-001',
        },
        body: JSON.stringify({
          authenticatedStudentId: 'student-bap-01',
          studentId: 'student-bap-01',
          lessonId: 'lesson-g1-math-fruit-addition',
          taskId: 'task-g1-fruit-1',
          submission: { basketA: 3, basketB: 2, userNumericAnswer: 5 },
        }),
      });

    const firstEval = await workerHandler.fetch(evalReq());
    assert.equal(firstEval.status, 200);
    const secondEval = await workerHandler.fetch(evalReq());
    assert.equal(secondEval.status, 200);
    const evalData = (await secondEval.json()) as { evaluation: { isCorrect: boolean } };
    assert.equal(evalData.evaluation.isCorrect, true);

    // 5. Turnstile bot verification rejects invalid token
    const botRes = await workerHandler.fetch(
      new Request('https://little-genius.example.com/api/auth/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'invalid_bot_token' }),
      })
    );
    assert.equal(botRes.status, 400);

    // 6. Scheduled Cron cleanup executes safely
    await workerHandler.scheduled();
  });
});
