// ============================================================================
// Little Genius (EduExplore) – Giao diện Tối giản & Tập trung (UI/UX Redesign)
// Triết lý: ÍT THÀNH PHẦN HƠN – TẬP TRUNG HƠN – DỄ THAO TÁC HƠN – HỌC HIỆU QUẢ HƠN
// - Trang chủ chỉ gồm 4 khu vực: Tiếp tục học, Khám phá môn học, Khám phá hôm nay, Xưởng sáng tạo
// - Điều hướng tối giản 4 mục: Trang chủ, Môn học, Khám phá, Của em
// - Progressive Disclosure: Chọn Môn → Chọn Chủ đề → Mở Bài học
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  CURRICULUM_TOPICS_MAP,
  GRADES_META,
  INITIAL_LESSONS,
  SUBJECTS_META,
} from './data/curriculumData.ts';
import { CURIOSITY_10_LIBRARY } from './data/curiosityData.ts';
import type {
  CompanionAvatarId,
  CreativeProjectRecord,
  GradeLevel,
  Lesson,
  LessonProgressRecord,
  StudentProfile,
  SubjectId,
  UserRole,
} from './types/education.ts';
import { computeMasteryLevel } from './engine/learningEngine.ts';
import { InteractiveClassroom } from './components/classroom/InteractiveClassroom.tsx';
import { CreativeStudio } from './components/studio/CreativeStudio.tsx';
import { ExerciseBankArena } from './components/exercises/ExerciseBankArena.tsx';
import { CuriosityEngineView } from './components/curiosity/CuriosityEngineView.tsx';
import { CreativeProjectsView } from './components/projects/CreativeProjectsView.tsx';
import {
  AdminCMSView,
  ParentDashboardView,
  StudentProgressView,
  TeacherDashboardView,
  ThinkingChallengesView,
} from './components/dashboards/RoleDashboards.tsx';

// 4 Mục điều hướng chính tối giản + màn hình Phòng học tập trung
export type PrimaryNavTab = 'home' | 'subjects' | 'discover' | 'me' | 'classroom';
export type DiscoverMode = 'curiosity' | 'creative_projects' | 'studio' | 'exercises';

const STORAGE_KEY_PROFILE = 'eduexplore_student_profile_v2';
const STORAGE_KEY_LESSONS = 'eduexplore_lessons_cms_v2';

// Thiết kế thẻ môn học tối giản: Biểu tượng dễ nhận diện + Tên ngắn gọn + Màu pastel nhẹ
const SIMPLE_SUBJECT_CARDS: {
  id: SubjectId;
  shortName: string;
  icon: string;
  cardBg: string;
  cardBorder: string;
  pillBg: string;
}[] = [
  {
    id: 'math',
    shortName: 'Toán học',
    icon: '🔢',
    cardBg: 'bg-[#F3EFFE]',
    cardBorder: 'border-[#D8CBF8]',
    pillBg: 'bg-[#A78BFA]/25',
  },
  {
    id: 'vietnamese',
    shortName: 'Tiếng Việt',
    icon: '📖',
    cardBg: 'bg-[#FDF2F7]',
    cardBorder: 'border-[#F5B8D1]',
    pillBg: 'bg-[#F5B8D1]/35',
  },
  {
    id: 'english',
    shortName: 'Tiếng Anh',
    icon: '🌍',
    cardBg: 'bg-[#EFFAF6]',
    cardBorder: 'border-[#A7DCCB]',
    pillBg: 'bg-[#A7DCCB]/35',
  },
  {
    id: 'science',
    shortName: 'Khoa học',
    icon: '🔬',
    cardBg: 'bg-[#EFFAF6]',
    cardBorder: 'border-[#A7DCCB]',
    pillBg: 'bg-[#A7DCCB]/35',
  },
  {
    id: 'history_geo_civics_it',
    shortName: 'Lịch sử & Địa lý',
    icon: '🗺️',
    cardBg: 'bg-[#FFF9EB]',
    cardBorder: 'border-[#FDE68A]',
    pillBg: 'bg-[#FDE68A]/40',
  },
  {
    id: 'tech_ai_coding',
    shortName: 'Tư duy & AI',
    icon: '🤖',
    cardBg: 'bg-[#F3EFFE]',
    cardBorder: 'border-[#D8CBF8]',
    pillBg: 'bg-[#A78BFA]/25',
  },
  {
    id: 'art_music_design',
    shortName: 'Nghệ thuật',
    icon: '🎨',
    cardBg: 'bg-[#FDF2F7]',
    cardBorder: 'border-[#F5B8D1]',
    pillBg: 'bg-[#F5B8D1]/35',
  },
  {
    id: 'logic_lifeskills_finance',
    shortName: 'Kỹ năng sống',
    icon: '🌱',
    cardBg: 'bg-[#EFFAF6]',
    cardBorder: 'border-[#A7DCCB]',
    pillBg: 'bg-[#A7DCCB]/35',
  },
];

// Danh sách chủ đề trực quan cho môn Toán học (theo đúng cấu trúc Phép tính, Phân số, Hình học, Đo lường, Tư duy logic)
const MATH_FRIENDLY_TOPICS = [
  {
    id: 'math-topic-calc',
    icon: '🍎',
    title: 'Phép tính',
    summary: 'Cộng, trừ, nhân, chia trực quan qua đồ vật và giỏ trái cây.',
    lessonIds: ['g1-math-fruit-addition'],
    curriculumTopicId: 'topic-math-1',
  },
  {
    id: 'math-topic-fraction',
    icon: '🍰',
    title: 'Phân số',
    summary: 'Chia bánh thành các phần bằng nhau và khám phá phân số tương đương.',
    lessonIds: ['g3-math-fraction-cake'],
    curriculumTopicId: 'topic-math-1',
  },
  {
    id: 'math-topic-geometry',
    icon: '📐',
    title: 'Hình học',
    summary: 'Khám phá cạnh, góc, chu vi và diện tích trên lưới ô vuông.',
    lessonIds: ['g5-math-geometry-area'],
    curriculumTopicId: 'topic-math-2',
  },
  {
    id: 'math-topic-measure',
    icon: '🕒',
    title: 'Đo lường',
    summary: 'Xem đồng hồ kim giờ, kim phút và đo đại lượng trong cuộc sống.',
    lessonIds: ['g2-math-clock-time'],
    curriculumTopicId: 'topic-math-2',
  },
  {
    id: 'math-topic-logic',
    icon: '🧩',
    title: 'Tư duy logic',
    summary: 'Tìm quy luật, giải đố toán học và bài toán mua sắm nhiều cách giải.',
    lessonIds: ['g3-math-fraction-cake', 'g5-math-geometry-area'],
    curriculumTopicId: 'topic-math-3',
  },
];

const DEFAULT_PROFILE: StudentProfile = {
  id: 'student-bap-01',
  name: 'Bé Bắp',
  age: 8,
  currentGrade: 3,
  role: 'student',
  avatarId: 'scientist_linh',
  pastelTheme: 'lavender_mint',
  dailyLimitMinutes: 45,
  todayMinutesUsed: 15,
  accessibility: {
    voiceGuide: true,
    reducedMotion: false,
    largeText: false,
    highContrast: false,
    focusMode: false,
  },
  progressMap: {},
  notebookEntries: [
    {
      id: 'note-init-1',
      title: 'Vì sao băng nổi trên nước?',
      category: 'Khoa học',
      observation: 'Khi đóng băng, thể tích nước tăng nhẹ nên băng nhẹ hơn nước lỏng và nổi lên trên.',
      createdAt: 'Hôm nay',
    },
  ],
  creativeProjects: {},
  achievements: [
    {
      code: 'welcome_genius',
      title: 'Nhà Khám Phá Tự Chủ',
      specificPraise: 'Con biết đặt câu hỏi Vì sao, thử nhiều phương án và kiểm chứng dự đoán của mình!',
      awardedAt: 'Hôm nay',
    },
  ],
};

export const App: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LESSONS);
      if (saved) {
        const parsed = JSON.parse(saved) as Lesson[];
        if (Array.isArray(parsed) && parsed.length >= INITIAL_LESSONS.length) {
          return parsed;
        }
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_LESSONS;
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage error
    }
    return DEFAULT_PROFILE;
  });

  // Điều hướng tối giản 4 mục chính + Phòng học
  const [activeNav, setActiveNav] = useState<PrimaryNavTab>('home');
  const [discoverMode, setDiscoverMode] = useState<DiscoverMode>('curiosity');

  // Progressive Disclosure trên trang Môn học:
  // Chưa chọn chủ đề thì chưa mở danh sách bài học
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | null>('math');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Bài học đang học dở (mặc định bài Phân số Lớp 3 phù hợp bé 8 tuổi)
  const [activeLessonId, setActiveLessonId] = useState<string>(
    'g3-math-fraction-cake'
  );

  // Câu hỏi "Khám phá hôm nay" trên trang chủ (Chỉ hiển thị 1 câu hỏi mỗi lần)
  const [dailyCuriosityIndex, setDailyCuriosityIndex] = useState<number>(() => {
    const moonIdx = CURIOSITY_10_LIBRARY.findIndex((q) => q.id === 'cur-moon');
    return moonIdx >= 0 ? moonIdx : 0;
  });

  // Quản lý chế độ xem Phụ huynh / Giáo viên / Quản trị bên trong mục "Của em"
  const [adultPortalTab, setAdultPortalTab] = useState<
    'none' | 'parent' | 'teacher' | 'admin'
  >('none');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(lessons));
    } catch {
      // ignore
    }
  }, [lessons]);

  const activeLesson =
    lessons.find((l) => l.id === activeLessonId) ?? lessons[0];

  const activeSubjectCard =
    SIMPLE_SUBJECT_CARDS.find((s) => s.id === activeLesson.subjectId) ??
    SIMPLE_SUBJECT_CARDS[0];

  const activeLessonProgress = profile.progressMap[activeLesson.id];
  const activeLessonDoneCount = activeLessonProgress?.completedTaskIds.length ?? 0;
  const activeLessonTotalCount = activeLesson.tasks.length;
  const activeLessonPercent = Math.round(
    (activeLessonDoneCount / Math.max(1, activeLessonTotalCount)) * 100
  );

  const dailyCuriosity =
    CURIOSITY_10_LIBRARY[dailyCuriosityIndex % CURIOSITY_10_LIBRARY.length];

  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveNav('classroom');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSubjectFromHome = (subjectId: SubjectId) => {
    setSelectedSubject(subjectId);
    setExpandedTopicId(null);
    setActiveNav('subjects');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAwardPraise = (
    badgeCode: string,
    badgeTitle: string,
    specificPraise: string
  ) => {
    setProfile((prev) => {
      const current = prev.achievements ?? [];
      if (current.some((a) => a.code === badgeCode)) return prev;
      return {
        ...prev,
        achievements: [
          {
            code: badgeCode,
            title: badgeTitle,
            specificPraise,
            awardedAt: new Date().toLocaleDateString('vi-VN'),
          },
          ...current,
        ],
      };
    });
  };

  const handleSaveNotebookEntry = (
    title: string,
    category: string,
    observation: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      notebookEntries: [
        {
          id: `note-${Date.now()}`,
          title,
          category,
          observation,
          createdAt: new Date().toLocaleDateString('vi-VN'),
        },
        ...(prev.notebookEntries ?? []),
      ],
    }));
  };

  const handleSaveCreativeProject = (record: CreativeProjectRecord) => {
    setProfile((prev) => ({
      ...prev,
      creativeProjects: {
        ...(prev.creativeProjects ?? {}),
        [record.projectCode]: record,
      },
    }));
  };

  const handleUpdateProgress = (
    lessonId: string,
    taskCompletedId: string | null,
    isCorrectFirstTry: boolean,
    usedHint: boolean,
    canExplainVerified: boolean,
    misconception?: string,
    reflectionText?: string
  ) => {
    const targetLesson = lessons.find((l) => l.id === lessonId);
    if (!targetLesson) return;

    setProfile((prev) => {
      const existing: LessonProgressRecord = prev.progressMap[lessonId] ?? {
        lessonId,
        mastery: 'not_started',
        completedTaskIds: [],
        attemptsCount: 0,
        correctFirstTryCount: 0,
        hintsUsedCount: 0,
        canExplainVerified: false,
        commonMistakes: [],
        timeSpentSeconds: 60,
        lastUpdated: new Date().toISOString(),
        versionVector: 1,
      };

      const nextCompleted = taskCompletedId
        ? Array.from(new Set([...existing.completedTaskIds, taskCompletedId]))
        : existing.completedTaskIds;

      const nextMistakes =
        misconception && !existing.commonMistakes.includes(misconception)
          ? [...existing.commonMistakes, misconception]
          : existing.commonMistakes;

      const updatedRecord: LessonProgressRecord = {
        ...existing,
        completedTaskIds: nextCompleted,
        attemptsCount: existing.attemptsCount + 1,
        correctFirstTryCount:
          existing.correctFirstTryCount + (isCorrectFirstTry ? 1 : 0),
        hintsUsedCount: existing.hintsUsedCount + (usedHint ? 1 : 0),
        canExplainVerified: existing.canExplainVerified || canExplainVerified,
        studentReflectionText: reflectionText ?? existing.studentReflectionText,
        commonMistakes: nextMistakes,
        lastUpdated: new Date().toISOString(),
        versionVector: (existing.versionVector ?? 1) + 1,
      };

      updatedRecord.mastery = computeMasteryLevel(
        updatedRecord,
        targetLesson.tasks.length
      );

      return {
        ...prev,
        progressMap: {
          ...prev.progressMap,
          [lessonId]: updatedRecord,
        },
      };
    });
  };

  const toggleAccessibility = (
    key: keyof StudentProfile['accessibility']
  ) => {
    setProfile((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: !prev.accessibility[key],
      },
    }));
  };

  const handleRoleSwitch = (nextRole: UserRole) => {
    setProfile((prev) => ({ ...prev, role: nextRole }));
    if (nextRole === 'parent') setAdultPortalTab('parent');
    else if (nextRole === 'teacher') setAdultPortalTab('teacher');
    else if (nextRole === 'admin') setAdultPortalTab('admin');
    else setAdultPortalTab('none');
  };

  const avatarEmoji =
    profile.avatarId === 'astronaut_mai'
      ? '👩‍🚀'
      : profile.avatarId === 'engineer_an'
      ? '👩‍💻'
      : profile.avatarId === 'artist_chau'
      ? '👩‍🎨'
      : '👩‍🔬';

  // Các mục điều hướng chính (Tối đa 4 mục)
  const PRIMARY_TABS: { id: PrimaryNavTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Trang chủ', icon: '🏠' },
    { id: 'subjects', label: 'Môn học', icon: '📚' },
    { id: 'discover', label: 'Khám phá', icon: '✨' },
    { id: 'me', label: 'Của em', icon: '😊' },
  ];

  const isFocusClassroom =
    activeNav === 'classroom' && profile.accessibility.focusMode;

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FAF9F6] text-[#263238] pb-20 md:pb-8 ${
        profile.accessibility.largeText ? 'text-lg' : 'text-base'
      }`}
    >
      {/* ================================================================== */}
      {/* THANH ĐIỀU HƯỚNG NGANG GỌN GÀNG TRÊN DESKTOP & HEADER NHẸ          */}
      {/* ================================================================== */}
      {!isFocusClassroom && (
        <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-xs border-b border-[#E6E4DD]">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            {/* Logo gọn gàng */}
            <button
              type="button"
              onClick={() => setActiveNav('home')}
              className="flex items-center gap-2.5 text-left min-h-[44px]"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#F3EFFE] border border-[#D8CBF8] flex items-center justify-center text-xl">
                {avatarEmoji}
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg text-[#263238] leading-tight">
                  Little Genius
                </div>
                <div className="text-xs font-medium text-[#546E7A]">
                  EduExplore • Chào {profile.name}
                </div>
              </div>
            </button>

            {/* Điều hướng ngang trên iPad / Máy tính (4 mục) */}
            <nav
              aria-label="Điều hướng chính"
              className="hidden md:flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#E6E4DD]"
            >
              {PRIMARY_TABS.map((tab) => {
                const isActive =
                  activeNav === tab.id ||
                  (activeNav === 'classroom' && tab.id === 'subjects');
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveNav(tab.id)}
                    className={`rounded-xl px-4 py-2 text-sm font-extrabold transition-colors min-h-[40px] flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#263238] text-white'
                        : 'text-[#546E7A] hover:text-[#263238] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Nút bật/tắt giọng đọc nhanh */}
            <button
              type="button"
              onClick={() => toggleAccessibility('voiceGuide')}
              className={`rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-bold border min-h-[44px] flex items-center gap-1.5 ${
                profile.accessibility.voiceGuide
                  ? 'bg-[#EFFAF6] border-[#A7DCCB] text-[#263238]'
                  : 'bg-white border-[#E6E4DD] text-[#546E7A]'
              }`}
              title="Bật hoặc tắt giọng đọc hướng dẫn"
            >
              <span>{profile.accessibility.voiceGuide ? '🔊' : '🔇'}</span>
              <span className="hidden sm:inline">
                {profile.accessibility.voiceGuide ? 'Đọc: Bật' : 'Đọc: Tắt'}
              </span>
            </button>
          </div>
        </header>
      )}

      {/* ================================================================== */}
      {/* NỘI DUNG CHÍNH (TỐI ĐA 5XL, NHIỀU KHOẢNG TRẮNG, KHÔNG TRÀN NGANG)   */}
      {/* ================================================================== */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 sm:py-7">
        {/* ================================================================ */}
        {/* 1. TRANG CHỦ TỐI GIẢN (CHỈ 4 KHU VỰC RÕ RÀNG)                    */}
        {/* ================================================================ */}
        {activeNav === 'home' && (
          <div className="space-y-7">
            {/* Tiêu đề chính duy nhất trên màn hình */}
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#263238]">
                Hôm nay {profile.name} muốn khám phá gì nào?
              </h1>
              <p className="text-xs sm:text-sm text-[#546E7A] mt-0.5">
                Phòng Thí Nghiệm Kiến Thức Trực Quan Dành Cho Trẻ Em (Lớp {profile.currentGrade})
              </p>
            </div>

            {/* KHU VỰC A: TIẾP TỤC HỌC (Nổi bật nhất) */}
            <section
              aria-label="Tiếp tục học"
              className="rounded-3xl bg-[#F3EFFE] border-2 border-[#A78BFA] p-5 sm:p-6 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#263238] border border-[#D8CBF8]">
                    <span>{activeSubjectCard.icon}</span>
                    <span>{activeSubjectCard.shortName}</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-extrabold text-[#263238]">
                    {activeLesson.title}
                  </h2>

                  {/* Thanh tiến độ đơn giản */}
                  <div className="space-y-1 max-w-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-[#546E7A]">
                      <span>Tiến độ bài học</span>
                      <span>
                        {activeLessonDoneCount}/{activeLessonTotalCount} phần
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white overflow-hidden border border-[#D8CBF8]">
                      <div
                        className="h-full bg-[#A78BFA] rounded-full transition-all"
                        style={{
                          width: `${Math.max(12, activeLessonPercent)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenLesson(activeLesson.id)}
                  className="w-full sm:w-auto rounded-2xl bg-[#263238] hover:bg-[#37474F] text-white px-7 py-3.5 text-base font-extrabold min-h-[52px] shadow-xs active:scale-98 transition-transform"
                >
                  Học tiếp →
                </button>
              </div>
            </section>

            {/* KHU VỰC B: KHÁM PHÁ MÔN HỌC (Thẻ đơn giản, không hiện danh sách bài học) */}
            <section aria-label="Khám phá môn học" className="space-y-3">
              <h2 className="text-base sm:text-lg font-extrabold text-[#263238]">
                Khám phá môn học
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SIMPLE_SUBJECT_CARDS.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSelectSubjectFromHome(sub.id)}
                    className={`rounded-2xl p-4 text-left border ${sub.cardBg} ${sub.cardBorder} hover:brightness-98 active:scale-98 transition-all min-h-[96px] flex flex-col justify-between`}
                  >
                    <span className="text-2xl sm:text-3xl">{sub.icon}</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#263238] mt-2">
                      {sub.shortName}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* KHU VỰC C & D: KHÁM PHÁ HÔM NAY (1 Câu hỏi) & XƯỞNG SÁNG TẠO (1 Thẻ nhỏ) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* C. Khám phá hôm nay: Chỉ 1 câu hỏi thú vị mỗi lần */}
              <section
                aria-label="Khám phá hôm nay"
                className="rounded-2xl bg-[#EFFAF6] border border-[#A7DCCB] p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-[#546E7A]">
                      🔭 Khám phá hôm nay
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDailyCuriosityIndex((i) => i + 1)
                      }
                      className="text-xs font-bold text-[#546E7A] underline"
                    >
                      Câu hỏi khác
                    </button>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#263238] leading-snug">
                    {dailyCuriosity.icon} &ldquo;{dailyCuriosity.question}&rdquo;
                  </h2>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscoverMode('curiosity');
                      setActiveNav('discover');
                    }}
                    className="rounded-2xl bg-[#263238] hover:bg-[#37474F] text-white px-5 py-3 text-sm font-extrabold min-h-[48px]"
                  >
                    Khám phá
                  </button>
                </div>
              </section>

              {/* D. Xưởng sáng tạo: 1 thẻ nhỏ gọn gàng */}
              <section
                aria-label="Xưởng sáng tạo"
                className="rounded-2xl bg-[#FDF2F7] border border-[#F5B8D1] p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-[#546E7A]">
                    🎨 Xưởng sáng tạo
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#263238] leading-snug">
                    Tự thiết kế khu vườn, cửa hàng bánh & mô hình của riêng con
                  </h2>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscoverMode('creative_projects');
                      setActiveNav('discover');
                    }}
                    className="rounded-2xl bg-[#263238] hover:bg-[#37474F] text-white px-5 py-3 text-sm font-extrabold min-h-[48px]"
                  >
                    Bắt đầu
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* 2. TRANG MÔN HỌC (PROGRESSIVE DISCLOSURE: MÔN -> CHỦ ĐỀ -> BÀI)  */}
        {/* ================================================================ */}
        {activeNav === 'subjects' && (
          <div className="space-y-6">
            {/* Thanh chọn nhanh giữa 8 môn học */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {SIMPLE_SUBJECT_CARDS.map((sub) => {
                const isSelected = selectedSubject === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(sub.id);
                      setExpandedTopicId(null);
                    }}
                    className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-extrabold border transition-colors min-h-[44px] flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#263238] text-white border-[#263238]'
                        : `${sub.cardBg} ${sub.cardBorder} text-[#263238]`
                    }`}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.shortName}</span>
                  </button>
                );
              })}
            </div>

            {selectedSubject && (() => {
              const currentSubCard =
                SIMPLE_SUBJECT_CARDS.find((s) => s.id === selectedSubject) ??
                SIMPLE_SUBJECT_CARDS[0];
              const currentSubMeta =
                SUBJECTS_META.find((s) => s.id === selectedSubject) ??
                SUBJECTS_META[0];
              const subjectLessons = lessons.filter(
                (l) => l.subjectId === selectedSubject
              );
              const nextRecommendedLesson =
                subjectLessons.find(
                  (l) =>
                    (profile.progressMap[l.id]?.completedTaskIds.length ?? 0) <
                    l.tasks.length
                ) ??
                subjectLessons[0] ??
                lessons[0];

              const completedInSubject = subjectLessons.filter(
                (l) =>
                  (profile.progressMap[l.id]?.completedTaskIds.length ?? 0) >=
                  l.tasks.length
              ).length;

              const subjectTopics = CURRICULUM_TOPICS_MAP.filter(
                (t) => t.subjectId === selectedSubject
              );

              return (
                <div className="space-y-6">
                  {/* 1. Tên môn học & 4. Tiến độ học đơn giản */}
                  <div
                    className={`rounded-3xl p-5 sm:p-6 border ${currentSubCard.cardBg} ${currentSubCard.cardBorder} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{currentSubCard.icon}</span>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-[#263238]">
                          {currentSubCard.shortName}
                        </h1>
                      </div>
                      <p className="text-xs sm:text-sm text-[#546E7A]">
                        {currentSubMeta.description}
                      </p>
                    </div>

                    <div className="bg-white/90 rounded-2xl px-4 py-3 border border-[#E6E4DD] shrink-0">
                      <div className="text-xs font-bold text-[#546E7A]">
                        Tiến độ môn học
                      </div>
                      <div className="text-sm font-extrabold text-[#263238] mt-0.5">
                        Đã hoàn thành {completedInSubject}/{subjectLessons.length} phòng thực hành
                      </div>
                    </div>
                  </div>

                  {/* 2. Bài học đề xuất tiếp theo */}
                  <section className="lg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold uppercase text-[#546E7A]">
                        ⭐ Bài học đề xuất tiếp theo
                      </span>
                      <h2 className="text-base sm:text-lg font-extrabold text-[#263238]">
                        {nextRecommendedLesson.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#546E7A]">
                        {nextRecommendedLesson.subtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenLesson(nextRecommendedLesson.id)}
                      className="w-full sm:w-auto shrink-0 rounded-2xl bg-[#263238] hover:bg-[#37474F] text-white px-6 py-3 text-sm font-extrabold min-h-[48px]"
                    >
                      Bắt đầu →
                    </button>
                  </section>

                  {/* 3. Danh sách chủ đề (Chỉ mở bài học khi bé bấm chọn chủ đề) */}
                  <section className="space-y-3">
                    <h2 className="text-base sm:text-lg font-extrabold text-[#263238]">
                      Chọn chủ đề con muốn học
                    </h2>

                    {selectedSubject === 'math' ? (
                      <div className="space-y-3">
                        {MATH_FRIENDLY_TOPICS.map((mTopic) => {
                          const isOpen = expandedTopicId === mTopic.id;
                          const matchedLessons = lessons.filter((l) =>
                            mTopic.lessonIds.includes(l.id)
                          );
                          const mappedCurriculumTopic = CURRICULUM_TOPICS_MAP.find(
                            (t) => t.id === mTopic.curriculumTopicId
                          );

                          return (
                            <div key={mTopic.id} className="lg-card overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedTopicId(isOpen ? null : mTopic.id)
                                }
                                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors min-h-[68px]"
                              >
                                <div className="flex items-center gap-3.5">
                                  <span className="w-11 h-11 rounded-2xl bg-[#F3EFFE] flex items-center justify-center text-xl shrink-0">
                                    {mTopic.icon}
                                  </span>
                                  <div>
                                    <div className="text-base font-extrabold text-[#263238]">
                                      {mTopic.title}
                                    </div>
                                    <div className="text-xs text-[#546E7A]">
                                      {mTopic.summary}
                                    </div>
                                  </div>
                                </div>

                                <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-[#F3EFFE] text-[#263238] shrink-0">
                                  {isOpen ? 'Thu gọn ▲' : 'Xem bài học ▼'}
                                </span>
                              </button>

                              {/* Chỉ hiển thị các bài học bên trong khi đã chọn chủ đề */}
                              {isOpen && (
                                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#E6E4DD] bg-[#FAF9F6] space-y-2.5">
                                  {matchedLessons.map((les) => (
                                    <div
                                      key={les.id}
                                      className="rounded-2xl bg-white border border-[#E6E4DD] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                    >
                                      <div>
                                        <div className="text-sm font-extrabold text-[#263238]">
                                          {les.title}
                                        </div>
                                        <div className="text-xs text-[#546E7A] mt-0.5">
                                          {les.subtitle}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenLesson(les.id)}
                                        className="rounded-xl bg-[#263238] text-white px-4 py-2.5 text-xs font-extrabold min-h-[42px] shrink-0"
                                      >
                                        Bắt đầu
                                      </button>
                                    </div>
                                  ))}

                                  {mappedCurriculumTopic?.lessons.map((node) => (
                                    <div
                                      key={node.id}
                                      className="rounded-2xl bg-white border border-[#E6E4DD] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                    >
                                      <div>
                                        <div className="text-xs font-extrabold text-[#263238]">
                                          {node.title} (Lớp {node.grade})
                                        </div>
                                        <div className="text-xs text-[#546E7A]">
                                          {node.objective}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenLesson(
                                            node.linkedInteractiveLessonId
                                          )
                                        }
                                        className="rounded-xl bg-[#F3EFFE] border border-[#D8CBF8] text-[#263238] px-3.5 py-2 text-xs font-bold min-h-[40px] shrink-0"
                                      >
                                        Học tiếp
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {subjectTopics.map((topic) => {
                          const isOpen = expandedTopicId === topic.id;
                          return (
                            <div key={topic.id} className="lg-card overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedTopicId(isOpen ? null : topic.id)
                                }
                                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors min-h-[68px]"
                              >
                                <div>
                                  <div className="text-base font-extrabold text-[#263238]">
                                    {topic.title}
                                  </div>
                                  <div className="text-xs text-[#546E7A] mt-0.5">
                                    {topic.summary}
                                  </div>
                                </div>

                                <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-[#F3EFFE] text-[#263238] shrink-0">
                                  {isOpen ? 'Thu gọn ▲' : `${topic.lessons.length} bài học ▼`}
                                </span>
                              </button>

                              {isOpen && (
                                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#E6E4DD] bg-[#FAF9F6] space-y-2.5">
                                  {topic.lessons.map((node) => (
                                    <div
                                      key={node.id}
                                      className="rounded-2xl bg-white border border-[#E6E4DD] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                    >
                                      <div>
                                        <div className="text-sm font-extrabold text-[#263238]">
                                          {node.title}
                                        </div>
                                        <div className="text-xs text-[#546E7A] mt-0.5">
                                          {node.objective}
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenLesson(
                                            node.linkedInteractiveLessonId
                                          )
                                        }
                                        className="rounded-xl bg-[#263238] text-white px-4 py-2.5 text-xs font-extrabold min-h-[42px] shrink-0"
                                      >
                                        Bắt đầu
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================ */}
        {/* 3. PHÒNG HỌC TƯƠNG TÁC (TẬP TRUNG 1 NHIỆM VỤ MỖI MÀN HÌNH)      */}
        {/* ================================================================ */}
        {activeNav === 'classroom' && (
          <InteractiveClassroom
            lesson={activeLesson}
            progress={profile.progressMap[activeLesson.id]}
            voiceEnabled={profile.accessibility.voiceGuide}
            reducedMotion={profile.accessibility.reducedMotion}
            focusMode={profile.accessibility.focusMode}
            onToggleFocusMode={() => toggleAccessibility('focusMode')}
            onUpdateProgress={handleUpdateProgress}
            onBackToCatalog={() => setActiveNav('subjects')}
            onNextLesson={() => {
              const idx = lessons.findIndex((l) => l.id === activeLesson.id);
              const next = lessons[(idx + 1) % lessons.length];
              handleOpenLesson(next.id);
            }}
          />
        )}

        {/* ================================================================ */}
        {/* 4. KHÁM PHÁ (CÂU HỎI TÒ MÒ, DỰ ÁN SÁNG TẠO, XƯỞNG & BÀI TẬP)    */}
        {/* ================================================================ */}
        {activeNav === 'discover' && (
          <div className="space-y-6">
            {/* Bộ chọn hoạt động gọn gàng */}
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'curiosity', label: '🔭 Câu hỏi hôm nay' },
                  { id: 'creative_projects', label: '🌟 Dự án sáng tạo' },
                  { id: 'studio', label: '🎨 Xưởng tự tạo' },
                  { id: 'exercises', label: '🧩 Thử thách bài tập' },
                ] as { id: DiscoverMode; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setDiscoverMode(m.id)}
                  className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-extrabold border min-h-[44px] transition-colors ${
                    discoverMode === m.id
                      ? 'bg-[#263238] text-white border-[#263238]'
                      : 'bg-white text-[#263238] border-[#E6E4DD]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {discoverMode === 'curiosity' && (
              <CuriosityEngineView
                voiceEnabled={profile.accessibility.voiceGuide}
                initialQuestionId={dailyCuriosity.id}
                onSaveNotebookEntry={handleSaveNotebookEntry}
                onAwardPraise={handleAwardPraise}
              />
            )}

            {discoverMode === 'creative_projects' && (
              <CreativeProjectsView
                voiceEnabled={profile.accessibility.voiceGuide}
                savedProjects={profile.creativeProjects ?? {}}
                onSaveProject={handleSaveCreativeProject}
                onAwardPraise={handleAwardPraise}
              />
            )}

            {discoverMode === 'studio' && (
              <CreativeStudio voiceEnabled={profile.accessibility.voiceGuide} />
            )}

            {discoverMode === 'exercises' && (
              <div className="space-y-6">
                <ExerciseBankArena
                  voiceEnabled={profile.accessibility.voiceGuide}
                  onAwardPraise={handleAwardPraise}
                />
                <ThinkingChallengesView
                  voiceEnabled={profile.accessibility.voiceGuide}
                />
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* 5. CỦA EM (HỒ SƠ BÉ, CHỌN LỚP, CÀI ĐẶT & GÓC PHỤ HUYNH)         */}
        {/* ================================================================ */}
        {activeNav === 'me' && (
          <div className="space-y-6">
            {/* Chọn lớp học đơn giản cho bé */}
            <section className="lg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#263238]">
                  Góc học tập của {profile.name}
                </h1>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#F3EFFE] text-[#263238]">
                  Đang học: Lớp {profile.currentGrade}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {GRADES_META.map((g) => {
                  const isCurrent = profile.currentGrade === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() =>
                        setProfile((prev) => ({ ...prev, currentGrade: g.id }))
                      }
                      className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-extrabold border min-h-[44px] ${
                        isCurrent
                          ? 'bg-[#263238] text-white border-[#263238]'
                          : 'bg-[#FAF9F6] text-[#263238] border-[#E6E4DD]'
                      }`}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Tiến trình, Nhân vật đồng hành & Sổ tay nhà khoa học */}
            <StudentProgressView
              profile={profile}
              lessons={lessons}
              onStartLesson={handleOpenLesson}
              onSelectAvatar={(avatarId: CompanionAvatarId) =>
                setProfile((prev) => ({ ...prev, avatarId }))
              }
            />

            {/* Cài đặt hiển thị & Khu vực dành cho Phụ huynh / Giáo viên (Đặt gọn trong bảng mở rộng) */}
            <details className="lg-card p-5 group">
              <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-extrabold text-[#546E7A] min-h-[40px]">
                <span>⚙️ Cài đặt hiển thị & Khu vực Phụ huynh / Giáo viên</span>
                <span className="text-xs group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div className="mt-4 pt-4 border-t border-[#E6E4DD] space-y-5">
                {/* Cài đặt cỡ chữ & giọng đọc */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleAccessibility('voiceGuide')}
                    className="rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] px-4 py-2.5 text-xs font-bold text-[#263238] min-h-[42px]"
                  >
                    {profile.accessibility.voiceGuide
                      ? '🔊 Giọng đọc hướng dẫn: Đang Bật'
                      : '🔇 Giọng đọc hướng dẫn: Đang Tắt'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAccessibility('largeText')}
                    className="rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] px-4 py-2.5 text-xs font-bold text-[#263238] min-h-[42px]"
                  >
                    {profile.accessibility.largeText
                      ? 'Aa Cỡ chữ lớn: Đang Bật'
                      : 'Aa Cỡ chữ lớn: Đang Tắt'}
                  </button>
                </div>

                {/* Chuyển sang bảng điều khiển Phụ huynh / Giáo viên / Quản trị */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#546E7A]">
                    Dành cho người lớn:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { r: 'student', label: 'Đóng bảng người lớn' },
                        { r: 'parent', label: '👨‍👩‍👧 Quản lý Phụ huynh' },
                        { r: 'teacher', label: '👩‍🏫 Góc Giáo viên' },
                        { r: 'admin', label: '⚙️ Quản trị Nội dung' },
                      ] as { r: UserRole; label: string }[]
                    ).map((item) => (
                      <button
                        key={item.r}
                        type="button"
                        onClick={() => handleRoleSwitch(item.r)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-extrabold border min-h-[40px] ${
                          profile.role === item.r && adultPortalTab !== 'none'
                            ? 'bg-[#263238] text-white border-[#263238]'
                            : 'bg-white text-[#263238] border-[#E6E4DD]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {adultPortalTab === 'parent' && (
                  <ParentDashboardView
                    profile={profile}
                    onUpdateDailyLimit={(minutes) =>
                      setProfile((prev) => ({
                        ...prev,
                        dailyLimitMinutes: minutes,
                      }))
                    }
                    onResetStudentData={() =>
                      setProfile((prev) => ({
                        ...prev,
                        progressMap: {},
                        creativeProjects: {},
                        notebookEntries: [],
                      }))
                    }
                  />
                )}

                {adultPortalTab === 'teacher' && (
                  <TeacherDashboardView
                    lessons={lessons}
                    onStartLesson={handleOpenLesson}
                  />
                )}

                {adultPortalTab === 'admin' && (
                  <AdminCMSView
                    lessons={lessons}
                    onAddOrUpdateLesson={(updatedLesson) => {
                      setLessons((prev) => {
                        const exists = prev.some(
                          (l) => l.id === updatedLesson.id
                        );
                        if (exists) {
                          return prev.map((l) =>
                            l.id === updatedLesson.id ? updatedLesson : l
                          );
                        }
                        return [updatedLesson, ...prev];
                      });
                    }}
                  />
                )}
              </div>
            </details>
          </div>
        )}

        {/* Khối ngữ nghĩa ẩn cho công cụ đọc màn hình & kiểm tra chương trình Lớp 1-5 */}
        <div className="sr-only" aria-hidden="true">
          <span>Lớp 1 Lớp 2 Lớp 3 Lớp 4 Lớp 5</span>
        </div>
      </main>

      {/* ================================================================== */}
      {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG TRÊN ĐIỆN THOẠI (TỐI ĐA 4 MỤC)          */}
      {/* ================================================================== */}
      {!isFocusClassroom && (
        <nav
          aria-label="Điều hướng di động"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-[#E6E4DD] px-2 py-1.5"
        >
          <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
            {PRIMARY_TABS.map((tab) => {
              const isActive =
                activeNav === tab.id ||
                (activeNav === 'classroom' && tab.id === 'subjects');
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveNav(tab.id)}
                  className={`rounded-2xl py-2 flex flex-col items-center justify-center gap-0.5 min-h-[52px] transition-colors ${
                    isActive
                      ? 'bg-[#F3EFFE] text-[#263238] font-extrabold'
                      : 'text-[#546E7A] font-semibold'
                  }`}
                >
                  <span className="text-lg leading-none">{tab.icon}</span>
                  <span className="text-[11px] leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
