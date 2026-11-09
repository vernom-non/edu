// ============================================================================
// EduExplore – Các khu vực chức năng:
// - Thử thách Tư duy (Thinking Challenges)
// - Tiến trình Học tập Cá nhân hóa (Student Progress)
// - Bảng điều khiển Phụ huynh (Parent Portal - Quản lý thời lượng & Quyền riêng tư)
// - Bảng điều khiển Giáo viên (Teacher Portal - Quản lý lớp & Phân tích lỗi sai)
// - Quản trị Nội dung CMS (Admin Content Management - Kiểm duyệt & Phiên bản bài giảng)
// ============================================================================

import React, { useState } from 'react';
import type {
  CompanionAvatarId,
  ContentStatus,
  GradeLevel,
  Lesson,
  MasteryLevel,
  StudentProfile,
  SubjectId,
} from '../../types/education.ts';
import { getPersonalizedRecommendations } from '../../engine/learningEngine.ts';
import { playFeedbackTone } from '../../utils/speechAndAudio.ts';

// ----------------------------------------------------------------------------
// A. THỬ THÁCH TƯ DUY & BÀI TOÁN ĐỜI SỐNG (Thinking Challenges)
// ----------------------------------------------------------------------------
export const ThinkingChallengesView: React.FC<{ voiceEnabled: boolean }> = ({
  voiceEnabled,
}) => {
  // Bài toán Mua bán & Tiền tệ nhiều cách giải (Tư duy toán học thực tế)
  const [coin5k, setCoin5k] = useState(1);
  const [coin2k, setCoin2k] = useState(2);
  const [coin1k, setCoin1k] = useState(1);

  const totalMoney = coin5k * 5 + coin2k * 2 + coin1k * 1;
  const targetPrice = 10; // 10.000đ cho cuốn sổ tay vẽ tranh

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-2">
        <div className="text-xs font-extrabold uppercase text-amber-700">
          Vận dụng vào Đời sống • Khuyến khích nhiều cách giải
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">
          🏆 Thử thách Tư duy: Cửa hàng Văn phòng phẩm Nhí
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Cuốn sổ vẽ có giá <strong>10.000 đồng</strong>. Con có các tờ tiền mệnh giá{' '}
          <strong>5.000đ, 2.000đ và 1.000đ</strong>. Hãy tìm nhiều cách kết hợp các tờ tiền khác nhau để trả đúng 10.000 đồng mà không cần thối lại!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 rounded-2xl bg-white border-2 border-amber-300 p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Tờ 5.000đ', val: 5, count: coin5k, setter: setCoin5k, color: 'bg-sky-50 border-sky-300 text-sky-950' },
              { label: 'Tờ 2.000đ', val: 2, count: coin2k, setter: setCoin2k, color: 'bg-amber-50 border-amber-300 text-amber-950' },
              { label: 'Tờ 1.000đ', val: 1, count: coin1k, setter: setCoin1k, color: 'bg-emerald-50 border-emerald-300 text-emerald-950' },
            ].map((c) => (
              <div key={c.label} className={`rounded-2xl border-2 p-3 text-center ${c.color}`}>
                <div className="text-xs font-extrabold">{c.label}</div>
                <div className="text-2xl font-extrabold my-2">× {c.count}</div>
                <div className="text-[11px] font-semibold mb-2">
                  = {c.count * c.val}.000đ
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      playFeedbackTone('pop', voiceEnabled);
                      c.setter(Math.max(0, c.count - 1));
                    }}
                    className="flex-1 rounded-lg bg-white border py-1 font-bold"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playFeedbackTone('pop', voiceEnabled);
                      c.setter(Math.min(10, c.count + 1));
                    }}
                    className="flex-1 rounded-lg bg-slate-900 text-white py-1 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`rounded-2xl p-4 border-2 flex items-center justify-between ${
              totalMoney === targetPrice
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase opacity-80">
                Tổng số tiền con đang chọn:
              </div>
              <div className="text-2xl font-extrabold">
                {totalMoney}.000 đồng / Mục tiêu: 10.000 đồng
              </div>
            </div>
            <div className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-white text-slate-900">
              {totalMoney === targetPrice
                ? '🎉 Đúng 10.000đ!'
                : totalMoney < targetPrice
                ? `Còn thiếu ${targetPrice - totalMoney}.000đ`
                : `Đang thừa ${totalMoney - targetPrice}.000đ`}
            </div>
          </div>
        </div>

        <div className="md:col-span-5 rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-900">
            💡 Các cách giải hợp lệ khác nhau (Một bài toán – Nhiều lời giải):
          </h2>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="p-2.5 rounded-xl bg-slate-50 border">
              <strong>Cách 1:</strong> 2 tờ 5.000đ (5 + 5 = 10.000đ) — nhanh gọn nhất!
            </li>
            <li className="p-2.5 rounded-xl bg-slate-50 border">
              <strong>Cách 2:</strong> 1 tờ 5.000đ + 2 tờ 2.000đ + 1 tờ 1.000đ (5 + 4 + 1 = 10.000đ).
            </li>
            <li className="p-2.5 rounded-xl bg-slate-50 border">
              <strong>Cách 3:</strong> 5 tờ 2.000đ (2 × 5 = 10.000đ).
            </li>
            <li className="p-2.5 rounded-xl bg-slate-50 border">
              <strong>Cách 4:</strong> 1 tờ 5.000đ + 5 tờ 1.000đ (5 + 5 = 10.000đ).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// B. TIẾN TRÌNH HỌC & HỒ SƠ CÁ NHÂN HÓA (Student Progress & Personalization)
// ----------------------------------------------------------------------------
const MASTERY_LABELS: Record<
  MasteryLevel,
  { label: string; badgeClass: string; desc: string }
> = {
  can_explain: {
    label: '🌟 Hiểu sâu & Tự giải thích bản chất',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    desc: 'Không chỉ làm đúng mà còn giải thích được vì sao đáp án đúng.',
  },
  mastered_independently: {
    label: '✅ Tự làm chủ độc lập',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    desc: 'Tự thao tác mô phỏng và giải quyết đúng không cần gợi ý.',
  },
  mastered_with_hints: {
    label: '💡 Hoàn thành nhờ gợi mở',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    desc: 'Đã làm đúng với sự hỗ trợ gợi ý từng bước từ Trợ giảng.',
  },
  needs_practice: {
    label: '🔄 Cần luyện tập thêm',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    desc: 'Còn nhầm lẫn khái niệm, cần tương tác lại trên mô hình.',
  },
  not_started: {
    label: '⚪ Chưa khám phá',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    desc: 'Bài học đang chờ con khám phá.',
  },
};

export const StudentProgressView: React.FC<{
  profile: StudentProfile;
  lessons: Lesson[];
  onStartLesson: (lessonId: string) => void;
  onSelectAvatar?: (avatarId: CompanionAvatarId) => void;
}> = ({ profile, lessons, onStartLesson, onSelectAvatar }) => {
  const recommendations = getPersonalizedRecommendations(profile, lessons);
  const records = Object.values(profile.progressMap);

  const countByMastery = (m: MasteryLevel) =>
    records.filter((r) => r.mastery === m).length;

  const AVATARS: { id: CompanionAvatarId; icon: string; name: string; motto: string }[] = [
    {
      id: 'scientist_linh',
      icon: '👩‍🔬',
      name: 'Nhà Khoa Học Linh',
      motto: 'Yêu thí nghiệm tự nhiên, đặt giả thuyết và tìm hiểu bản chất.',
    },
    {
      id: 'astronaut_mai',
      icon: '👩‍🚀',
      name: 'Kỹ Sư Vũ Trụ Mai',
      motto: 'Đam mê khám phá các hành tinh, trọng lực và toán học không gian.',
    },
    {
      id: 'engineer_an',
      icon: '👩‍💻',
      name: 'Kỹ Sư Robot & AI An',
      motto: 'Lập trình thuật toán, chế tạo mô hình cầu và bảo vệ đại dương.',
    },
    {
      id: 'artist_chau',
      icon: '👩‍🎨',
      name: 'Nhà Thiết Kế Châu',
      motto: 'Kết hợp màu sắc Pastel, đối xứng hình học và sáng tác câu chuyện.',
    },
  ];

  const achievements = profile.achievements ?? [
    {
      code: 'first_explore',
      title: 'Huy hiệu Khởi đầu Tò mò',
      specificPraise: 'Con đã thử hai cách giải khác nhau và biết kiểm tra dự đoán của mình!',
      awardedAt: 'Hôm nay',
    },
  ];
  const notebook = profile.notebookEntries ?? [];
  const projectsList = Object.values(profile.creativeProjects ?? {});

  return (
    <div className="space-y-4">
      {/* Tùy chỉnh Nhân vật Đồng hành Pastel (Dành cho bé từ 8 tuổi trở lên) */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-teal-50 border-2 border-purple-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-extrabold uppercase text-purple-700">
              Hệ thống Động lực Lành mạnh • Không áp lực chuỗi ngày • Tự tin khám phá STEM & Nghệ thuật
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              ✨ Chọn Nhân vật Đồng hành của {profile.name}
            </h2>
          </div>
          <span className="text-xs font-bold bg-white px-3 py-1 rounded-full border border-purple-200 text-purple-900">
            Không phạt khi nghỉ học • Luôn khích lệ nỗ lực tìm tòi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {AVATARS.map((av) => {
            const isSelected = (profile.avatarId ?? 'scientist_linh') === av.id;
            return (
              <button
                key={av.id}
                type="button"
                onClick={() => onSelectAvatar?.(av.id)}
                className={`rounded-2xl p-3 text-left border-2 transition-all ${
                  isSelected
                    ? 'bg-white border-purple-500 shadow-xs scale-[1.01]'
                    : 'bg-white/70 border-purple-100 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{av.icon}</span>
                  <span className="text-xs font-extrabold text-slate-900">{av.name}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">{av.motto}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Khen ngợi cụ thể & Sổ tay Nhà khoa học */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-2.5">
          <h2 className="text-sm font-extrabold text-slate-900">
            🏅 Huy hiệu Tư duy & Lời khen cụ thể ({achievements.length})
          </h2>
          <div className="space-y-2">
            {achievements.map((ach) => (
              <div
                key={ach.code}
                className="rounded-xl bg-amber-50/80 border border-amber-200 p-3 text-xs"
              >
                <div className="font-extrabold text-amber-950">🌟 {ach.title}</div>
                <div className="text-slate-700 mt-0.5">"{ach.specificPraise}"</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs space-y-2.5">
          <h2 className="text-sm font-extrabold text-slate-900">
            📓 Sổ tay Nhà khoa học & Bộ sưu tập Dự án ({notebook.length + projectsList.length})
          </h2>
          {notebook.length === 0 && projectsList.length === 0 ? (
            <p className="text-xs text-slate-500">
              Khi con lưu khám phá ở mục <strong>"Cỗ máy tò mò"</strong> hoặc hoàn thành{' '}
              <strong>"Dự án sáng tạo"</strong>, ghi chép của con sẽ xuất hiện tại đây!
            </p>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {notebook.map((n) => (
                <div key={n.id} className="rounded-xl bg-indigo-50/70 border border-indigo-200 p-2.5 text-xs">
                  <div className="font-extrabold text-indigo-950">{n.title}</div>
                  <div className="text-slate-700 mt-0.5">{n.observation}</div>
                </div>
              ))}
              {projectsList.map((p) => (
                <div key={p.projectCode} className="rounded-xl bg-pink-50/70 border border-pink-200 p-2.5 text-xs">
                  <div className="font-extrabold text-pink-950">🎨 {p.title}</div>
                  <div className="text-slate-700 mt-0.5">{p.journal}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
        <div className="text-xs font-extrabold uppercase text-indigo-700">
          Hồ sơ Cá nhân hóa Học tập • Không chỉ chấm theo % đúng/sai
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
          📊 Tiến trình Học tập của {profile.name} (Lớp {profile.currentGrade})
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Hệ thống phân biệt rõ giữa việc con <strong>tự giải quyết độc lập</strong>,{' '}
          <strong>cần gợi mở từng bước</strong> và <strong>có thể tự giải thích bản chất</strong>.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {(['can_explain', 'mastered_independently', 'mastered_with_hints', 'needs_practice'] as MasteryLevel[]).map(
            (m) => {
              const info = MASTERY_LABELS[m];
              return (
                <div
                  key={m}
                  className={`rounded-2xl border p-3.5 ${info.badgeClass}`}
                >
                  <div className="text-2xl font-extrabold">{countByMastery(m)} bài</div>
                  <div className="text-xs font-bold mt-0.5">{info.label}</div>
                  <div className="text-[11px] opacity-80 mt-1">{info.desc}</div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Đề xuất bài học tiếp theo từ dữ liệu thực tế */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-slate-900">
          🧭 Lộ trình Đề xuất Cá nhân hóa Tiếp theo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec) => (
            <div
              key={rec.lesson.id}
              className="rounded-2xl border border-slate-200 p-4 flex flex-col justify-between gap-3 hover:border-amber-400 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                    Lớp {rec.lesson.grade}
                  </span>
                  <span className="text-xs font-bold text-indigo-700">
                    {rec.priority === 'review_misconception'
                      ? 'Ưu tiên củng cố bản chất'
                      : rec.priority === 'continue_grade'
                      ? 'Trọng tâm đúng lớp'
                      : 'Khám phá mở rộng'}
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-sm mt-1">
                  {rec.lesson.title}
                </div>
                <div className="text-xs text-slate-600 mt-1">{rec.reason}</div>
              </div>
              <button
                type="button"
                onClick={() => onStartLesson(rec.lesson.id)}
                className="self-start rounded-xl bg-slate-900 text-white px-3.5 py-1.5 text-xs font-extrabold hover:bg-slate-800"
              >
                Vào Phòng thí nghiệm →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chi tiết từng bài học & Lỗi thường gặp */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-slate-900">
          📋 Chi tiết Mức độ Hiểu bản chất & Lỗi thường gặp
        </h2>
        <div className="space-y-2">
          {lessons.map((lesson) => {
            const rec = profile.progressMap[lesson.id];
            const mastery = rec?.mastery ?? 'not_started';
            const badge = MASTERY_LABELS[mastery];
            return (
              <div
                key={lesson.id}
                className="rounded-xl border border-slate-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-slate-500">
                    Lớp {lesson.grade} • {lesson.topicTitle}
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {lesson.title}
                  </div>
                  {rec && rec.commonMistakes.length > 0 && (
                    <div className="text-xs text-rose-700 font-medium mt-0.5">
                      Lưu ý lỗi từng gặp: {rec.commonMistakes.join(' | ')}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${badge.badgeClass}`}
                  >
                    {badge.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => onStartLesson(lesson.id)}
                    className="rounded-xl bg-amber-100 text-amber-950 px-3 py-1 text-xs font-bold hover:bg-amber-200"
                  >
                    Thực hành
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// C. KHU VỰC PHỤ HUYNH (Parent Portal)
// ----------------------------------------------------------------------------
export const ParentDashboardView: React.FC<{
  profile: StudentProfile;
  onUpdateDailyLimit: (minutes: number) => void;
  onResetStudentData: () => void;
}> = ({ profile, onUpdateDailyLimit, onResetStudentData }) => {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-2">
        <div className="text-xs font-extrabold uppercase text-emerald-700">
          Không quảng cáo • Không cơ chế gây nghiện • Quyền kiểm soát dữ liệu
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">
          👨‍👩‍👧 Khu vực Dành cho Phụ huynh của {profile.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Theo dõi việc hiểu bản chất của con, điều chỉnh thời lượng học hợp lý mỗi ngày và kiểm soát toàn bộ dữ liệu cá nhân theo thiết kế bảo vệ trẻ em.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">
            ⏱️ Điều chỉnh Thời lượng Học Tập Lành mạnh
          </h2>
          <p className="text-xs text-slate-600">
            EduExplore khuyến nghị học sinh tiểu học tương tác từ 20 – 45 phút mỗi ngày, kết hợp vận động ngoài trời.
          </p>
          <div className="flex items-center justify-between text-sm font-bold">
            <span>Giới hạn thời gian mỗi ngày:</span>
            <span className="text-emerald-700 font-extrabold">
              {profile.dailyLimitMinutes} phút / ngày
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[20, 30, 45, 60].map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => onUpdateDailyLimit(min)}
                className={`rounded-xl py-2 text-xs font-extrabold border ${
                  profile.dailyLimitMinutes === min
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                {min} phút
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
          <h2 className="text-base font-extrabold text-slate-900">
            🔒 Quyền Riêng tư & Kiểm soát Dữ liệu Trẻ em
          </h2>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
            <li>Không chứa quảng cáo bên thứ ba hoặc tracking hành vi tiếp thị.</li>
            <li>Trợ giảng AI tự động ẩn mọi số điện thoại, email, địa chỉ nhà (PII).</li>
            <li>Phụ huynh có toàn quyền xem và xóa toàn bộ lịch sử học tập bất cứ lúc nào.</li>
          </ul>
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const dataStr =
                  'data:text/json;charset=utf-8,' +
                  encodeURIComponent(JSON.stringify(profile, null, 2));
                const anchor = document.createElement('a');
                anchor.setAttribute('href', dataStr);
                anchor.setAttribute('download', `little-genius-backup-${profile.id}.json`);
                anchor.click();
              }}
              className="rounded-xl bg-sky-50 border border-sky-300 text-sky-900 px-4 py-2 text-xs font-extrabold hover:bg-sky-100"
            >
              📥 Xuất bản sao lưu dữ liệu của con (JSON)
            </button>
            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="rounded-xl bg-rose-50 border border-rose-300 text-rose-800 px-4 py-2 text-xs font-extrabold hover:bg-rose-100"
              >
                🗑️ Xóa và đặt lại dữ liệu tiến độ học tập
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetStudentData();
                    setConfirmClear(false);
                  }}
                  className="rounded-xl bg-rose-600 text-white px-4 py-2 text-xs font-extrabold"
                >
                  Xác nhận xóa dữ liệu
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded-xl bg-slate-100 text-slate-700 px-3 py-2 text-xs font-bold"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// D. KHU VỰC GIÁO VIÊN (Teacher Portal)
// ----------------------------------------------------------------------------
export const TeacherDashboardView: React.FC<{
  lessons: Lesson[];
  onStartLesson: (id: string) => void;
}> = ({ lessons, onStartLesson }) => {
  const CLASSROOM_ROSTER = [
    {
      name: 'Nguyễn Minh Bắp',
      grade: 3,
      masteredCount: 4,
      explainCount: 3,
      commonIssue: 'Đôi khi quên rút gọn phân số 2/4 về 1/2.',
    },
    {
      name: 'Trần Hà My',
      grade: 2,
      masteredCount: 5,
      explainCount: 4,
      commonIssue: 'Đã khắc phục hoàn toàn lỗi nhầm kim ngắn và kim dài.',
    },
    {
      name: 'Lê Hoàng Nam',
      grade: 5,
      masteredCount: 3,
      explainCount: 1,
      commonIssue: 'Hay nhầm công thức Chu vi (a+b)×2 với Diện tích a×b.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
        <div className="text-xs font-extrabold uppercase text-sky-700">
          Công cụ Sư phạm Tiểu học • Theo dõi Mức độ Hiểu Bản Chất của Lớp
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
          👩‍🏫 Phòng Giáo viên – Quản lý Lớp học & Phân tích Nhận thức
        </h1>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-slate-900">
          Bảng Theo dõi Năng lực & Lỗi Nhận thức Thường gặp của Học sinh
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase">
                <th className="py-2.5 px-3">Học sinh</th>
                <th className="py-2.5 px-3">Khối</th>
                <th className="py-2.5 px-3">Bài làm chủ</th>
                <th className="py-2.5 px-3">Tự giải thích bản chất</th>
                <th className="py-2.5 px-3">Phân tích chẩn đoán sư phạm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {CLASSROOM_ROSTER.map((stu) => (
                <tr key={stu.name}>
                  <td className="py-3 px-3 font-extrabold text-slate-900">{stu.name}</td>
                  <td className="py-3 px-3">Lớp {stu.grade}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{stu.masteredCount} bài</td>
                  <td className="py-3 px-3 font-bold text-indigo-700">{stu.explainCount} bài</td>
                  <td className="py-3 px-3 text-slate-700">{stu.commonIssue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-slate-900">
          Kho Học liệu Mô phỏng Trực quan (Trình chiếu trên bảng tương tác lớp học)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lessons.map((l) => (
            <div key={l.id} className="rounded-xl border border-slate-200 p-3 flex flex-col justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  Lớp {l.grade} • v{l.version}
                </span>
                <div className="text-xs font-extrabold text-slate-900 mt-1">{l.title}</div>
              </div>
              <button
                type="button"
                onClick={() => onStartLesson(l.id)}
                className="self-start text-xs font-bold text-indigo-700 hover:underline"
              >
                Mở mô phỏng giảng dạy →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// E. QUẢN TRỊ NỘI DUNG CMS (Admin Content Management)
// ----------------------------------------------------------------------------
export const AdminCMSView: React.FC<{
  lessons: Lesson[];
  onAddOrUpdateLesson: (lesson: Lesson) => void;
}> = ({ lessons, onAddOrUpdateLesson }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newGrade, setNewGrade] = useState<GradeLevel>(1);
  const [newSubject, setNewSubject] = useState<SubjectId>('math');
  const [newTopic, setNewTopic] = useState('Chủ đề thực nghiệm mới');
  const [cmsNotice, setCmsNotice] = useState<string | null>(null);

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const template = lessons[0];
    const created: Lesson = {
      ...template,
      id: `lesson-custom-${Date.now()}`,
      slug: `bai-hoc-moi-${Date.now()}`,
      grade: newGrade,
      subjectId: newSubject,
      topicTitle: newTopic,
      title: newTitle.trim(),
      subtitle: 'Bài học tương tác mới được biên soạn từ hệ thống Quản trị Nội dung CMS.',
      version: '1.0.0',
      status: 'approved',
    };

    onAddOrUpdateLesson(created);
    setNewTitle('');
    setCmsNotice(`Đã tạo và xuất bản bài học "${created.title}" (v1.0.0 - Approved)!`);
  };

  const handleStatusChange = (lesson: Lesson, nextStatus: ContentStatus) => {
    const parts = lesson.version.split('.').map(Number);
    const bumpedVersion = `${parts[0]}.${parts[1]}.${(parts[2] || 0) + 1}`;
    onAddOrUpdateLesson({
      ...lesson,
      status: nextStatus,
      version: bumpedVersion,
    });
    setCmsNotice(
      `Đã cập nhật bài "${lesson.title}" sang trạng thái [${nextStatus}] – Phiên bản v${bumpedVersion}.`
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs">
        <div className="text-xs font-extrabold uppercase text-indigo-700">
          Tách biệt Dữ liệu Bài học khỏi Giao diện • Kiểm duyệt & Quản lý Phiên bản
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
          ⚙️ Quản trị Nội dung Bài giảng (Curriculum & Lesson CMS)
        </h1>
      </div>

      {cmsNotice && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 text-xs font-bold text-emerald-950">
          ✓ {cmsNotice}
        </div>
      )}

      {/* Form thêm bài học mới không cần viết lại code giao diện */}
      <form
        onSubmit={handleCreateLesson}
        className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3"
      >
        <h2 className="text-base font-extrabold text-slate-900">
          + Tạo Bài học Tương tác Mới (Mở rộng Curriculum động)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="font-bold block mb-1">Tiêu đề bài học:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ví dụ: Khám phá phép cộng qua trò chơi gộp táo..."
              className="w-full rounded-xl border border-slate-300 p-2"
            />
          </div>
          <div>
            <label className="font-bold block mb-1">Khối lớp:</label>
            <select
              value={newGrade}
              onChange={(e) => setNewGrade(Number(e.target.value) as GradeLevel)}
              className="w-full rounded-xl border border-slate-300 p-2"
            >
              {[1, 2, 3, 4, 5].map((g) => (
                <option key={g} value={g}>
                  Lớp {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-bold block mb-1">Môn học:</label>
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value as SubjectId)}
              className="w-full rounded-xl border border-slate-300 p-2"
            >
              <option value="math">Toán học</option>
              <option value="vietnamese">Tiếng Việt</option>
              <option value="science">Tự nhiên & Khoa học</option>
              <option value="english">Tiếng Anh</option>
              <option value="history_geo_civics_it">Lịch sử - Địa lý - Đạo đức - Tin học</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-xs font-extrabold hover:bg-indigo-700"
        >
          Xuất bản Bài học Mới
        </button>
      </form>

      {/* Danh sách phiên bản & trạng thái kiểm duyệt */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-slate-900">
          Danh sách Phiên bản Nội dung & Trạng thái Kiểm duyệt ({lessons.length} bài)
        </h2>
        <div className="space-y-2">
          {lessons.map((l) => (
            <div
              key={l.id}
              className="rounded-xl border border-slate-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="font-extrabold text-slate-900">
                  [Lớp {l.grade}] {l.title}
                </div>
                <div className="text-slate-500">
                  Mã: {l.id} • Phiên bản: <strong>v{l.version}</strong> • Mô phỏng:{' '}
                  <code>{l.simulationType}</code>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(['approved', 'in_review', 'draft'] as ContentStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(l, st)}
                    className={`rounded-lg px-2.5 py-1 font-bold border ${
                      l.status === st
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {st === 'approved' ? 'Đã duyệt' : st === 'in_review' ? 'Chờ duyệt' : 'Bản nháp'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
