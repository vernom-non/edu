// ============================================================================
// EduExplore – Automated Unit & Integration Tests (Learning Engine & Socratic AI)
// Run via: npm test (node --test)
// ============================================================================

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  areFractionsEquivalent,
  computeMasteryLevel,
  evaluateTaskSubmission,
  gcd,
  getPersonalizedRecommendations,
} from './learningEngine.ts';
import {
  generateSocraticGuidance,
  sanitizeAndCheckChildSafety,
  SocraticTutorService,
} from './socraticTutor.ts';
import { INITIAL_LESSONS } from '../data/curriculumData.ts';
import type { LessonProgressRecord, StudentProfile } from '../types/education.ts';

describe('EduExplore Mathematical & Scientific Verification Engine', () => {
  it('computes gcd and fraction equivalence accurately (1/2 == 2/4 == 4/8)', () => {
    assert.equal(gcd(4, 8), 4);
    assert.equal(areFractionsEquivalent(1, 2, 2, 4), true);
    assert.equal(areFractionsEquivalent(2, 6, 1, 3), true);
    assert.equal(areFractionsEquivalent(1, 4, 1, 2), false);
  });

  it('validates Grade 1 Fruit Addition accurately and detects group/sum misconceptions', () => {
    const lesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g1-math-fruit-addition')!;
    const task1 = lesson.tasks[0]; // 3 + 2 = 5

    // Wrong groups
    const wrongGroup = evaluateTaskSubmission(task1, {
      basketA: 2,
      basketB: 2,
      userNumericAnswer: 4,
    });
    assert.equal(wrongGroup.isCorrect, false);
    assert.equal(wrongGroup.diagnosticCode, 'GROUP_MISMATCH');

    // Correct groups & sum
    const rightAns = evaluateTaskSubmission(task1, {
      basketA: 3,
      basketB: 2,
      userNumericAnswer: 5,
    });
    assert.equal(rightAns.isCorrect, true);
    assert.equal(rightAns.diagnosticCode, 'EXACT_MATCH');

    // Open-ended creative decomposition of 6 (e.g., 2 + 4 = 6 or 5 + 1 = 6)
    const task3 = lesson.tasks[2];
    const openAns1 = evaluateTaskSubmission(task3, {
      basketA: 2,
      basketB: 4,
      userNumericAnswer: 6,
    });
    assert.equal(openAns1.isCorrect, true);

    const openAns2 = evaluateTaskSubmission(task3, {
      basketA: 5,
      basketB: 1,
      userNumericAnswer: 6,
    });
    assert.equal(openAns2.isCorrect, true);
  });

  it('validates Grade 2 Interactive Clock and detects swapped hour/minute hands', () => {
    const lesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g2-math-clock-time')!;
    const task1 = lesson.tasks[0]; // 7:30

    // Swapped hands: hour at 6, minute at 35 (7*5)
    const swapped = evaluateTaskSubmission(task1, {
      hour: 6,
      minute: 35,
    });
    assert.equal(swapped.isCorrect, false);
    assert.equal(swapped.diagnosticCode, 'SWAPPED_CLOCK_HANDS');

    // Exact match 7:30
    const correct = evaluateTaskSubmission(task1, {
      hour: 7,
      minute: 30,
    });
    assert.equal(correct.isCorrect, true);
    assert.equal(correct.diagnosticCode, 'EXACT_TIME');
  });

  it('validates Grade 3 Fraction Cake and recognizes equivalent fractions (2/4 == 1/2)', () => {
    const lesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g3-math-fraction-cake')!;
    const task1 = lesson.tasks[0]; // 1/4 exact
    const task2 = lesson.tasks[1]; // any fraction equivalent to 1/2

    const wrongDenom = evaluateTaskSubmission(task1, {
      totalSlices: 3,
      shadedSlices: 1,
    });
    assert.equal(wrongDenom.isCorrect, false);

    const exactQuarter = evaluateTaskSubmission(task1, {
      totalSlices: 4,
      shadedSlices: 1,
    });
    assert.equal(exactQuarter.isCorrect, true);

    const equivTwoFourths = evaluateTaskSubmission(task2, {
      totalSlices: 4,
      shadedSlices: 2,
    });
    assert.equal(equivTwoFourths.isCorrect, true);
    assert.equal(equivTwoFourths.diagnosticCode, 'EQUIVALENT_FRACTION_MATCH');
  });

  it('validates Grade 4 Water Cycle scientific simulation conditions', () => {
    const lesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g4-science-water-cycle')!;
    const task = lesson.tasks[0];

    const coldWater = evaluateTaskSubmission(task, {
      sunTempC: 18,
      windLevel: 2,
      observedProcesses: ['evaporation'],
    });
    assert.equal(coldWater.isCorrect, false);
    assert.equal(coldWater.diagnosticCode, 'INSUFFICIENT_EVAPORATION_HEAT');

    const fullCycle = evaluateTaskSubmission(task, {
      sunTempC: 32,
      windLevel: 3,
      observedProcesses: ['evaporation', 'condensation', 'precipitation'],
    });
    assert.equal(fullCycle.isCorrect, true);
    assert.equal(fullCycle.diagnosticCode, 'WATER_CYCLE_COMPLETE');
  });

  it('validates Grade 5 Geometry Area & Perimeter and detects Perimeter-vs-Area confusion', () => {
    const lesson = INITIAL_LESSONS.find(
      (l) => l.id === 'lesson-g5-math-geometry-area-perimeter'
    )!;
    const taskArea12 = lesson.tasks[0]; // targetArea: 12
    const taskMaxArea = lesson.tasks[1]; // targetPerimeter: 16, targetArea: 16

    // 5x1 has perimeter 12, area 5 -> detects confusion between perimeter and area!
    const confused = evaluateTaskSubmission(taskArea12, {
      widthUnits: 5,
      heightUnits: 1,
    });
    assert.equal(confused.isCorrect, false);
    assert.equal(confused.diagnosticCode, 'CONFUSED_PERIMETER_WITH_AREA');

    // Both 4x3 and 6x2 have area 12 -> accepted!
    assert.equal(
      evaluateTaskSubmission(taskArea12, { widthUnits: 4, heightUnits: 3 }).isCorrect,
      true
    );
    assert.equal(
      evaluateTaskSubmission(taskArea12, { widthUnits: 6, heightUnits: 2 }).isCorrect,
      true
    );

    // 4x4 square maximizes area for perimeter 16
    assert.equal(
      evaluateTaskSubmission(taskMaxArea, { widthUnits: 4, heightUnits: 4 }).isCorrect,
      true
    );
  });

  it('validates Grade 2 Vietnamese Sentence Builder with multiple valid expressions', () => {
    const lesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g2-vietnamese-story-builder')!;
    const task = lesson.tasks[0];

    const incomplete = evaluateTaskSubmission(task, {
      selectedWords: ['Chú mèo vàng'],
    });
    assert.equal(incomplete.isCorrect, false);

    const order1 = evaluateTaskSubmission(task, {
      selectedWords: ['Chú mèo vàng', 'đang nằm ngủ', 'dưới gốc cây xanh'],
    });
    assert.equal(order1.isCorrect, true);

    const order2 = evaluateTaskSubmission(task, {
      selectedWords: ['Dưới gốc cây xanh,', 'chú mèo nhỏ', 'nằm sưởi nắng'],
    });
    assert.equal(order2.isCorrect, true);
  });

  it('validates Grade 3 Science Plant Growth and detects drought, flood, and light deficit', () => {
    const lesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g3-science-plant-growth')!;
    const task = lesson.tasks[0];

    const dark = evaluateTaskSubmission(task, { lightLevel: 20, waterLevel: 60 });
    assert.equal(dark.isCorrect, false);
    assert.equal(dark.diagnosticCode, 'LIGHT_DEFICIT');

    const flooded = evaluateTaskSubmission(task, { lightLevel: 70, waterLevel: 95 });
    assert.equal(flooded.isCorrect, false);
    assert.equal(flooded.diagnosticCode, 'WATER_EXCESS');

    const optimal = evaluateTaskSubmission(task, { lightLevel: 70, waterLevel: 65 });
    assert.equal(optimal.isCorrect, true);
    assert.equal(optimal.diagnosticCode, 'PLANT_THRIVING');
  });

  it('validates Grade 3 Situational English and Grade 4 Vietnam Map & Internet Safety', () => {
    const enLesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g3-english-room-explorer')!;
    const enTask = enLesson.tasks[0];
    assert.equal(
      evaluateTaskSubmission(enTask, { foundObjectIds: ['book', 'apple'] }).isCorrect,
      false
    );
    assert.equal(
      evaluateTaskSubmission(enTask, { foundObjectIds: ['book', 'apple', 'clock'] }).isCorrect,
      true
    );

    const socLesson = INITIAL_LESSONS.find((l) => l.id === 'lesson-g4-social-vietnam-map-civics')!;
    const socTask = socLesson.tasks[0];
    assert.equal(
      evaluateTaskSubmission(socTask, {
        selectedRegionId: 'north',
        ethicsChoiceId: 'unsafe_share',
      }).isCorrect,
      false
    );
    assert.equal(
      evaluateTaskSubmission(socTask, {
        selectedRegionId: 'north',
        ethicsChoiceId: 'safe_verify',
      }).isCorrect,
      true
    );
  });
});

describe('Socratic AI Tutor & Child Safety Guardrails', () => {
  it('blocks PII (phone numbers/emails) and direct-answer requests without revealing answers', () => {
    const phoneCheck = sanitizeAndCheckChildSafety('Số điện thoại của con là 0912345678');
    assert.equal(phoneCheck.safe, false);
    assert.ok(phoneCheck.sanitizedText.includes('[Đã ẩn thông tin cá nhân]'));

    const cheatCheck = sanitizeAndCheckChildSafety('Làm hộ bài này và cho xin đáp án luôn đi');
    assert.equal(cheatCheck.safe, false);
  });

  it('responds Socratic-style to 8 - 3 without giving away the final number', () => {
    const lesson = INITIAL_LESSONS[0];
    const guidance = generateSocraticGuidance({
      lesson,
      task: lesson.tasks[0],
      attemptCount: 1,
      studentQuestion: 'Cô ơi 8 - 3 bằng mấy ạ?',
      grade: 1,
    });

    assert.equal(guidance.revealsDirectAnswer, false);
    assert.ok(guidance.socraticMessage.includes('Con có 8 viên bi'));
    assert.ok(guidance.socraticMessage.includes('lấy đi 3 viên'));
    assert.ok(!guidance.socraticMessage.includes('= 5'));
  });

  it('distinguishes mastery levels: needs_practice, mastered_with_hints, mastered_independently, can_explain', () => {
    const baseRecord: LessonProgressRecord = {
      lessonId: 'lesson-g1-math-fruit-addition',
      mastery: 'not_started',
      completedTaskIds: ['t1', 't2', 't3'],
      attemptsCount: 3,
      correctFirstTryCount: 3,
      hintsUsedCount: 0,
      canExplainVerified: false,
      commonMistakes: [],
      timeSpentSeconds: 180,
      lastUpdated: new Date().toISOString(),
    };

    assert.equal(computeMasteryLevel(baseRecord, 3), 'mastered_independently');
    assert.equal(
      computeMasteryLevel({ ...baseRecord, hintsUsedCount: 2 }, 3),
      'mastered_with_hints'
    );
    assert.equal(
      computeMasteryLevel({ ...baseRecord, canExplainVerified: true }, 3),
      'can_explain'
    );
    assert.equal(
      computeMasteryLevel({ ...baseRecord, completedTaskIds: ['t1'] }, 3),
      'needs_practice'
    );
  });

  it('generates personalized recommendations prioritizing misconceptions first', () => {
    const profile: StudentProfile = {
      id: 'stu-1',
      name: 'Bé Bắp',
      currentGrade: 3,
      role: 'student',
      dailyLimitMinutes: 45,
      todayMinutesUsed: 15,
      accessibility: {
        voiceGuide: true,
        reducedMotion: false,
        largeText: false,
        highContrast: false,
        focusMode: false,
      },
      progressMap: {
        'lesson-g3-math-fraction-cake': {
          lessonId: 'lesson-g3-math-fraction-cake',
          mastery: 'needs_practice',
          completedTaskIds: ['task-g3-frac-1'],
          attemptsCount: 2,
          correctFirstTryCount: 0,
          hintsUsedCount: 1,
          canExplainVerified: false,
          commonMistakes: ['Nhầm mẫu số và tử số'],
          timeSpentSeconds: 120,
          lastUpdated: new Date().toISOString(),
        },
      },
    };

    const recs = getPersonalizedRecommendations(profile, INITIAL_LESSONS);
    assert.ok(recs.length > 0);
    assert.equal(recs[0].priority, 'review_misconception');
    assert.equal(recs[0].lesson.id, 'lesson-g3-math-fraction-cake');

    const service = new SocraticTutorService({ provider: 'rule_based' });
    assert.equal(service.getStatusBadge().isExternalAIConnected, false);
  });
});
