// Kiểm định nội dung môn logic: 8 chủ đề × 3 bài, bài hoàn chỉnh phải vượt qua toàn bộ kiểm định
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LOGIC_LESSONS, LOGIC_TOPICS } from './logic.ts';
import { validateSubjectContent } from '../validate.ts';

describe('Focused Learning – nội dung môn logic', () => {
  it('bản đồ 8 chủ đề × 3 bài và các bài hoàn chỉnh đều hợp lệ', () => {
    const errors = validateSubjectContent('logic', LOGIC_TOPICS, LOGIC_LESSONS);
    assert.deepEqual(errors, [], errors.join('\n'));
  });
  it('đợt 1 có đủ 6 bài hoàn chỉnh', () => {
    assert.equal(LOGIC_LESSONS.length, 6, 'Đang có ' + LOGIC_LESSONS.length + ' bài');
  });
});
