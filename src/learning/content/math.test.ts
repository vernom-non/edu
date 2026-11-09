// Kiểm định nội dung môn math: 8 chủ đề × 3 bài, bài hoàn chỉnh phải vượt qua toàn bộ kiểm định
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MATH_LESSONS, MATH_TOPICS } from './math.ts';
import { validateSubjectContent } from '../validate.ts';

describe('Focused Learning – nội dung môn math', () => {
  it('bản đồ 8 chủ đề × 3 bài và các bài hoàn chỉnh đều hợp lệ', () => {
    const errors = validateSubjectContent('math', MATH_TOPICS, MATH_LESSONS);
    assert.deepEqual(errors, [], errors.join('\n'));
  });
  it('đợt 1 có đủ 6 bài hoàn chỉnh', () => {
    assert.equal(MATH_LESSONS.length, 6, 'Đang có ' + MATH_LESSONS.length + ' bài');
  });
});
