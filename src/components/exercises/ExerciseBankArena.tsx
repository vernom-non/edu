// ============================================================================
// Little Genius – Giao diện Ngân Hàng 36 Dạng Bài Tập Tương Tác & Hệ Thống Sinh Biến Thể
// Không dùng trắc nghiệm làm chủ đạo — Tái sử dụng Engine tương tác thật
// ============================================================================

import React, { useState } from 'react';
import {
  EXERCISE_36_CATALOG,
  generateControlledMultiplicationVariant,
  verifyGeneratedVariantSubmission,
  type ExerciseGroupId,
  type MultiplicationCognitiveMode,
} from '../../engine/exerciseBankEngine.ts';
import { playFeedbackTone, speakText } from '../../utils/speechAndAudio.ts';

interface ExerciseBankArenaProps {
  voiceEnabled: boolean;
  onAwardPraise: (badgeCode: string, badgeTitle: string, praise: string) => void;
}

export const ExerciseBankArena: React.FC<ExerciseBankArenaProps> = ({
  voiceEnabled,
  onAwardPraise,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<ExerciseGroupId>('GROUP_2_VISUAL_MATH');
  const [activeSubTypeNum, setActiveSubTypeNum] = useState<number>(7);

  // State cho Hệ thống Sinh Biến thể Bài tập Có Kiểm soát (6 bối cảnh tư duy)
  const [variantMode, setVariantMode] = useState<MultiplicationCognitiveMode>('visual_array');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);
  const [seedIndex, setSeedIndex] = useState<number>(0);

  const currentVariant = generateControlledMultiplicationVariant(
    variantMode,
    difficulty,
    seedIndex
  );

  const [userA, setUserA] = useState<number>(currentVariant.factorA);
  const [userB, setUserB] = useState<number>(currentVariant.factorB);
  const [userProduct, setUserProduct] = useState<number>(currentVariant.expectedProduct);
  const [variantResult, setVariantResult] = useState<{
    isCorrect: boolean;
    feedback: string;
    proof: string;
  } | null>(null);
  const [hintStep, setHintStep] = useState<number>(0);

  // State tương tác cho 6 Engine đại diện 6 Nhóm bài tập
  const [sortedItems, setSortedItems] = useState<Record<string, 'organic' | 'recycle'>>({
    banana: 'organic',
    bottle: 'recycle',
  });
  const [errorDetectiveChoice, setErrorDetectiveChoice] = useState<string>('');
  const [evidenceSelectedSentence, setEvidenceSelectedSentence] = useState<number | null>(null);
  const [sciencePrediction, setSciencePrediction] = useState<'float' | 'sink' | null>(null);
  const [creativeDesignNotes, setCreativeDesignNotes] = useState<string>(
    'Thiết kế trạm thu gom rác nhựa dùng pin mặt trời và cảm biến sóng âm bảo vệ cá heo.'
  );
  const [groupFeedback, setGroupFeedback] = useState<string | null>(null);

  const syncVariantInputs = (
    nextMode: MultiplicationCognitiveMode,
    nextDiff: 1 | 2 | 3,
    nextSeed: number
  ) => {
    const v = generateControlledMultiplicationVariant(nextMode, nextDiff, nextSeed);
    setVariantMode(nextMode);
    setDifficulty(nextDiff);
    setSeedIndex(nextSeed);
    setUserA(v.factorA);
    setUserB(v.factorB);
    setUserProduct(v.expectedProduct);
    setVariantResult(null);
    setHintStep(0);
  };

  const handleCheckVariant = () => {
    const res = verifyGeneratedVariantSubmission(
      currentVariant,
      userA,
      userB,
      userProduct
    );
    setVariantResult(res);
    playFeedbackTone(res.isCorrect ? 'success' : 'hint', voiceEnabled);
    speakText(res.feedback, 'vi-VN', voiceEnabled);
    if (res.isCorrect) {
      onAwardPraise(
        `variant_${variantMode}`,
        'Chuyên gia Biến thể Toán học',
        'Con đã giải quyết cùng một bản chất toán học trong nhiều bối cảnh khác nhau!'
      );
    }
  };

  const groupExercises = EXERCISE_36_CATALOG.filter(
    (e) => e.groupCode === selectedGroup
  );
  const activeSubType =
    EXERCISE_36_CATALOG.find((e) => e.subTypeNumber === activeSubTypeNum) ??
    groupExercises[0];

  return (
    <div className="space-y-6">
      {/* PHẦN 1: BỘ MÁY SINH BIẾN THỂ BÀI TẬP CÓ KIỂM SOÁT (6 CÁCH TƯ DUY) */}
      <section className="rounded-3xl bg-white border-2 border-purple-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
              Parameterized Question Templates • Kiểm tra đáp án bằng thuật toán
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              🔄 Hệ thống Sinh Biến thể Bài tập Có Kiểm soát (6 Bối cảnh Tư duy)
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600">Độ khó:</span>
            {([1, 2, 3] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => syncVariantInputs(variantMode, d, seedIndex)}
                className={`rounded-xl px-3 py-1 text-xs font-extrabold border ${
                  difficulty === d
                    ? 'bg-purple-600 text-white border-purple-700'
                    : 'bg-purple-50 text-purple-900 border-purple-200'
                }`}
              >
                Cấp {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => syncVariantInputs(variantMode, difficulty, seedIndex + 1)}
              className="rounded-xl bg-amber-400 text-slate-950 px-3 py-1 text-xs font-extrabold hover:bg-amber-300"
            >
              🎲 Đổi tham số mới
            </button>
          </div>
        </div>

        {/* 6 Phương pháp tiếp cận cùng 1 khái niệm Phép nhân */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(
            [
              { id: 'visual_array', label: '1. Nhân bằng Hình ảnh' },
              { id: 'equal_groups', label: '2. Nhóm Vật thể' },
              { id: 'shopping_math', label: '3. Bài toán Mua hàng' },
              { id: 'area_grid', label: '4. Tính Diện tích' },
              { id: 'logic_riddle', label: '5. Giải Câu đố Logic' },
              { id: 'model_builder', label: '6. Xây dựng Mô hình' },
            ] as { id: MultiplicationCognitiveMode; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => syncVariantInputs(m.id, difficulty, seedIndex)}
              className={`rounded-xl p-2.5 text-xs font-extrabold border text-center transition-all ${
                variantMode === m.id
                  ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                  : 'bg-purple-50/60 text-slate-800 border-purple-200 hover:bg-purple-100'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Khu vực thao tác trực quan của biến thể đang chọn */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center rounded-2xl bg-purple-50/50 border border-purple-200 p-4">
          <div className="lg:col-span-7 space-y-2.5">
            <div className="text-sm font-extrabold text-purple-950">
              {currentVariant.title}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-purple-100">
              {currentVariant.contextStory}
            </p>
            <div className="text-xs font-bold text-indigo-900">
              🎯 Nhiệm vụ: {currentVariant.questionPrompt}
            </div>

            {/* Lưới trực quan biểu diễn userA x userB */}
            <div className="rounded-xl bg-white p-3 border border-purple-200 flex flex-col items-center">
              <div className="text-[11px] font-bold text-slate-500 mb-2">
                Mô hình trực quan hiện tại: {userA} × {userB} = {userA * userB}
              </div>
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${userB}, minmax(22px, 28px))`,
                }}
              >
                {Array.from({ length: userA * userB }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-6 rounded-md bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {variantMode === 'visual_array'
                      ? '🧁'
                      : variantMode === 'equal_groups'
                      ? '🍓'
                      : variantMode === 'shopping_math'
                      ? '🪙'
                      : variantMode === 'area_grid'
                      ? '🌸'
                      : variantMode === 'logic_riddle'
                      ? '🔑'
                      : '🧱'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3 bg-white p-4 rounded-2xl border border-purple-200">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Số hàng / Nhóm ({userA}):
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={userA}
                  onChange={(e) => {
                    const nextA = Number(e.target.value);
                    setUserA(nextA);
                    setUserProduct(nextA * userB);
                  }}
                  className="w-full accent-purple-600"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Số phần mỗi nhóm ({userB}):
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={userB}
                  onChange={(e) => {
                    const nextB = Number(e.target.value);
                    setUserB(nextB);
                    setUserProduct(userA * nextB);
                  }}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-xl">
              <span className="text-xs font-bold">Biểu thức của con:</span>
              <span className="text-lg font-extrabold text-amber-300">
                {userA} × {userB} = {userProduct}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setHintStep((h) => Math.min(currentVariant.hints.length, h + 1))}
                className="rounded-xl bg-sky-50 border border-sky-200 px-3 py-2 text-xs font-bold text-sky-900"
              >
                💡 Gợi ý ({hintStep}/{currentVariant.hints.length})
              </button>
              <button
                type="button"
                onClick={handleCheckVariant}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-extrabold"
              >
                ✓ Kiểm tra Biến thể
              </button>
            </div>

            {hintStep > 0 && (
              <div className="rounded-xl bg-sky-50 border border-sky-200 p-2.5 text-xs text-sky-950">
                {currentVariant.hints[hintStep - 1]}
              </div>
            )}

            {variantResult && (
              <div
                className={`rounded-xl p-3 text-xs font-bold border ${
                  variantResult.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-amber-50 border-amber-400 text-amber-950'
                }`}
              >
                <div>{variantResult.feedback}</div>
                <div className="text-[11px] opacity-80 mt-1">{variantResult.proof}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PHẦN 2: NGÂN HÀNG 36 DẠNG BÀI TẬP TƯƠNG TÁC (6 NHÓM × 6 DẠNG) */}
      <section className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-extrabold uppercase text-amber-700">
            Interactive Exercise Engine • 6 Nhóm × 6 Dạng = 36 Dạng Bài Tập Tương Tác
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
            🧩 Khám phá Ngân hàng 36 Dạng Bài tập Đa phương thức
          </h2>
        </div>

        {/* Chọn 1 trong 6 Nhóm bài tập */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(
            [
              { id: 'GROUP_1_OBSERVATION', label: 'Nhóm 1: Quan sát (1–6)' },
              { id: 'GROUP_2_VISUAL_MATH', label: 'Nhóm 2: Toán trực quan (7–12)' },
              { id: 'GROUP_3_LOGIC_REASONING', label: 'Nhóm 3: Suy luận logic (13–18)' },
              { id: 'GROUP_4_SCIENCE_LAB', label: 'Nhóm 4: Thí nghiệm KH (19–24)' },
              { id: 'GROUP_5_LANGUAGE', label: 'Nhóm 5: Ngôn ngữ (25–30)' },
              { id: 'GROUP_6_CREATIVE_APPLIED', label: 'Nhóm 6: Sáng tạo (31–36)' },
            ] as { id: ExerciseGroupId; label: string }[]
          ).map((grp) => (
            <button
              key={grp.id}
              type="button"
              onClick={() => {
                setSelectedGroup(grp.id);
                const first = EXERCISE_36_CATALOG.find((e) => e.groupCode === grp.id);
                if (first) setActiveSubTypeNum(first.subTypeNumber);
                setGroupFeedback(null);
              }}
              className={`rounded-xl p-2.5 text-xs font-extrabold border transition-all ${
                selectedGroup === grp.id
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>

        {/* Danh sách 6 Dạng bài tập trong Nhóm đang chọn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {groupExercises.map((ex) => (
            <button
              key={ex.subTypeNumber}
              type="button"
              onClick={() => {
                setActiveSubTypeNum(ex.subTypeNumber);
                setGroupFeedback(null);
              }}
              className={`rounded-2xl p-3 text-left border-2 transition-all ${
                activeSubType.subTypeNumber === ex.subTypeNumber
                  ? 'bg-indigo-50 border-indigo-500'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-950">{ex.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {ex.isOpenEnded ? 'Mở / Sáng tạo' : 'Chấm tự động'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{ex.samplePrompt}</p>
            </button>
          ))}
        </div>

        {/* Bàn thực hành tương tác cho Nhóm đang chọn */}
        <div className="rounded-2xl bg-slate-50 border-2 border-indigo-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold text-indigo-950">
              ⚡ Thực hành trực tiếp: {activeSubType.name}
            </div>
            <span className="text-xs font-mono text-indigo-700">
              Engine: {activeSubType.engineType}
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium">{activeSubType.samplePrompt}</p>

          {/* Engine 1: Phân loại & Quan sát */}
          {selectedGroup === 'GROUP_1_OBSERVATION' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'banana', label: '🍌 Vỏ chuối chín', expected: 'organic' as const },
                  { id: 'bottle', label: '🧴 Chai nhựa PET', expected: 'recycle' as const },
                  { id: 'paper', label: '📰 Giấy báo cũ', expected: 'recycle' as const },
                ].map((item) => (
                  <div key={item.id} className="rounded-xl bg-white p-3 border flex items-center justify-between">
                    <span className="text-xs font-bold">{item.label}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setSortedItems({ ...sortedItems, [item.id]: 'organic' })}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                          sortedItems[item.id] === 'organic' ? 'bg-emerald-600 text-white' : 'bg-slate-100'
                        }`}
                      >
                        Hữu cơ
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortedItems({ ...sortedItems, [item.id]: 'recycle' })}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                          sortedItems[item.id] === 'recycle' ? 'bg-sky-600 text-white' : 'bg-slate-100'
                        }`}
                      >
                        Tái chế
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const ok =
                    sortedItems.banana === 'organic' &&
                    sortedItems.bottle === 'recycle' &&
                    sortedItems.paper === 'recycle';
                  setGroupFeedback(
                    ok
                      ? '🎉 Chính xác! Vỏ chuối là rác hữu cơ phân hủy tự nhiên, còn chai nhựa và giấy báo có thể tái chế!'
                      : '🤔 Con hãy kiểm tra lại nhé: Giấy báo cũ thuộc nhóm Rác tái chế đấy!'
                  );
                }}
                className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-xs font-extrabold"
              >
                Kiểm tra Phân loại Quan sát
              </button>
            </div>
          )}

          {/* Engine 2: Toán học trực quan */}
          {selectedGroup === 'GROUP_2_VISUAL_MATH' && (
            <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border">
              Con có thể thao tác trực tiếp trên <strong>Bộ máy Biến thể Toán học</strong> ngay phía trên hoặc mở <strong>Phòng học tương tác</strong> để kéo thả phân số, đồng hồ và hình học!
            </div>
          )}

          {/* Engine 3: Thám tử Bắt lỗi Lời giải (Error Detective) */}
          {selectedGroup === 'GROUP_3_LOGIC_REASONING' && (
            <div className="space-y-2.5">
              <div className="rounded-xl bg-white p-3 border text-xs">
                Lời giải của bạn Nam: <em>"Một mảnh vườn hình chữ nhật dài 5m, rộng 3m. Vậy diện tích mảnh vườn là (5 + 3) × 2 = 16 m²."</em> Con phát hiện lỗi sai ở đâu?
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    id: 'used_perimeter_formula',
                    text: 'Bạn Nam đã dùng nhầm công thức tính Chu vi (5+3)×2 để tính Diện tích (đúng phải là 5 × 3 = 15 m²).',
                  },
                  {
                    id: 'wrong_addition',
                    text: 'Công thức đúng rồi nhưng bạn Nam cộng sai 5 + 3.',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setErrorDetectiveChoice(opt.id);
                      const ok = opt.id === 'used_perimeter_formula';
                      if (ok) {
                        onAwardPraise(
                          'error_detective',
                          'Thám tử Phát hiện Lỗi',
                          'Con đã phát hiện lỗi trong lời giải và giải thích được cách sửa lại!'
                        );
                      }
                      setGroupFeedback(
                        ok
                          ? '🎉 Quá chuẩn! Con đã phát hiện đúng lỗi nhầm Chu vi với Diện tích và sửa lại thành 5 × 3 = 15 m²!'
                          : '🤔 5 + 3 = 8 đúng rồi, lỗi nằm ở chỗ bạn dùng nhầm công thức Chu vi cho Diện tích cơ!'
                      );
                    }}
                    className={`rounded-xl p-2.5 text-left text-xs font-bold border ${
                      errorDetectiveChoice === opt.id
                        ? 'bg-indigo-600 text-white border-indigo-700'
                        : 'bg-white text-slate-800 border-slate-300'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Engine 4: Thí nghiệm Khoa học (Giả thuyết & Dự đoán) */}
          {selectedGroup === 'GROUP_4_SCIENCE_LAB' && (
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-800">
                Thí nghiệm: Khi nước lỏng đóng băng thành nước đá, các phân tử nước sắp xếp thành mạng tinh thể làm thể tích tăng lên ~9% (khối lượng riêng của băng là 0,92 g/cm³ nhỏ hơn nước lỏng 1,00 g/cm³). Con dự đoán điều gì xảy ra khi thả viên đá vào cốc nước?
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSciencePrediction('float');
                    onAwardPraise(
                      'hypothesis_tester',
                      'Nhà Khoa Học Biết Kiểm Chứng',
                      'Con biết đặt dự đoán khoa học và đối chiếu với nguyên lý khối lượng riêng!'
                    );
                    setGroupFeedback(
                      '🎉 Chính xác! Vì băng có khối lượng riêng nhỏ hơn nước lỏng nên lực đẩy Ác-si-mét nâng viên băng nổi trên mặt nước!'
                    );
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-extrabold border ${
                    sciencePrediction === 'float' ? 'bg-emerald-600 text-white' : 'bg-white'
                  }`}
                >
                  🧊 Viên băng NỔI trên mặt nước
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSciencePrediction('sink');
                    setGroupFeedback(
                      '🤔 Thực tế viên băng nhẹ hơn cùng một thể tích nước lỏng nên nó sẽ NỔI trên mặt nước đấy!'
                    );
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-extrabold border ${
                    sciencePrediction === 'sink' ? 'bg-rose-600 text-white' : 'bg-white'
                  }`}
                >
                  🪨 Viên băng CHÌM xuống đáy
                </button>
              </div>
            </div>
          )}

          {/* Engine 5: Tìm bằng chứng trong bài đọc */}
          {selectedGroup === 'GROUP_5_LANGUAGE' && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">
                Bấm chọn đúng câu văn đóng vai trò là <strong>BẰNG CHỨNG</strong> cho biết cách loài ong mật chỉ đường cho đàn:
              </div>
              <div className="space-y-1.5">
                {[
                  '1. Buổi sáng mùa xuân, đàn ong chăm chỉ rời tổ bay đi khắp cánh đồng.',
                  '2. Khi tìm thấy vườn hoa nhiều mật, ong trinh sát bay về tổ và thực hiện vũ điệu lắc bụng hình số 8 để báo chính xác hướng bay và khoảng cách so với Mặt Trời.',
                  '3. Mật ong có vị ngọt dịu và rất tốt cho sức khỏe.',
                ].map((sent, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEvidenceSelectedSentence(idx);
                      setGroupFeedback(
                        idx === 1
                          ? '🎉 Chính xác! Câu số 2 nêu rõ bằng chứng khoa học về "vũ điệu lắc bụng hình số 8" của loài ong!'
                          : '🤔 Câu này chưa nêu cách ong chỉ đường cho cả đàn. Con đọc kỹ câu số 2 nhé!'
                      );
                    }}
                    className={`w-full rounded-xl p-2.5 text-left text-xs border ${
                      evidenceSelectedSentence === idx
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-white text-slate-800'
                    }`}
                  >
                    {sent}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Engine 6: Sáng tạo & Thuyết trình Sản phẩm */}
          {selectedGroup === 'GROUP_6_CREATIVE_APPLIED' && (
            <div className="space-y-2">
              <textarea
                value={creativeDesignNotes}
                onChange={(e) => setCreativeDesignNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  const ok = creativeDesignNotes.trim().length >= 15;
                  setGroupFeedback(
                    ok
                      ? '🌟 Ý tưởng sáng tạo của con rất rõ ràng và giàu tính ứng dụng thực tế! Hệ thống không giới hạn một đáp án khuôn mẫu cho bài tập sáng tạo.'
                      : 'Con hãy viết thêm ít nhất 1 câu giải thích cách hoạt động của ý tưởng nhé!'
                  );
                }}
                className="rounded-xl bg-pink-600 text-white px-4 py-2 text-xs font-extrabold"
              >
                Lưu & Đánh giá Ý tưởng Sáng tạo Mở
              </button>
            </div>
          )}

          {groupFeedback && (
            <div className="rounded-xl bg-white border border-indigo-300 p-3 text-xs font-bold text-indigo-950">
              {groupFeedback}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
