// Kiểm định nội dung môn science: 8 chủ đề × 3 bài, bài hoàn chỉnh phải vượt qua toàn bộ kiểm định
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SCIENCE_LESSONS, SCIENCE_TOPICS } from './science.ts';
import { validateSubjectContent } from '../validate.ts';

describe('Focused Learning – nội dung môn science', () => {
  it('bản đồ 8 chủ đề × 3 bài và các bài hoàn chỉnh đều hợp lệ', () => {
    const errors = validateSubjectContent('science', SCIENCE_TOPICS, SCIENCE_LESSONS);
    assert.deepEqual(errors, [], errors.join('\n'));
  });
  it('đợt 1 có đủ 6 bài hoàn chỉnh', () => {
    assert.equal(SCIENCE_LESSONS.length, 6, 'Đang có ' + SCIENCE_LESSONS.length + ' bài');
  });
});
