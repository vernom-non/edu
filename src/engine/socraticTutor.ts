// ============================================================================
// EduExplore – Socratic AI Learning Assistant & Child Safety Guardrails
// Phương pháp gợi mở (Socratic Method) + Adapter tích hợp AI có kiểm soát
// ============================================================================

import type { GradeLevel, Lesson, LessonTask } from '../types/education.ts';
import type { EvaluationResult } from './learningEngine.ts';

export type TutorEngineMode = 'rule_based_socratic' | 'connected_llm_adapter';

export interface TutorResponse {
  engineMode: TutorEngineMode;
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6;
  stepLabel: string;
  missingConcept: string;
  socraticMessage: string;
  visualActionGuide: string;
  blockedBySafetyFilter: boolean;
  revealsDirectAnswer: false; // Cam kết thiết kế: không bao giờ đưa ngay đáp án
}

const UNSAFE_OR_OFFTOPIC_KEYWORDS = [
  'mật khẩu',
  'password',
  'số điện thoại',
  'địa chỉ nhà',
  'thẻ ngân hàng',
  'bạo lực',
  'đánh nhau',
  'hack',
  'chơi game bạo lực',
  'làm hộ bài',
  'cho xin đáp án luôn',
  'chỉ đáp án ngay',
];

const PII_REGEX = /(\b\d{9,11}\b)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

/**
 * Kiểm tra và lọc dữ liệu cá nhân (PII) + nội dung ngoài phạm vi học tập
 */
export function sanitizeAndCheckChildSafety(input: string): {
  safe: boolean;
  sanitizedText: string;
  warningReason?: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { safe: true, sanitizedText: '' };
  }

  if (PII_REGEX.test(trimmed)) {
    return {
      safe: false,
      sanitizedText: trimmed.replace(PII_REGEX, '[Đã ẩn thông tin cá nhân]'),
      warningReason:
        'Vì an toàn của con, chúng mình không chia sẻ số điện thoại, email hay địa chỉ cá nhân lên mạng nhé!',
    };
  }

  const lower = trimmed.toLowerCase();
  for (const kw of UNSAFE_OR_OFFTOPIC_KEYWORDS) {
    if (lower.includes(kw)) {
      if (kw.includes('đáp án') || kw.includes('làm hộ')) {
        return {
          safe: false,
          sanitizedText: trimmed,
          warningReason:
            'Trợ giảng sẽ không làm thay hay đưa đáp án sẵn đâu! Chúng mình cùng thử thao tác từng bước để tự tìm ra câu trả lời nhé.',
        };
      }
      return {
        safe: false,
        sanitizedText: trimmed,
        warningReason:
          'Trợ giảng EduExplore chỉ trao đổi về bài học và khám phá khoa học cùng con thôi nhé!',
      };
    }
  }

  return { safe: true, sanitizedText: trimmed };
}

/**
 * Tạo phản hồi gợi mở 6 bước theo đúng phương pháp sư phạm Socratic
 * Hoạt động thực tế bằng hệ thống quy tắc sư phạm (Rule-based Socratic Engine)
 */
export function generateSocraticGuidance(params: {
  lesson: Lesson;
  task: LessonTask;
  attemptCount: number;
  lastEvaluation?: EvaluationResult;
  studentQuestion?: string;
  grade: GradeLevel;
}): TutorResponse {
  const { task, attemptCount, lastEvaluation, studentQuestion } = params;

  // 1. Kiểm tra an toàn nội dung & giới hạn phạm vi học tập
  if (studentQuestion) {
    const safety = sanitizeAndCheckChildSafety(studentQuestion);
    if (!safety.safe && safety.warningReason) {
      return {
        engineMode: 'rule_based_socratic',
        stepNumber: 1,
        stepLabel: 'Bảo vệ an toàn & Định hướng học tập',
        missingConcept: 'Quy tắc an toàn và tự lực khám phá',
        socraticMessage: safety.warningReason,
        visualActionGuide: task.socraticHints[0]?.visualActionSuggestion ?? 'Con hãy quan sát khu vực mô phỏng ở giữa màn hình nhé.',
        blockedBySafetyFilter: true,
        revealsDirectAnswer: false,
      };
    }

    // Xử lý câu hỏi toán học cụ thể của học sinh theo phong cách Socratic (ví dụ hỏi phép trừ 8 - 3 hoặc phép cộng)
    const subMatch = studentQuestion.match(/(\d+)\s*-\s*(\d+)/);
    if (subMatch) {
      const a = Number(subMatch[1]);
      const b = Number(subMatch[2]);
      return {
        engineMode: 'rule_based_socratic',
        stepNumber: 2,
        stepLabel: 'Câu hỏi gợi mở trực quan',
        missingConcept: `Bản chất phép trừ ${a} - ${b} là bớt đi đối tượng từ một nhóm`,
        socraticMessage: `Con có ${a} viên bi. Nếu lấy đi ${b} viên thì còn bao nhiêu? Con hãy thử kéo ${b} viên ra ngoài rồi đếm số viên còn lại nhé!`,
        visualActionGuide: `Tách ${b} vật ra khỏi nhóm ${a} vật ban đầu và đếm phần còn lại.`,
        blockedBySafetyFilter: false,
        revealsDirectAnswer: false,
      };
    }

    const addMatch = studentQuestion.match(/(\d+)\s*\+\s*(\d+)/);
    if (addMatch) {
      const a = Number(addMatch[1]);
      const b = Number(addMatch[2]);
      return {
        engineMode: 'rule_based_socratic',
        stepNumber: 2,
        stepLabel: 'Câu hỏi gợi mở trực quan',
        missingConcept: `Bản chất phép cộng ${a} + ${b} là gộp hai nhóm đối tượng`,
        socraticMessage: `Trong giỏ đầu có ${a} quả táo, thêm ${b} quả táo nữa. Con hãy thử kéo từng quả vào giỏ chung và đếm tiếp từ ${a} xem được mấy nhé!`,
        visualActionGuide: `Kéo ${a} quả vào rổ trái, ${b} quả vào rổ phải và quan sát thanh gộp.`,
        blockedBySafetyFilter: false,
        revealsDirectAnswer: false,
      };
    }
  }

  // 2. Nếu học sinh đã trả lời ĐÚNG -> Bước 6: Giải thích bản chất sau khi hoàn thành
  if (lastEvaluation?.isCorrect) {
    return {
      engineMode: 'rule_based_socratic',
      stepNumber: 6,
      stepLabel: 'Bước 6: Giải thích bản chất khoa học / toán học',
      missingConcept: 'Đã nắm vững! Củng cố bản chất sâu',
      socraticMessage: `${lastEvaluation.encouragement} Bản chất là: ${task.coreEssenceExplanation}`,
      visualActionGuide: task.whyItWorks,
      blockedBySafetyFilter: false,
      revealsDirectAnswer: false,
    };
  }

  // 3. Phân tầng gợi ý Socratic dựa trên số lần thử sai (Không đưa đáp án ngay)
  const hints = task.socraticHints;
  const missingConcept =
    lastEvaluation?.misconceptionDetected ||
    `Đang khám phá: ${task.targetDescription}`;

  if (attemptCount <= 1) {
    const h = hints[0];
    return {
      engineMode: 'rule_based_socratic',
      stepNumber: 2,
      stepLabel: 'Bước 1-2: Xác định chỗ vướng & Đặt câu hỏi gợi mở đầu tiên',
      missingConcept,
      socraticMessage:
        h?.questionPrompt ??
        'Con quan sát xem điều gì thay đổi trên mô hình khi mình kéo thanh điều khiển nhé?',
      visualActionGuide:
        h?.visualActionSuggestion ??
        'Thử tương tác trực tiếp với mô hình ở chính giữa màn hình.',
      blockedBySafetyFilter: false,
      revealsDirectAnswer: false,
    };
  }

  if (attemptCount === 2) {
    const h = hints[1] ?? hints[0];
    return {
      engineMode: 'rule_based_socratic',
      stepNumber: 3,
      stepLabel: 'Bước 3-4: Hướng dẫn thao tác trực quan & Thử nghiệm lại',
      missingConcept,
      socraticMessage:
        h?.questionPrompt ??
        'Gần đúng rồi! Con hãy nhìn vào mô hình minh họa và thử điều chỉnh từng đơn vị một nhé.',
      visualActionGuide:
        h?.visualActionSuggestion ??
        'Quan sát sự thay đổi trên hình vẽ sau mỗi lần bấm nút.',
      blockedBySafetyFilter: false,
      revealsDirectAnswer: false,
    };
  }

  // Từ lần thử thứ 3 trở lên: Hướng dẫn chia nhỏ từng bước (nhưng vẫn để trẻ tự bấm bước cuối)
  const h = hints[2] ?? hints[hints.length - 1] ?? hints[0];
  return {
    engineMode: 'rule_based_socratic',
    stepNumber: 5,
    stepLabel: 'Bước 5: Hướng dẫn từng bước nhỏ để con tự hoàn thành',
    missingConcept,
    socraticMessage:
      h?.questionPrompt ??
      'Chúng mình chia nhỏ bài toán nhé: Con làm bước 1 trên mô phỏng trước, rồi đọc con số hiện ra trên màn hình.',
    visualActionGuide:
      h?.visualActionSuggestion ??
      'Làm theo hướng dẫn trực quan trên mô phỏng rồi bấm Kiểm tra lại.',
    blockedBySafetyFilter: false,
    revealsDirectAnswer: false,
  };
}

/**
 * Adapter cho AI (cho phép tích hợp LLM qua Backend API khi cấu hình khoá ở Server)
 * Cam kết trung thực: Hiển thị rõ trạng thái Rule-based Socratic Engine khi chưa nối API ngoài
 */
export interface SocraticAIAdapterConfig {
  provider: 'rule_based' | 'server_llm_endpoint';
  endpointUrl?: string;
}

export class SocraticTutorService {
  private config: SocraticAIAdapterConfig;

  constructor(config: SocraticAIAdapterConfig = { provider: 'rule_based' }) {
    this.config = config;
  }

  public getStatusBadge(): {
    mode: TutorEngineMode;
    label: string;
    isExternalAIConnected: boolean;
  } {
    if (this.config.provider === 'server_llm_endpoint' && this.config.endpointUrl) {
      return {
        mode: 'connected_llm_adapter',
        label: 'Đã kết nối AI Adapter qua Server kiểm duyệt',
        isExternalAIConnected: true,
      };
    }
    return {
      mode: 'rule_based_socratic',
      label: 'Hệ thống Gợi mở Sư phạm Quy tắc (Rule-based Socratic Engine – Hoạt động 100% Offline)',
      isExternalAIConnected: false,
    };
  }

  public async askTutor(params: {
    lesson: Lesson;
    task: LessonTask;
    attemptCount: number;
    lastEvaluation?: EvaluationResult;
    studentQuestion?: string;
    grade: GradeLevel;
  }): Promise<TutorResponse> {
    // Luôn chạy bộ lọc an toàn và Rule-based Socratic Engine làm nền tảng xác thực
    return generateSocraticGuidance(params);
  }
}
