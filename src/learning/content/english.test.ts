// Kiểm định nội dung môn english: 8 chủ đề × 3 bài, bài hoàn chỉnh phải vượt qua toàn bộ kiểm định
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ENGLISH_LESSONS, ENGLISH_TOPICS } from './english.ts';
import { validateSubjectContent } from '../validate.ts';

describe('Focused Learning – nội dung môn english', () => {
  it('bản đồ 8 chủ đề × 3 bài và các bài hoàn chỉnh đều hợp lệ', () => {
    const errors = validateSubjectContent('english', ENGLISH_TOPICS, ENGLISH_LESSONS);
    assert.deepEqual(errors, [], errors.join('\n'));
  });
  it('đợt 1 có đủ 6 bài hoàn chỉnh', () => {
    assert.equal(ENGLISH_LESSONS.length, 6, 'Đang có ' + ENGLISH_LESSONS.length + ' bài');
  });
});
