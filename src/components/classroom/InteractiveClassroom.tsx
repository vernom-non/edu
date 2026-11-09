// ============================================================================
// Little Genius (EduExplore) – Phòng học Tương tác Tối giản (Focused Classroom)
// Triết lý: Mỗi màn hình chỉ tập trung vào MỘT nhiệm vụ
// - Phần trên: Câu hỏi hoặc hướng dẫn ngắn gọn, rõ ràng
// - Phần giữa: Khu vực mô phỏng tương tác lớn, dễ thao tác bằng 1 ngón tay
// - Phần dưới: Nút "Con cần gợi ý?" (Gợi ý), "Kiểm tra", "Thử lại" hoặc "Học tiếp"
// - Progressive Disclosure: Chỉ hiện gợi ý khi cần, kiến thức bổ sung đặt trong bảng mở rộng
// ============================================================================

import React, { useEffect, useState } from 'react';
import type {
  GradeLevel,
  Lesson,
  LessonProgressRecord,
} from '../../types/education.ts';
import {
  evaluateTaskSubmission,
  type EvaluationResult,
  type SimulationSubmission,
} from '../../engine/learningEngine.ts';
import {
  generateSocraticGuidance,
  type TutorResponse,
} from '../../engine/socraticTutor.ts';
import { InteractiveSimulationCanvas } from '../simulations/InteractiveSimulations.tsx';
import { playFeedbackTone, speakText } from '../../utils/speechAndAudio.ts';

interface InteractiveClassroomProps {
  lesson: Lesson;
  progress?: LessonProgressRecord;
  voiceEnabled: boolean;
  reducedMotion: boolean;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  onUpdateProgress: (
    lessonId: string,
    taskCompletedId: string | null,
    isCorrectFirstTry: boolean,
    usedHint: boolean,
    canExplainVerified: boolean,
    misconception?: string,
    reflectionText?: string
  ) => void;
  onBackToCatalog: () => void;
  onNextLesson: () => void;
}

export const InteractiveClassroom: React.FC<InteractiveClassroomProps> = ({
  lesson,
  progress,
  voiceEnabled,
  reducedMotion,
  focusMode,
  onToggleFocusMode,
  onUpdateProgress,
  onBackToCatalog,
  onNextLesson,
}) => {
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const currentTask = lesson.tasks[activeTaskIndex] ?? lesson.tasks[0];

  const [simState, setSimState] = useState<SimulationSubmission>(
    lesson.initialSimulationState as SimulationSubmission
  );
  const [taskAttempts, setTaskAttempts] = useState(0);
  const [hintsUsedInTask, setHintsUsedInTask] = useState(0);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [tutorGuidance, setTutorGuidance] = useState<TutorResponse | null>(null);
  const [showHintBox, setShowHintBox] = useState(false);
  const [showStepExplanation, setShowStepExplanation] = useState(false);
  const [selectedReflectionId, setSelectedReflectionId] = useState<string | null>(null);
  const [reflectionVerified, setReflectionVerified] = useState(false);

  useEffect(() => {
    setActiveTaskIndex(0);
    setSimState(lesson.initialSimulationState as SimulationSubmission);
    setTaskAttempts(0);
    setHintsUsedInTask(0);
    setEvaluation(null);
    setTutorGuidance(null);
    setShowHintBox(false);
    setShowStepExplanation(false);
    setSelectedReflectionId(null);
    setReflectionVerified(false);
  }, [lesson.id]);

  const handleSelectTask = (idx: number) => {
    setActiveTaskIndex(idx);
    setTaskAttempts(0);
    setHintsUsedInTask(0);
    setEvaluation(null);
    setTutorGuidance(null);
    setShowHintBox(false);
    setShowStepExplanation(false);
    setSelectedReflectionId(null);
  };

  const handleCheckAnswer = () => {
    const nextAttempt = taskAttempts + 1;
    setTaskAttempts(nextAttempt);

    const res = evaluateTaskSubmission(currentTask, simState);
    setEvaluation(res);

    const socratic = generateSocraticGuidance({
      lesson,
      task: currentTask,
      attemptCount: nextAttempt,
      lastEvaluation: res,
      grade: lesson.grade as GradeLevel,
    });
    setTutorGuidance(socratic);

    if (res.isCorrect) {
      setShowHintBox(false);
      playFeedbackTone('success', voiceEnabled);
      speakText(res.encouragement, 'vi-VN', voiceEnabled);
      onUpdateProgress(
        lesson.id,
        currentTask.id,
        nextAttempt === 1 && hintsUsedInTask === 0,
        hintsUsedInTask > 0,
        reflectionVerified
      );
    } else {
      // Khi trả lời sai mới hiển thị gợi ý phù hợp
      setShowHintBox(true);
      playFeedbackTone('hint', voiceEnabled);
      speakText(socratic.socraticMessage, 'vi-VN', voiceEnabled);
      onUpdateProgress(
        lesson.id,
        null,
        false,
        hintsUsedInTask > 0,
        reflectionVerified,
        res.misconceptionDetected
      );
    }
  };

  const handleRequestSocraticHint = () => {
    const nextHintCount = hintsUsedInTask + 1;
    setHintsUsedInTask(nextHintCount);
    setShowHintBox(true);
    playFeedbackTone('hint', voiceEnabled);

    const guidance = generateSocraticGuidance({
      lesson,
      task: currentTask,
      attemptCount: Math.max(1, nextHintCount),
      lastEvaluation: evaluation ?? undefined,
      grade: lesson.grade as GradeLevel,
    });
    setTutorGuidance(guidance);
    speakText(guidance.socraticMessage, 'vi-VN', voiceEnabled);
  };

  const handleRetryTask = () => {
    setEvaluation(null);
    setShowStepExplanation(false);
  };

  const handleVerifyConceptReflection = (
    choice: (typeof currentTask.reflectionChoices)[number]
  ) => {
    setSelectedReflectionId(choice.id);
    if (choice.isConceptualCorrect) {
      setReflectionVerified(true);
      playFeedbackTone('success', voiceEnabled);
      onUpdateProgress(
        lesson.id,
        currentTask.id,
        taskAttempts <= 1 && hintsUsedInTask === 0,
        hintsUsedInTask > 0,
        true,
        undefined,
        choice.text
      );
    } else {
      playFeedbackTone('hint', voiceEnabled);
    }
  };

  const completedTaskIds = progress?.completedTaskIds ?? [];
  const isLastTask = activeTaskIndex >= lesson.tasks.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">
      {/* Thanh đầu bài học gọn gàng: Nút quay lại + Tiến độ bước + Nghe đề */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="rounded-2xl bg-white border border-[#E6E4DD] hover:bg-[#F3EFFE] text-[#263238] px-3.5 py-2.5 text-sm font-bold min-h-[44px] flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Quay lại</span>
        </button>

        {/* Chấm tiến trình nhiệm vụ tối giản */}
        <div className="flex items-center gap-1.5" aria-label="Tiến độ nhiệm vụ">
          {lesson.tasks.map((t, idx) => {
            const isDone = completedTaskIds.includes(t.id);
            const isCurrent = idx === activeTaskIndex;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTask(idx)}
                className={`h-9 px-3 rounded-full text-xs font-extrabold transition-colors ${
                  isCurrent
                    ? 'bg-[#263238] text-white'
                    : isDone
                    ? 'bg-[#A7DCCB] text-[#263238]'
                    : 'bg-white border border-[#E6E4DD] text-[#546E7A]'
                }`}
              >
                {isDone ? '✓ ' : ''}Phần {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              speakText(
                `${currentTask.instruction}. ${currentTask.question}`,
                'vi-VN',
                true
              )
            }
            className="rounded-2xl bg-white border border-[#E6E4DD] hover:bg-[#F3EFFE] text-[#263238] px-3.5 py-2.5 text-sm font-bold min-h-[44px]"
            title="Đọc câu hỏi"
          >
            🔊 Đọc
          </button>
          <button
            type="button"
            onClick={onToggleFocusMode}
            className={`hidden sm:inline-flex rounded-2xl px-3 py-2.5 text-xs font-bold border min-h-[44px] items-center ${
              focusMode
                ? 'bg-[#263238] text-white border-[#263238]'
                : 'bg-white text-[#546E7A] border-[#E6E4DD]'
            }`}
          >
            {focusMode ? 'Thu gọn' : 'Tập trung'}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. PHẦN TRÊN: CÂU HỎI HOẶC HƯỚNG DẪN NGẮN                            */}
      {/* ==================================================================== */}
      <section className="lg-card p-5 sm:p-6 space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#546E7A]">
          <span>
            {lesson.title} • Lớp {lesson.grade}
          </span>
          <span>
            Nhiệm vụ {activeTaskIndex + 1}/{lesson.tasks.length}
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-extrabold text-[#263238] leading-snug">
          {currentTask.question}
        </h1>

        <p className="text-sm text-[#546E7A] leading-relaxed">
          {currentTask.instruction}
        </p>
      </section>

      {/* ==================================================================== */}
      {/* 2. PHẦN GIỮA: KHU VỰC TƯƠNG TÁC LỚN, RÕ RÀNG                         */}
      {/* ==================================================================== */}
      <section className="lg-card p-4 sm:p-6">
        <InteractiveSimulationCanvas
          simulationType={lesson.simulationType}
          state={simState}
          onChange={setSimState}
          voiceEnabled={voiceEnabled}
          reducedMotion={reducedMotion}
        />
      </section>

      {/* ==================================================================== */}
      {/* 3. PHẦN DƯỚI: NÚT GỢI Ý, KIỂM TRA & PHẢN HỒI PROGRESSIVE DISCLOSURE   */}
      {/* ==================================================================== */}
      <section className="lg-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Nút nhỏ "Con cần gợi ý?" - không tự động mở chatbot */}
          <button
            type="button"
            onClick={handleRequestSocraticHint}
            className="rounded-2xl bg-[#F3EFFE] hover:bg-[#E7DDFC] text-[#263238] border border-[#D8CBF8] px-4 py-3 text-sm font-bold min-h-[48px] flex items-center gap-2"
          >
            <span>💡</span>
            <span>{showHintBox ? 'Gợi ý' : 'Con cần gợi ý?'}</span>
          </button>

          <div className="flex items-center gap-2.5 flex-1 sm:flex-none justify-end">
            {evaluation && !evaluation.isCorrect && (
              <button
                type="button"
                onClick={handleRetryTask}
                className="rounded-2xl bg-white border border-[#E6E4DD] text-[#263238] px-4 py-3 text-sm font-bold min-h-[48px]"
              >
                Thử lại
              </button>
            )}

            <button
              type="button"
              onClick={handleCheckAnswer}
              className="flex-1 sm:flex-none rounded-2xl bg-[#263238] hover:bg-[#37474F] text-white px-7 py-3 text-base font-extrabold min-h-[48px] shadow-xs active:scale-98 transition-transform"
            >
              Kiểm tra
            </button>
          </div>
        </div>

        {/* GỢI Ý NGẮN GỌN (Chỉ hiện khi bé bấm "Con cần gợi ý?" hoặc khi trả lời chưa đúng) */}
        {showHintBox && tutorGuidance && (
          <div className="rounded-2xl bg-[#F3EFFE] border border-[#D8CBF8] p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#4C1D95]">
                💡 Gợi ý cho con ({tutorGuidance.stepLabel})
              </span>
              <button
                type="button"
                onClick={handleRequestSocraticHint}
                className="text-xs font-extrabold text-[#4C1D95] underline"
              >
                Xem gợi ý tiếp theo →
              </button>
            </div>
            <p className="text-sm font-semibold text-[#263238] leading-relaxed">
              {tutorGuidance.socraticMessage}
            </p>
            <p className="text-xs text-[#546E7A]">
              👉 {tutorGuidance.visualActionGuide}
            </p>
          </div>
        )}

        {/* PHẢN HỒI SAU KHI BẤM KIỂM TRA (Progressive Disclosure) */}
        {evaluation && (
          <div
            className={`rounded-2xl p-4 sm:p-5 border-2 space-y-3 ${
              evaluation.isCorrect
                ? 'bg-[#EFFAF6] border-[#A7DCCB] text-[#263238]'
                : 'bg-[#FDF2F7] border-[#F5B8D1] text-[#263238]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-base font-extrabold">
                  {evaluation.isCorrect
                    ? '🎉 Chính xác! Con làm tốt lắm!'
                    : '🤔 Chưa đúng rồi, con thử điều chỉnh lại mô hình nhé!'}
                </div>
                <p className="text-sm text-[#263238] mt-1">
                  {evaluation.encouragement}
                </p>
              </div>

              {/* Khi hoàn thành nhiệm vụ: hiển thị nút "Học tiếp" rõ ràng */}
              {evaluation.isCorrect && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isLastTask) {
                      handleSelectTask(activeTaskIndex + 1);
                    } else {
                      onNextLesson();
                    }
                  }}
                  className="shrink-0 rounded-2xl bg-[#263238] hover:bg-[#37474F] text-white px-6 py-3 text-sm font-extrabold min-h-[48px]"
                >
                  {!isLastTask ? 'Học tiếp →' : 'Bài tiếp theo →'}
                </button>
              )}
            </div>

            {/* Nút mở giải thích từng bước & câu hỏi hiểu sâu */}
            <div className="pt-2 border-t border-[#263238]/10">
              <button
                type="button"
                onClick={() => setShowStepExplanation((v) => !v)}
                className="text-xs font-extrabold text-[#263238] underline"
              >
                {showStepExplanation
                  ? 'Ẩn giải thích từng bước'
                  : 'Xem giải thích từng bước & Vì sao đúng'}
              </button>

              {showStepExplanation && (
                <div className="mt-3 space-y-3 rounded-xl bg-white p-3.5 border border-[#E6E4DD]">
                  <div className="text-xs text-[#263238]">
                    <strong>Giải thích từng bước:</strong>{' '}
                    {evaluation.mathematicalProof}
                  </div>

                  {/* Câu hỏi suy ngẫm ngắn giúp hiểu bản chất */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E6E4DD]">
                    <div className="text-xs font-extrabold text-[#263238]">
                      Vì sao đáp án này đúng?
                    </div>
                    {currentTask.reflectionChoices.map((choice) => {
                      const isSelected = selectedReflectionId === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => handleVerifyConceptReflection(choice)}
                          className={`w-full rounded-xl p-2.5 text-left text-xs border transition-colors ${
                            isSelected
                              ? choice.isConceptualCorrect
                                ? 'bg-[#EFFAF6] border-[#A7DCCB] font-bold text-[#263238]'
                                : 'bg-[#FDF2F7] border-[#F5B8D1] text-[#263238]'
                              : 'bg-[#FAF9F6] border-[#E6E4DD] text-[#263238]'
                          }`}
                        >
                          <div>{choice.text}</div>
                          {isSelected && (
                            <div className="mt-1 text-[11px] text-[#546E7A]">
                              {choice.feedback}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 4. BẢNG KIẾN THỨC BỔ SUNG (Mặc định đóng gọn để không gây rối)       */}
      {/* ==================================================================== */}
      <details className="lg-card p-4 group">
        <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-bold text-[#546E7A] min-h-[36px]">
          <span>📖 Xem kiến thức bổ sung & lưu ý khoa học</span>
          <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-[#E6E4DD] space-y-3 text-xs text-[#263238]">
          <div className="space-y-1.5">
            <div className="font-extrabold">Tóm tắt nhanh:</div>
            <ul className="list-disc pl-5 space-y-1 text-[#546E7A]">
              {lesson.visualSummaryPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-[#EFFAF6] p-3 space-y-1">
            <div className="font-extrabold">Kiến thức khoa học thực tế</div>
            <p className="text-[#546E7A]">{lesson.scientificFactNote}</p>
          </div>
          <div className="rounded-xl bg-[#F3EFFE] p-3 space-y-1">
            <div className="font-extrabold">Lưu ý Mô hình đơn giản hóa</div>
            <p className="text-[#546E7A]">{lesson.modelSimplificationNote}</p>
          </div>
          <div className="text-[11px] text-[#546E7A]">
            Trợ giảng Gợi mở Socratic luôn đồng hành khi con bấm nút &ldquo;Con cần gợi ý?&rdquo;.
          </div>
        </div>
      </details>
    </div>
  );
};
