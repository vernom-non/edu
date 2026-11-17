// Kiểm định nội dung môn logic: bản đồ 8 chủ đề × 3 bài và thẻ kiến thức Tư duy Logic
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LOGIC_LESSONS, LOGIC_TOPICS } from './logic.ts';
import { validateSubjectContent } from '../validate.ts';
import { logicCards } from '../knowledge/logic.ts';

describe('Focused Learning – nội dung môn logic', () => {
  it('bản đồ 8 chủ đề × 3 bài và các bài hoàn chỉnh đều hợp lệ', () => {
    const errors = validateSubjectContent('logic', LOGIC_TOPICS, LOGIC_LESSONS);
    assert.deepEqual(errors, [], errors.join('\n'));
  });
  it('có đầy đủ tối thiểu 10 bài học thẻ kiến thức Tư duy Logic chuyên sâu', () => {
    assert.ok(logicCards.length >= 10, 'Đang có ' + logicCards.length + ' bài');
  });
});
