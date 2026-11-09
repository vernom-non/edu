// ============================================================================
// Little Genius – Offline Progress Queue & Multi-Device Conflict Resolution
// Lưu tiến độ tạm thời khi mất mạng và hợp nhất an toàn không mất dữ liệu
// ============================================================================

import type { LessonProgressRecord, MasteryLevel } from '../types/education.ts';

const MASTERY_RANK: Record<MasteryLevel, number> = {
  not_started: 0,
  needs_practice: 1,
  mastered_with_hints: 2,
  mastered_independently: 3,
  can_explain: 4,
};

/**
 * Hợp nhất tiến độ bài học từ 2 thiết bị khác nhau (CRDT-style State Merge)
 * Đảm bảo:
 * - Không bao giờ làm mất hoạt động đã hoàn thành trên bất kỳ thiết bị nào
 * - Giữ cấp độ làm chủ cao nhất đã được xác minh (ví dụ can_explain > mastered_independently)
 * - Tăng versionVector nhất quán
 */
export function resolveProgressConflict(
  localRecord: LessonProgressRecord,
  remoteRecord: LessonProgressRecord
): LessonProgressRecord {
  const mergedTasks = Array.from(
    new Set([...localRecord.completedTaskIds, ...remoteRecord.completedTaskIds])
  );
  const mergedMistakes = Array.from(
    new Set([...localRecord.commonMistakes, ...remoteRecord.commonMistakes])
  );

  const highestMastery =
    MASTERY_RANK[localRecord.mastery] >= MASTERY_RANK[remoteRecord.mastery]
      ? localRecord.mastery
      : remoteRecord.mastery;

  const nextVersion =
    Math.max(localRecord.versionVector ?? 1, remoteRecord.versionVector ?? 1) + 1;

  return {
    lessonId: localRecord.lessonId,
    mastery: highestMastery,
    completedTaskIds: mergedTasks,
    attemptsCount: Math.max(localRecord.attemptsCount, remoteRecord.attemptsCount),
    correctFirstTryCount: Math.max(
      localRecord.correctFirstTryCount,
      remoteRecord.correctFirstTryCount
    ),
    hintsUsedCount: Math.min(localRecord.hintsUsedCount, remoteRecord.hintsUsedCount),
    canExplainVerified:
      localRecord.canExplainVerified || remoteRecord.canExplainVerified,
    studentReflectionText:
      localRecord.studentReflectionText || remoteRecord.studentReflectionText,
    commonMistakes: mergedMistakes,
    timeSpentSeconds: Math.max(
      localRecord.timeSpentSeconds,
      remoteRecord.timeSpentSeconds
    ),
    lastUpdated:
      localRecord.lastUpdated >= remoteRecord.lastUpdated
        ? localRecord.lastUpdated
        : remoteRecord.lastUpdated,
    versionVector: nextVersion,
  };
}
