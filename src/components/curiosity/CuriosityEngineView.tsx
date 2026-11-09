// ============================================================================
// Little Genius – Cỗ Máy Tò Mò Tối Giản ("Hôm nay con tò mò điều gì?")
// Tập trung vào MỘT câu hỏi mỗi lần theo nguyên tắc Progressive Disclosure
// ============================================================================

import React, { useEffect, useState } from 'react';
import { CURIOSITY_10_LIBRARY, type CuriosityTopic } from '../../data/curiosityData.ts';
import { playFeedbackTone, speakText } from '../../utils/speechAndAudio.ts';

export { CURIOSITY_10_LIBRARY, type CuriosityTopic };

interface CuriosityEngineViewProps {
  voiceEnabled: boolean;
  initialQuestionId?: string;
  onSaveNotebookEntry: (title: string, category: string, observation: string) => void;
  onAwardPraise: (badgeCode: string, badgeTitle: string, praise: string) => void;
}

export const CuriosityEngineView: React.FC<CuriosityEngineViewProps> = ({
  voiceEnabled,
  initialQuestionId,
  onSaveNotebookEntry,
  onAwardPraise,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialQuestionId ?? 'cur-bridge'
  );
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(false);

  // State cho Mô phỏng Xây Cầu 2D ("Làm sao xây một chiếc cầu chắc chắn?")
  const [bridgeMaterial, setBridgeMaterial] = useState<'wood' | 'steel' | 'concrete'>('steel');
  const [spanLengthMeters] = useState<number>(20);
  const [pillarsCount, setPillarsCount] = useState<number>(2);
  const [truckLoadTons, setTruckLoadTons] = useState<number>(15);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuestionId) {
      setSelectedId(initialQuestionId);
      setSelectedPrediction(null);
      setSavedToast(null);
    }
  }, [initialQuestionId]);

  const topic =
    CURIOSITY_10_LIBRARY.find((t) => t.id === selectedId) ??
    CURIOSITY_10_LIBRARY[0];

  const materialStrengthFactor =
    bridgeMaterial === 'steel' ? 1.5 : bridgeMaterial === 'concrete' ? 1.3 : 0.8;
  const effectiveSpan = spanLengthMeters / (pillarsCount + 1);
  const deflectionCm = Math.max(
    1,
    Math.round((truckLoadTons * effectiveSpan) / (12 * materialStrengthFactor))
  );
  const isBridgeSafe = deflectionCm <= 18;

  const handleSaveToScientistNotebook = () => {
    onSaveNotebookEntry(
      topic.question,
      topic.domain,
      `${topic.discoveryCore} — Vận dụng: ${topic.realLifeApplication}`
    );
    onAwardPraise(
      'curious_scientist',
      'Nhà Khoa Học Giàu Trí Tò Mò',
      'Con biết kiểm tra dự đoán của mình và ghi chép kết luận vào Sổ tay Khoa học!'
    );
    playFeedbackTone('success', voiceEnabled);
    setSavedToast(`Đã lưu khám phá "${topic.question}" vào Sổ tay của con!`);
  };

  const handleNextQuestion = () => {
    const idx = CURIOSITY_10_LIBRARY.findIndex((t) => t.id === topic.id);
    const next = CURIOSITY_10_LIBRARY[(idx + 1) % CURIOSITY_10_LIBRARY.length];
    playFeedbackTone('pop', voiceEnabled);
    setSelectedId(next.id);
    setSelectedPrediction(null);
    setSavedToast(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Tiêu đề gọn gàng + Nút đổi câu hỏi khác */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#263238]">
            Hôm nay con tò mò điều gì?
          </h1>
          <p className="text-sm text-[#546E7A]">
            Đoán thử trước, sau đó tự tay kiểm chứng nhé!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAllQuestions((v) => !v)}
            className="rounded-2xl bg-white border border-[#E6E4DD] text-[#263238] px-3.5 py-2.5 text-xs font-bold min-h-[44px]"
          >
            {showAllQuestions ? 'Đóng danh sách' : 'Đổi câu hỏi (10)'}
          </button>
          <button
            type="button"
            onClick={handleNextQuestion}
            className="rounded-2xl bg-[#F3EFFE] border border-[#D8CBF8] text-[#263238] px-3.5 py-2.5 text-xs font-bold min-h-[44px]"
          >
            Câu hỏi khác →
          </button>
        </div>
      </div>

      {/* Bảng chọn câu hỏi (chỉ mở khi bé bấm "Đổi câu hỏi") */}
      {showAllQuestions && (
        <div className="lg-card p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CURIOSITY_10_LIBRARY.map((item) => {
            const active = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  playFeedbackTone('pop', voiceEnabled);
                  setSelectedId(item.id);
                  setSelectedPrediction(null);
                  setSavedToast(null);
                  setShowAllQuestions(false);
                }}
                className={`rounded-2xl p-3 text-left border transition-colors flex items-center gap-3 min-h-[52px] ${
                  active
                    ? 'bg-[#F3EFFE] border-[#A78BFA] font-extrabold text-[#263238]'
                    : 'bg-[#FAF9F6] border-[#E6E4DD] text-[#263238]'
                }`}
              >
                <span className="text-2xl shrink-0">{item.icon}</span>
                <span className="text-xs sm:text-sm font-bold leading-snug">
                  {item.question}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Thẻ Câu hỏi chính & Bước 1: Dự đoán */}
      <div className="lg-card p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#F3EFFE] flex items-center justify-center text-2xl shrink-0">
              {topic.icon}
            </span>
            <div>
              <span className="text-xs font-bold text-[#546E7A]">
                {topic.domain}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#263238] leading-snug">
                {topic.question}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              speakText(
                `${topic.question}. ${topic.discoveryCore}.`,
                'vi-VN',
                true
              )
            }
            className="shrink-0 rounded-2xl bg-[#FAF9F6] border border-[#E6E4DD] px-3.5 py-2.5 text-xs font-bold text-[#263238] min-h-[44px]"
          >
            🔊 Đọc
          </button>
        </div>

        {/* Bước 1: Con đoán thử xem */}
        <div className="space-y-2.5">
          <div className="text-sm font-extrabold text-[#263238]">
            1. Theo con, đáp án nào đúng?
          </div>
          <div className="space-y-2">
            {topic.predictionOptions.map((opt) => {
              const chosen = selectedPrediction === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedPrediction(opt.id);
                    playFeedbackTone(
                      opt.isScientific ? 'success' : 'hint',
                      voiceEnabled
                    );
                  }}
                  className={`w-full rounded-2xl p-3.5 text-left text-sm font-bold border transition-colors min-h-[48px] ${
                    chosen
                      ? opt.isScientific
                        ? 'bg-[#EFFAF6] border-[#A7DCCB] text-[#263238]'
                        : 'bg-[#FDF2F7] border-[#F5B8D1] text-[#263238]'
                      : 'bg-[#FAF9F6] border-[#E6E4DD] text-[#263238] hover:bg-[#F3EFFE]/60'
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bước 2: Thử nghiệm mô hình trực quan */}
        <div className="rounded-2xl bg-[#FAF9F6] border border-[#E6E4DD] p-4 space-y-3">
          <div className="text-sm font-extrabold text-[#263238]">
            2. Thử nghiệm & Quan sát ({topic.experimentVariableLabel})
          </div>

          {topic.id === 'cur-bridge' ? (
            <div className="space-y-3">
              <svg
                viewBox="0 0 500 170"
                className="w-full h-40 rounded-2xl bg-[#EFFAF6] border border-[#A7DCCB]"
              >
                <rect x="0" y="105" width="70" height="65" fill="#64748b" />
                <rect x="430" y="105" width="70" height="65" fill="#64748b" />
                <rect x="70" y="130" width="360" height="40" fill="#7dd3fc" />

                {Array.from({ length: pillarsCount }).map((_, idx) => {
                  const px = 70 + ((idx + 1) * 360) / (pillarsCount + 1);
                  return (
                    <rect
                      key={idx}
                      x={px - 8}
                      y="100"
                      width="16"
                      height="65"
                      fill="#334155"
                    />
                  );
                })}

                <polyline
                  points="70,100 130,65 190,100 250,65 310,100 370,65 430,100"
                  fill="none"
                  stroke={
                    bridgeMaterial === 'steel'
                      ? '#263238'
                      : bridgeMaterial === 'concrete'
                      ? '#475569'
                      : '#92400e'
                  }
                  strokeWidth="3.5"
                />

                <path
                  d={`M 65 100 Q 250 ${100 + Math.min(28, deflectionCm)} 435 100`}
                  fill="none"
                  stroke={isBridgeSafe ? '#263238' : '#e11d48'}
                  strokeWidth="7"
                />

                <rect
                  x="225"
                  y={80 + Math.min(18, Math.round(deflectionCm * 0.45))}
                  width="50"
                  height="20"
                  rx="4"
                  fill="#A78BFA"
                />
                <text
                  x="250"
                  y={94 + Math.min(18, Math.round(deflectionCm * 0.45))}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#263238"
                >
                  {truckLoadTons} tấn
                </text>
              </svg>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">Vật liệu cầu:</label>
                  <select
                    value={bridgeMaterial}
                    onChange={(e) =>
                      setBridgeMaterial(
                        e.target.value as 'wood' | 'steel' | 'concrete'
                      )
                    }
                    className="w-full rounded-xl border border-[#E6E4DD] p-2.5 bg-white font-bold min-h-[44px]"
                  >
                    <option value="steel">Thép hợp kim (Bền)</option>
                    <option value="concrete">Bê tông cốt thép</option>
                    <option value="wood">Gỗ thông (Nhẹ)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">
                    Số trụ đỡ: {pillarsCount} trụ
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    value={pillarsCount}
                    onChange={(e) => setPillarsCount(Number(e.target.value))}
                    className="w-full accent-[#263238] h-6"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">
                    Xe tải: {truckLoadTons} tấn
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    value={truckLoadTons}
                    onChange={(e) => setTruckLoadTons(Number(e.target.value))}
                    className="w-full accent-[#263238] h-6"
                  />
                </div>
              </div>

              <div
                className={`rounded-xl p-3 text-xs font-bold border ${
                  isBridgeSafe
                    ? 'bg-[#EFFAF6] border-[#A7DCCB] text-[#263238]'
                    : 'bg-[#FDF2F7] border-[#F5B8D1] text-[#263238]'
                }`}
              >
                Độ võng mặt cầu: {deflectionCm} cm •{' '}
                {isBridgeSafe
                  ? '✓ Cầu rất vững chắc!'
                  : '⚠️ Cầu bị võng nhiều, con hãy thêm trụ đỡ hoặc chọn Thép nhé!'}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-white p-3.5 border border-[#E6E4DD] text-sm text-[#263238] leading-relaxed">
              {topic.observationSummary}
            </div>
          )}
        </div>

        {/* Bước 3: Giải thích ngắn gọn (Hiển thị rõ khi đã chọn dự đoán hoặc bấm mở) */}
        <div className="rounded-2xl bg-[#EFFAF6] border border-[#A7DCCB] p-4 space-y-2">
          <div className="text-sm font-extrabold text-[#263238]">
            💡 Khám phá vì sao:
          </div>
          <p className="text-sm font-semibold text-[#263238] leading-relaxed">
            {topic.discoveryCore}
          </p>
          <details className="pt-1">
            <summary className="cursor-pointer text-xs font-bold text-[#546E7A] underline">
              Xem thêm giải thích khoa học & ứng dụng đời sống
            </summary>
            <div className="mt-2 space-y-1.5 text-xs text-[#263238]">
              <p>
                <strong>Giải thích khoa học:</strong> {topic.scientificExplanation}
              </p>
              <p>
                <strong>Ứng dụng thực tế:</strong> {topic.realLifeApplication}
              </p>
            </div>
          </details>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleSaveToScientistNotebook}
            className="rounded-2xl bg-[#263238] hover:bg-[#37474F] text-white px-5 py-3 text-sm font-extrabold min-h-[48px]"
          >
            📓 Lưu vào Sổ tay của em
          </button>

          {savedToast && (
            <span className="text-xs font-bold text-[#263238] bg-[#EFFAF6] border border-[#A7DCCB] px-3 py-2 rounded-xl">
              ✓ {savedToast}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
