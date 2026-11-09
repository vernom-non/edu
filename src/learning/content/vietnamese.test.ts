// Kiểm định nội dung môn vietnamese: 8 chủ đề × 3 bài, bài hoàn chỉnh phải vượt qua toàn bộ kiểm định
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VIETNAMESE_LESSONS, VIETNAMESE_TOPICS } from './vietnamese.ts';
import { validateSubjectContent } from '../validate.ts';

describe('Focused Learning – nội dung môn vietnamese', () => {
  it('bản đồ 8 chủ đề × 3 bài và các bài hoàn chỉnh đều hợp lệ', () => {
    const errors = validateSubjectContent('vietnamese', VIETNAMESE_TOPICS, VIETNAMESE_LESSONS);
    assert.deepEqual(errors, [], errors.join('\n'));
  });
  it('đợt 1 có đủ 6 bài hoàn chỉnh', () => {
    assert.equal(VIETNAMESE_LESSONS.length, 6, 'Đang có ' + VIETNAMESE_LESSONS.length + ' bài');
  });
});
