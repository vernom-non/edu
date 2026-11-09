// ============================================================================
// Little Genius (EduExplore) – Core Domain, 8-Subject Ecosystem & Cloud Types
// ============================================================================

export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type SubjectId =
  | 'math'
  | 'science'
  | 'vietnamese'
  | 'english'
  | 'history_geo_civics_it'
  | 'tech_ai_coding'
  | 'art_music_design'
  | 'logic_lifeskills_finance';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export type ContentStatus = 'draft' | 'in_review' | 'approved' | 'archived';

export type PedagogyStage =
  | 'QUAN_SAT'
  | 'TUONG_TAC'
  | 'SUY_LUAN'
  | 'THU_NGHIEM'
  | 'HIEU_BAN_CHAT'
  | 'VAN_DUNG'
  | 'SANG_TAO';

export type MasteryLevel =
  | 'not_started'
  | 'needs_practice'
  | 'mastered_with_hints'
  | 'mastered_independently'
  | 'can_explain';

export type SimulationType =
  | 'math_fruit_addition'         // 1. Toán Lớp 1: Phép cộng kéo thả trái cây
  | 'math_clock_time'             // 2. Toán Lớp 2: Đồng hồ kim tương tác
  | 'math_fraction_cake'          // 3. Toán Lớp 3: Chia bánh phân số & phân số tương đương
  | 'science_water_cycle'         // 4. Khoa học Lớp 4: Mô phỏng vòng tuần hoàn của nước
  | 'math_geometry_area'          // 5. Toán Lớp 5: Chu vi & diện tích hình học trực quan
  | 'vietnamese_story_builder'    // 6. Tiếng Việt: Ghép từ, dựng câu & đọc hiểu tìm bằng chứng
  | 'science_plant_growth'        // 7. Khoa học: Quá trình cây phát triển (Ánh sáng & Nước)
  | 'english_room_explorer'       // 8. Tiếng Anh: Căn phòng tương tác & hội thoại tình huống
  | 'social_vietnam_map'          // 9. Lịch sử - Địa lý - Thế giới: Bản đồ VN & Thế giới
  | 'tech_ai_pattern_lab'         // 10. Công nghệ, AI & Lập trình: Huấn luyện AI & Gỡ lỗi thuật toán
  | 'art_color_symmetry_studio'   // 11. Nghệ thuật, Âm nhạc & Thiết kế: Pha màu Pastel, Đối xứng & Nhịp điệu
  | 'finance_smart_budget_lab';   // 12. Logic, Kỹ năng sống & Tài chính: Cần vs Muốn & Ngân sách thông thái

export interface SubjectMeta {
  id: SubjectId;
  code: string;
  name: string;
  labTitle: string;
  description: string;
  accentColor: string;
  bgSoft: string;
  borderSoft: string;
  badgeText: string;
  relatedSubjects: SubjectId[];
}

export interface CurriculumTopicNode {
  id: string;
  subjectId: SubjectId;
  title: string;
  minAge: number;
  gradeBand: string;
  summary: string;
  lessons: {
    id: string;
    title: string;
    grade: GradeLevel;
    objective: string;
    linkedInteractiveLessonId: string;
    tiers: {
      basic: string;
      applied: string;
      reasoning: string;
      creative: string;
    };
  }[];
}

export interface GradeMeta {
  id: GradeLevel;
  name: string;
  ageRange: string;
  tagline: string;
  focusSkills: string[];
}

export interface LearningOutcome {
  id: string;
  code: string;
  description: string;
  stage: PedagogyStage;
}

export interface SocraticStep {
  level: 1 | 2 | 3 | 4;
  stageLabel: string;
  questionPrompt: string;
  visualActionSuggestion: string;
}

export type ValidatorType =
  | 'fruit_sum'
  | 'clock_time'
  | 'fraction_value'
  | 'water_cycle_state'
  | 'geometry_rect'
  | 'vietnamese_sentence'
  | 'plant_optimal'
  | 'english_situational'
  | 'vietnam_region_ethics'
  | 'tech_ai_classifier'
  | 'art_symmetry_mix'
  | 'finance_budget_balance';

export interface LessonTask {
  id: string;
  title: string;
  pedagogyStage: PedagogyStage;
  instruction: string;
  question: string;
  targetDescription: string;
  validatorType: ValidatorType;
  expectedConfig: Record<string, number | string | boolean | string[]>;
  socraticHints: SocraticStep[];
  coreEssenceExplanation: string;
  whyItWorks: string;
  reflectionChoices: {
    id: string;
    text: string;
    isConceptualCorrect: boolean;
    feedback: string;
  }[];
}

export interface Lesson {
  id: string;
  slug: string;
  grade: GradeLevel;
  minAge?: number;
  subjectId: SubjectId;
  topicTitle: string;
  title: string;
  subtitle: string;
  simulationType: SimulationType;
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3;
  version: string;
  status: ContentStatus;
  prerequisiteLessonId?: string;
  prerequisiteKnowledge?: string;
  evaluationCriteria?: string;
  relatedSubjects?: SubjectId[];
  visualSummaryPoints: string[];
  scientificFactNote: string;
  modelSimplificationNote: string;
  learningOutcomes: LearningOutcome[];
  initialSimulationState: Record<string, unknown>;
  tasks: LessonTask[];
}

export interface LessonProgressRecord {
  lessonId: string;
  mastery: MasteryLevel;
  completedTaskIds: string[];
  attemptsCount: number;
  correctFirstTryCount: number;
  hintsUsedCount: number;
  canExplainVerified: boolean;
  studentReflectionText?: string;
  commonMistakes: string[];
  timeSpentSeconds: number;
  lastUpdated: string;
  versionVector?: number;
}

export type CompanionAvatarId =
  | 'scientist_linh'
  | 'astronaut_mai'
  | 'engineer_an'
  | 'artist_chau';

export interface ScientistNoteEntry {
  id: string;
  title: string;
  category: string;
  observation: string;
  createdAt: string;
}

export interface CreativeProjectRecord {
  projectCode:
    | 'my_garden'
    | 'bakery_shop'
    | 'future_city'
    | 'space_explorer'
    | 'little_inventor';
  title: string;
  status: 'in_progress' | 'completed';
  data: Record<string, unknown>;
  journal: string;
  updatedAt: string;
}

export interface HealthyAchievement {
  code: string;
  title: string;
  specificPraise: string;
  awardedAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  age?: number;
  currentGrade: GradeLevel;
  role: UserRole;
  avatarId?: CompanionAvatarId;
  pastelTheme?: 'lavender_mint' | 'peach_sky' | 'rose_lemon';
  dailyLimitMinutes: number;
  todayMinutesUsed: number;
  accessibility: {
    voiceGuide: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    highContrast: boolean;
    focusMode: boolean;
  };
  progressMap: Record<string, LessonProgressRecord>;
  notebookEntries?: ScientistNoteEntry[];
  creativeProjects?: Record<string, CreativeProjectRecord>;
  achievements?: HealthyAchievement[];
}
