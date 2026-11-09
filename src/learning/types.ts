// ============================================================================
// Little Genius – Focused Learning System: Kiểu dữ liệu cốt lõi
// 5 môn chính × 8 chủ đề × 3 bài = 120 bài học (xây dựng theo từng đợt)
// Mọi bài tập đều là dữ liệu thuần (JSON-serializable) để lưu D1 / content_versions
// ============================================================================

export type FocusSubjectId = 'math' | 'vietnamese' | 'english' | 'science' | 'logic';

/**
 * Giai đoạn trong bài học (Chế độ B – Học từng bước):
 * warmup (khởi động dễ) → practice (thực hành vừa) → applied (vận dụng)
 * → advanced (thử thách khó / tư duy nâng cao) → creative (sáng tạo) → review (hiểu bài)
 */
export type TaskStage = 'warmup' | 'practice' | 'applied' | 'advanced' | 'creative' | 'review';

export const STAGE_ORDER: TaskStage[] = [
  'warmup',
  'practice',
  'applied',
  'advanced',
  'creative',
  'review',
];

/**
 * 4 tầng gợi ý từ khó xuống dễ (Chế độ A – Thử thách trước):
 * [0] Câu hỏi định hướng, [1] Ví dụ tương tự, [2] Chia thành các bước nhỏ, [3] Minh họa trực quan
 */
export type HintLadder = [string, string, string, string];

export type LearningMode = 'challenge_first' | 'step_by_step';

export interface AudioClip {
  text: string;
  lang: 'en-US' | 'vi-VN';
}

interface TaskBase {
  id: string;
  stage: TaskStage;
  /** Câu hỏi chính, ngắn gọn (một câu hỏi trên màn hình) */
  prompt: string;
  /** Mã kỹ năng, ví dụ "math.division.equal-groups" */
  skill: string;
  hints: HintLadder;
  /** Giải thích ngắn sau khi làm xong (vì sao đúng) */
  explanation: string;
  /** Hình minh họa giúp hiểu bài (emoji / sơ đồ chữ ngắn) */
  visual?: string;
  /** Đoạn văn đọc hiểu đi kèm */
  passage?: string;
  /** Âm thanh nghe hiểu (đọc bằng TTS của thiết bị, luôn có chữ dự phòng) */
  audio?: AudioClip;
  /** Câu tương đương để bé tự giải lại sau khi đã nhận gợi ý */
  twin?: FocusTask;
}

export interface MultipleChoiceTask extends TaskBase {
  kind: 'multiple_choice';
  options: string[];
  answer: number;
  /** Phản hồi riêng cho từng lựa chọn sai (chẩn đoán lỗi) */
  optionFeedback?: string[];
}

export interface MultipleSelectTask extends TaskBase {
  kind: 'multiple_select';
  options: string[];
  answers: number[];
}

export interface FillBlankTask extends TaskBase {
  kind: 'fill_blank';
  /** Câu có các chỗ trống "___" */
  text: string;
  /** Mỗi chỗ trống có danh sách đáp án chấp nhận (không phân biệt hoa thường, khoảng trắng) */
  blanks: string[][];
  wordBank?: string[];
}

export interface NumberInputTask extends TaskBase {
  kind: 'number_input';
  answer: number;
  unit?: string;
  /** Biểu thức số học kiểm chứng đáp án, ví dụ "24 / 6" (bắt buộc với môn Toán) */
  expr?: string;
}

export interface VisualCountingTask extends TaskBase {
  kind: 'visual_counting';
  groups: { emoji: string; count: number; label?: string }[];
  answer: number;
  expr?: string;
}

export interface MatchingTask extends TaskBase {
  kind: 'matching';
  /** Cặp đúng [trái, phải] */
  pairs: [string, string][];
}

export interface OrderTask extends TaskBase {
  kind: 'order';
  /** Các mục theo đúng thứ tự (giao diện tự xáo trộn) */
  items: string[];
}

export interface DragDropTask extends TaskBase {
  kind: 'drag_drop';
  bins: string[];
  items: { label: string; bin: number }[];
}

export interface GroupingTask extends TaskBase {
  kind: 'grouping';
  emoji: string;
  total: number;
  perGroup: number;
  /** true: hỏi số nhóm cần để chứa hết (làm tròn lên) */
  roundUp?: boolean;
  /** true: hỏi thêm số dư */
  askRemainder?: boolean;
  groupLabel?: string;
}

export interface GeometryTask extends TaskBase {
  kind: 'geometry';
  target: { area?: number; perimeter?: number };
  maxSide: number;
}

export interface FractionTask extends TaskBase {
  kind: 'fraction';
  target: { num: number; den: number };
  /** Cố định số phần chia; nếu bỏ trống, bé tự chọn số phần (2–12) */
  fixedParts?: number;
  shape?: 'circle' | 'bar';
}

export interface FindMistakeTask extends TaskBase {
  kind: 'find_mistake';
  lines: string[];
  wrongLine: number;
  /** Đáp án sửa lại cho dòng sai (chấp nhận nhiều cách viết) */
  fix?: string[];
}

export interface PatternTask extends TaskBase {
  kind: 'pattern';
  /** null là ô cần điền */
  sequence: (string | number | null)[];
  answers: string[][];
  choices?: string[];
}

export interface LogicGridTask extends TaskBase {
  kind: 'logic_grid';
  /** Lưới 4×4 (khối 2×2), 0 = ô trống */
  givens: number[][];
  solution: number[][];
  symbols?: string[];
}

export interface MazeTask extends TaskBase {
  kind: 'maze';
  /** 'S' xuất phát, 'E' đích, '#' tường, '.' đường đi */
  grid: string[];
  /** Giới hạn số bước (thường là đường ngắn nhất + dư) */
  maxSteps?: number;
}

export interface ExperimentTask extends TaskBase {
  kind: 'experiment';
  controls: { id: string; label: string; options: string[] }[];
  /** Khóa = chỉ số lựa chọn nối bằng "-", ví dụ "2-1" */
  outcomes: Record<string, { emoji: string; text: string }>;
  /** Cấu hình cần tìm (nếu có) */
  targetKeys?: string[];
  /** Câu hỏi kết luận sau khi thử nghiệm (nếu có) */
  question?: { prompt: string; options: string[]; answer: number };
  /** Lưu ý: mô hình đơn giản hóa, không phải số liệu thực tế chính xác */
  modelNote: string;
}

export interface StepReasoningTask extends TaskBase {
  kind: 'step_reasoning';
  steps: { label: string; answer: number; unit?: string; expr?: string }[];
}

export interface OpenWritingTask extends TaskBase {
  kind: 'open_writing';
  minWords: number;
  /** Tiêu chí rubric – mỗi tiêu chí đạt nếu chứa một trong các từ khóa (hoặc luôn đạt nếu không có từ khóa) */
  rubric: { label: string; keywordsAny?: string[] }[];
  minCriteria: number;
  sampleAnswer: string;
}

export type ConstructionSpec =
  | {
      mode: 'sum_target';
      items: { label: string; emoji: string; value: number }[];
      target: number;
      maxEach: number;
      unit?: string;
    }
  | {
      mode: 'sequence_rule';
      length: number;
      rule: 'arithmetic' | 'geometric' | 'any_constant_step';
      /** Bước nhảy tối thiểu (khác 0) */
      minStep?: number;
    };

export interface CreativeConstructionTask extends TaskBase {
  kind: 'creative_construction';
  spec: ConstructionSpec;
}

export interface LetterTilesTask extends TaskBase {
  kind: 'letter_tiles';
  tiles: string[];
  /** Các từ hợp lệ có thể ghép được */
  answers: string[];
}

export interface EvidenceTask extends TaskBase {
  kind: 'evidence';
  sentences: string[];
  /** Bất kỳ câu nào trong danh sách này đều là bằng chứng hợp lệ */
  acceptable: number[];
}

export type ScenePosition = 'on' | 'in' | 'under' | 'next_to' | 'behind';

export interface PositionSceneTask extends TaskBase {
  kind: 'position_scene';
  subjectEmoji: string;
  subjectName: string;
  refEmoji: string;
  refName: string;
  positions: ScenePosition[];
  answer: ScenePosition;
}

export type FocusTask =
  | MultipleChoiceTask
  | MultipleSelectTask
  | FillBlankTask
  | NumberInputTask
  | VisualCountingTask
  | MatchingTask
  | OrderTask
  | DragDropTask
  | GroupingTask
  | GeometryTask
  | FractionTask
  | FindMistakeTask
  | PatternTask
  | LogicGridTask
  | MazeTask
  | ExperimentTask
  | StepReasoningTask
  | OpenWritingTask
  | CreativeConstructionTask
  | LetterTilesTask
  | EvidenceTask
  | PositionSceneTask;

export type FocusTaskKind = FocusTask['kind'];

export interface FocusLesson {
  id: string;
  subject: FocusSubjectId;
  topicId: string;
  title: string;
  grade: 3 | 4 | 5;
  minutes: number;
  skills: string[];
  /** 1. Khơi gợi tò mò */
  curiosity: { emoji: string; question: string };
  /** 2. Khám phá kiến thức (tối đa 3 ý ngắn + hình minh họa) */
  discover: { points: string[]; visual: string };
  /** 3–6. Thực hành, Tư duy nâng cao, Sáng tạo, Hiểu bài (8–12 nhiệm vụ) */
  tasks: FocusTask[];
  /** Nhiệm vụ dùng làm "Thử thách trước" trong Chế độ A (phải có twin) */
  challengeTaskId: string;
}

export interface FocusLessonPlan {
  id: string;
  title: string;
  objective: string;
}

export interface FocusTopic {
  id: string;
  subject: FocusSubjectId;
  order: number;
  title: string;
  icon: string;
  lessons: [FocusLessonPlan, FocusLessonPlan, FocusLessonPlan];
}

export interface FocusSubjectMeta {
  id: FocusSubjectId;
  name: string;
  icon: string;
  color: string;
  soft: string;
  border: string;
}

// ---------------------------------------------------------------------------
// Phản hồi (response) của học sinh cho từng loại bài
// ---------------------------------------------------------------------------
export type TaskResponse =
  | { kind: 'multiple_choice'; choice: number | null }
  | { kind: 'multiple_select'; choices: number[] }
  | { kind: 'fill_blank'; values: string[] }
  | { kind: 'number_input'; value: string }
  | { kind: 'visual_counting'; value: string }
  | { kind: 'matching'; map: Record<number, number> }
  | { kind: 'order'; order: number[] }
  | { kind: 'drag_drop'; placement: Record<number, number> }
  | { kind: 'grouping'; groups: string; remainder: string; placed: number }
  | { kind: 'geometry'; width: number; height: number }
  | { kind: 'fraction'; parts: number; shaded: number[] }
  | { kind: 'find_mistake'; line: number | null; fix: string }
  | { kind: 'pattern'; values: string[] }
  | { kind: 'logic_grid'; grid: number[][] }
  | { kind: 'maze'; moves: ('U' | 'D' | 'L' | 'R')[] }
  | { kind: 'experiment'; config: number[]; choice: number | null; trials: number }
  | { kind: 'step_reasoning'; values: string[] }
  | { kind: 'open_writing'; text: string }
  | { kind: 'creative_construction'; counts?: number[]; numbers?: string[] }
  | { kind: 'letter_tiles'; picked: number[] }
  | { kind: 'evidence'; selected: number | null }
  | { kind: 'position_scene'; position: ScenePosition | null };

export type GradeStatus = 'correct' | 'incorrect' | 'accepted' | 'incomplete';

export interface GradeResult {
  status: GradeStatus;
  /** Phản hồi ngắn, thân thiện cho trẻ */
  feedback: string;
  /** Mã lỗi thường gặp (để cá nhân hóa) */
  mistake?: string;
  /** Rubric cho bài mở */
  rubric?: { label: string; met: boolean }[];
}
