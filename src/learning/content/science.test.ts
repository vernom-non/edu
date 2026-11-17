// Kiểm định nội dung môn science: bản đồ 8 chủ đề × 3 bài và thẻ kiến thức Khoa học
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SCIENCE_LESSONS, SCIENCE_TOPICS } from './science.ts';
import { validateSubjectContent } from '../validate.ts';
import { scienceCards } from '../knowledge/science.ts';

describe('Focused Learning – nội dung môn science', () => {
  it('bản đồ 8 chủ đề × 3 bài và các bài hoàn chỉnh đều hợp lệ', () => {
    const errors = validateSubjectContent('science', SCIENCE_TOPICS, SCIENCE_LESSONS);
    assert.deepEqual(errors, [], errors.join('\n'));
  });
  it('có đầy đủ tối thiểu 10 bài học thẻ kiến thức Khoa học chuyên sâu', () => {
    assert.ok(scienceCards.length >= 10, 'Đang có ' + scienceCards.length + ' bài');
  });
});
