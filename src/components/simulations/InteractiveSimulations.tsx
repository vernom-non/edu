// ============================================================================
// EduExplore – 9 Real Interactive 2D Simulations (Math, Vietnamese, Science, English, Social/IT)
// Hỗ trợ chuột, cảm ứng (touch) và bàn phím với phản hồi trực quan tức thì
// ============================================================================

import React, { useState } from 'react';
import type { SimulationType } from '../../types/education.ts';
import type { SimulationSubmission } from '../../engine/learningEngine.ts';
import { playFeedbackTone, speakText } from '../../utils/speechAndAudio.ts';

interface SimulationProps {
  simulationType: SimulationType;
  state: SimulationSubmission;
  onChange: (nextState: SimulationSubmission) => void;
  voiceEnabled: boolean;
  reducedMotion: boolean;
}

export const InteractiveSimulationCanvas: React.FC<SimulationProps> = ({
  simulationType,
  state,
  onChange,
  voiceEnabled,
  reducedMotion,
}) => {
  switch (simulationType) {
    case 'math_fruit_addition':
      return (
        <FruitAdditionSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
          reducedMotion={reducedMotion}
        />
      );
    case 'math_clock_time':
      return (
        <ClockTimeSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
    case 'math_fraction_cake':
      return (
        <FractionCakeSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
    case 'science_water_cycle':
      return (
        <WaterCycleSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
          reducedMotion={reducedMotion}
        />
      );
    case 'math_geometry_area':
      return (
        <GeometryAreaSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
    case 'vietnamese_story_builder':
      return (
        <VietnameseStorySim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
    case 'science_plant_growth':
      return (
        <PlantGrowthSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
    case 'english_room_explorer':
      return (
        <EnglishRoomSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
    case 'social_vietnam_map':
      return (
        <VietnamMapCivicsSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
    case 'tech_ai_pattern_lab':
      return (
        <TechAIPatternLabSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
    case 'art_color_symmetry_studio':
      return (
        <ArtColorSymmetrySim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
    case 'finance_smart_budget_lab':
      return (
        <FinanceSmartBudgetSim
          state={state}
          onChange={onChange}
          voiceEnabled={voiceEnabled}
        />
      );
  }
};

// ============================================================================
// 1. LỚP 1: PHÉP CỘNG KÉO THẢ TRÁI CÂY (math_fruit_addition)
// ============================================================================
const FruitAdditionSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
  reducedMotion: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const basketA = state.basketA ?? 1;
  const basketB = state.basketB ?? 1;
  const userAns = state.userNumericAnswer ?? basketA + basketB;
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<'red' | 'green' | null>(null);

  const updateBaskets = (nextA: number, nextB: number, nextAns?: number) => {
    const clampedA = Math.max(0, Math.min(8, nextA));
    const clampedB = Math.max(0, Math.min(8, nextB));
    playFeedbackTone('pop', voiceEnabled);
    onChange({
      ...state,
      basketA: clampedA,
      basketB: clampedB,
      userNumericAnswer: nextAns !== undefined ? nextAns : state.userNumericAnswer ?? clampedA + clampedB,
    });
  };

  const totalFruits = basketA + basketB;

  return (
    <div className="space-y-4">
      {/* Kho trái cây kéo thả hoặc bấm chạm */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-amber-50/90 border border-amber-200 p-3">
        <div className="text-sm font-semibold text-amber-900">
          Kéo táo vào rổ hoặc bấm nút <span className="underline">+ / -</span> để thêm bớt:
        </div>
        <div className="flex items-center gap-3">
          <div
            draggable
            onDragStart={() => setDragSource('red')}
            onClick={() => updateBaskets(basketA + 1, basketB)}
            className="cursor-grab active:cursor-grabbing flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 shadow-xs border border-rose-300 hover:bg-rose-50 text-sm font-bold text-rose-800"
            title="Kéo hoặc bấm để thêm Táo Đỏ vào Rổ Trái"
          >
            <span className="text-xl" aria-hidden="true">🍎</span> + Táo Đỏ (Rổ 1)
          </div>
          <div
            draggable
            onDragStart={() => setDragSource('green')}
            onClick={() => updateBaskets(basketA, basketB + 1)}
            className="cursor-grab active:cursor-grabbing flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 shadow-xs border border-emerald-300 hover:bg-emerald-50 text-sm font-bold text-emerald-800"
            title="Kéo hoặc bấm để thêm Táo Xanh vào Rổ Phải"
          >
            <span className="text-xl" aria-hidden="true">🍏</span> + Táo Xanh (Rổ 2)
          </div>
        </div>
      </div>

      {/* Hai rổ trái cây tương tác */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Rổ Trái */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragSource === 'red' || dragSource === 'green') {
              updateBaskets(basketA + 1, basketB);
            }
          }}
          className="rounded-2xl border-2 border-rose-300 bg-rose-50/70 p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-900 text-base">Rổ Trái (Táo Đỏ)</span>
            <span className="rounded-full bg-rose-600 text-white px-3 py-0.5 text-lg font-extrabold">
              {basketA}
            </span>
          </div>

          <div className="my-3 min-h-[76px] flex flex-wrap items-center justify-center gap-2 rounded-xl bg-white/90 p-3 border border-rose-200">
            {basketA === 0 ? (
              <span className="text-xs text-slate-400">Rổ đang trống (0 quả)</span>
            ) : (
              Array.from({ length: basketA }).map((_, idx) => (
                <button
                  key={`a-${idx}`}
                  type="button"
                  onClick={() => {
                    setHighlightedIndex(idx + 1);
                    speakText(`${idx + 1}`, 'vi-VN', voiceEnabled);
                  }}
                  className="text-3xl hover:scale-110 transition-transform focus:outline-2 focus:outline-rose-500 rounded-lg"
                  aria-label={`Táo đỏ thứ ${idx + 1}`}
                >
                  🍎
                </button>
              ))
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => updateBaskets(basketA - 1, basketB)}
              disabled={basketA <= 0}
              className="flex-1 rounded-xl bg-white border border-rose-300 py-2 font-bold text-rose-800 hover:bg-rose-100 disabled:opacity-40"
            >
              − Bớt 1
            </button>
            <button
              type="button"
              onClick={() => updateBaskets(basketA + 1, basketB)}
              disabled={basketA >= 8}
              className="flex-1 rounded-xl bg-rose-600 py-2 font-bold text-white hover:bg-rose-700 disabled:opacity-40"
            >
              + Thêm 1
            </button>
          </div>
        </div>

        {/* Rổ Phải */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragSource === 'green' || dragSource === 'red') {
              updateBaskets(basketA, basketB + 1);
            }
          }}
          className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900 text-base">Rổ Phải (Táo Xanh)</span>
            <span className="rounded-full bg-emerald-600 text-white px-3 py-0.5 text-lg font-extrabold">
              {basketB}
            </span>
          </div>

          <div className="my-3 min-h-[76px] flex flex-wrap items-center justify-center gap-2 rounded-xl bg-white/90 p-3 border border-emerald-200">
            {basketB === 0 ? (
              <span className="text-xs text-slate-400">Rổ đang trống (0 quả)</span>
            ) : (
              Array.from({ length: basketB }).map((_, idx) => (
                <button
                  key={`b-${idx}`}
                  type="button"
                  onClick={() => {
                    const num = basketA + idx + 1;
                    setHighlightedIndex(num);
                    speakText(`${num}`, 'vi-VN', voiceEnabled);
                  }}
                  className="text-3xl hover:scale-110 transition-transform focus:outline-2 focus:outline-emerald-500 rounded-lg"
                  aria-label={`Táo xanh đếm tiếp thứ ${basketA + idx + 1}`}
                >
                  🍏
                </button>
              ))
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => updateBaskets(basketA, basketB - 1)}
              disabled={basketB <= 0}
              className="flex-1 rounded-xl bg-white border border-emerald-300 py-2 font-bold text-emerald-800 hover:bg-emerald-100 disabled:opacity-40"
            >
              − Bớt 1
            </button>
            <button
              type="button"
              onClick={() => updateBaskets(basketA, basketB + 1)}
              disabled={basketB >= 8}
              className="flex-1 rounded-xl bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-700 disabled:opacity-40"
            >
              + Thêm 1
            </button>
          </div>
        </div>
      </div>

      {/* Giỏ lớn gộp chung & Đếm từng quả */}
      <div className="rounded-2xl border-2 border-amber-300 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-700">
            Giỏ Lớn Gộp Chung (Bấm vào từng quả để đếm từ 1 đến {totalFruits}):
          </span>
          {highlightedIndex !== null && (
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
              Đang đếm quả thứ: {highlightedIndex}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 min-h-[56px] p-2 rounded-xl bg-slate-50 border border-slate-200">
          {Array.from({ length: totalFruits }).map((_, i) => {
            const isFromA = i < basketA;
            const countNum = i + 1;
            const isHighlighted = highlightedIndex === countNum;
            return (
              <button
                key={`merged-${i}`}
                type="button"
                onClick={() => {
                  setHighlightedIndex(countNum);
                  speakText(`${countNum}`, 'vi-VN', voiceEnabled);
                }}
                className={`flex flex-col items-center px-2.5 py-1 rounded-xl border transition-all ${
                  isHighlighted
                    ? 'scale-110 ring-2 ring-amber-500 bg-amber-100 border-amber-400'
                    : isFromA
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <span className="text-2xl">{isFromA ? '🍎' : '🍏'}</span>
                <span className="text-xs font-extrabold text-slate-700">{countNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Biểu thức Toán học hình thành từng bước & Chọn số kết quả */}
      <div className="rounded-2xl bg-slate-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-2xl sm:text-3xl font-extrabold">
          <span className="px-3 py-1 rounded-xl bg-rose-500/30 border border-rose-400 text-rose-200">
            {basketA}
          </span>
          <span className="text-amber-400">+</span>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/30 border border-emerald-400 text-emerald-200">
            {basketB}
          </span>
          <span className="text-amber-400">=</span>
          <span className="px-4 py-1 rounded-xl bg-amber-400 text-slate-950">
            {userAns}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-300 mr-1">Chọn đáp án của con:</span>
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => updateBaskets(basketA, basketB, num)}
              className={`w-9 h-9 rounded-xl font-extrabold text-sm transition-all ${
                userAns === num
                  ? 'bg-amber-400 text-slate-950 scale-110 shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. LỚP 2: ĐỒNG HỒ TƯƠNG TÁC HỌC XEM GIỜ (math_clock_time)
// ============================================================================
const ClockTimeSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const hour = state.hour ?? 7;
  const minute = state.minute ?? 0;

  const setTime = (nextH: number, nextM: number) => {
    const normalizedM = ((nextM % 60) + 60) % 60;
    const normalizedH = ((nextH - 1 + 12) % 12) + 1;
    playFeedbackTone('pop', voiceEnabled);
    onChange({
      ...state,
      hour: normalizedH,
      minute: normalizedM,
    });
  };

  // Góc quay của kim giờ và kim phút
  const minuteAngle = minute * 6; // 360 / 60
  const hourAngle = (hour % 12) * 30 + minute * 0.5; // 360 / 12 + dịch chuyển theo phút

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      {/* Mặt đồng hồ SVG 2D tương tác */}
      <div className="flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-sky-200 p-4 shadow-xs">
        <svg
          viewBox="0 0 260 260"
          className="w-60 h-60 select-none"
          aria-label={`Đồng hồ kim chỉ ${hour} giờ ${minute} phút`}
        >
          {/* Vòng ngoài chỉ phút (5, 10, 15... 60) */}
          <circle cx="130" cy="130" r="120" fill="#f8fafc" stroke="#0284c7" strokeWidth="5" />
          <circle cx="130" cy="130" r="95" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 4" />

          {Array.from({ length: 12 }).map((_, i) => {
            const num = i + 1;
            const angleRad = ((num * 30 - 90) * Math.PI) / 180;
            const hourX = 130 + 76 * Math.cos(angleRad);
            const hourY = 130 + 76 * Math.sin(angleRad);
            const minX = 130 + 106 * Math.cos(angleRad);
            const minY = 130 + 106 * Math.sin(angleRad);
            const minuteValue = (num * 5) % 60;

            return (
              <g key={num}>
                {/* Bấm vào vòng ngoài để chỉnh PHÚT */}
                <g
                  onClick={() => setTime(hour, minuteValue)}
                  className="cursor-pointer hover:opacity-80"
                >
                  <circle
                    cx={minX}
                    cy={minY}
                    r="11"
                    fill={minute === minuteValue ? '#0284c7' : '#e0f2fe'}
                  />
                  <text
                    x={minX}
                    y={minY + 3.5}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill={minute === minuteValue ? '#ffffff' : '#0369a1'}
                  >
                    {minuteValue === 0 ? '00' : minuteValue}
                  </text>
                </g>

                {/* Bấm vào số lớn bên trong để chỉnh GIỜ */}
                <g
                  onClick={() => setTime(num, minute)}
                  className="cursor-pointer hover:opacity-80"
                >
                  <circle
                    cx={hourX}
                    cy={hourY}
                    r="14"
                    fill={hour === num ? '#f59e0b' : 'transparent'}
                  />
                  <text
                    x={hourX}
                    y={hourY + 5}
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="800"
                    fill={hour === num ? '#ffffff' : '#0f172a'}
                  >
                    {num}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Kim NGẮN chỉ GIỜ (Màu cam đậm) */}
          <g transform={`rotate(${hourAngle} 130 130)`}>
            <line
              x1="130"
              y1="130"
              x2="130"
              y2="78"
              stroke="#d97706"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>

          {/* Kim DÀI chỉ PHÚT (Màu xanh biển) */}
          <g transform={`rotate(${minuteAngle} 130 130)`}>
            <line
              x1="130"
              y1="130"
              x2="130"
              y2="46"
              stroke="#0284c7"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          {/* Tâm đồng hồ */}
          <circle cx="130" cy="130" r="7" fill="#0f172a" />
        </svg>
        <p className="text-xs text-slate-600 text-center mt-1">
          Mẹo: Chạm vào <strong>số lớn bên trong (1–12)</strong> để chỉnh <strong>Kim Giờ</strong>, chạm vào <strong>vòng xanh bên ngoài (00–55)</strong> để chỉnh <strong>Kim Phút</strong>!
        </p>
      </div>

      {/* Bảng điều khiển trực tiếp & Giải thích bước 5 phút */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-900 text-white p-4 text-center">
          <div className="text-xs uppercase tracking-wider text-sky-300 font-semibold">
            Đồng hồ điện tử đối chiếu
          </div>
          <div className="text-4xl font-extrabold tracking-wider my-1 text-amber-400">
            {hour.toString().padStart(2, '0')} : {minute.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-slate-200">
            Đọc là:{' '}
            <strong>
              {hour} giờ {minute === 0 ? 'đúng' : `${minute} phút`}
              {minute === 30 ? ` (hay ${hour} giờ rưỡi)` : ''}
            </strong>
          </div>
        </div>

        {/* Điều chỉnh Kim Giờ */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-amber-950">
              🟠 Kim Ngắn (Chỉ Giờ): đang ở số {hour}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTime(hour - 1, minute)}
              className="flex-1 rounded-xl bg-white border border-amber-300 py-2 font-bold text-amber-900 hover:bg-amber-100"
            >
              − 1 Giờ
            </button>
            <button
              type="button"
              onClick={() => setTime(hour + 1, minute)}
              className="flex-1 rounded-xl bg-amber-600 py-2 font-bold text-white hover:bg-amber-700"
            >
              + 1 Giờ
            </button>
          </div>
        </div>

        {/* Điều chỉnh Kim Phút */}
        <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-sky-950">
              🔵 Kim Dài (Chỉ Phút): {minute / 5 || 12} × 5 = {minute} phút
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 15, 30, 45].map((mVal) => (
              <button
                key={mVal}
                type="button"
                onClick={() => setTime(hour, mVal)}
                className={`rounded-xl py-1.5 text-xs font-bold border ${
                  minute === mVal
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-100'
                }`}
              >
                {mVal === 0 ? '00 phút' : `${mVal} phút`}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setTime(hour, minute - 5)}
              className="flex-1 rounded-xl bg-white border border-sky-300 py-1.5 text-sm font-bold text-sky-900 hover:bg-sky-100"
            >
              − 5 Phút
            </button>
            <button
              type="button"
              onClick={() => setTime(hour, minute + 5)}
              className="flex-1 rounded-xl bg-sky-600 py-1.5 text-sm font-bold text-white hover:bg-sky-700"
            >
              + 5 Phút
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. LỚP 3: HỌC PHÂN SỐ BẰNG MÔ HÌNH CHIA BÁNH (math_fraction_cake)
// ============================================================================
const FractionCakeSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const totalSlices = state.totalSlices ?? 4;
  const shadedSlices = Math.min(state.shadedSlices ?? 1, totalSlices);

  const updateFraction = (nextTotal: number, nextShaded: number) => {
    const safeTotal = Math.max(2, Math.min(8, nextTotal));
    const safeShaded = Math.max(0, Math.min(safeTotal, nextShaded));
    playFeedbackTone('pop', voiceEnabled);
    onChange({
      ...state,
      totalSlices: safeTotal,
      shadedSlices: safeShaded,
    });
  };

  // Vẽ hình quạt SVG cho từng miếng bánh
  const renderPie = (slices: number, activeCount: number, interactive: boolean) => {
    const cx = 110;
    const cy = 110;
    const r = 92;

    return (
      <svg viewBox="0 0 220 220" className="w-52 h-52 select-none">
        <circle cx={cx} cy={cy} r={r + 6} fill="#fde68a" stroke="#d97706" strokeWidth="3" />
        {Array.from({ length: slices }).map((_, idx) => {
          const startAngle = (idx * 360) / slices - 90;
          const endAngle = ((idx + 1) * 360) / slices - 90;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          const largeArc = 360 / slices > 180 ? 1 : 0;

          const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          const isShaded = idx < activeCount;

          // Tọa độ nhãn 1/n
          const midRad = (((startAngle + endAngle) / 2) * Math.PI) / 180;
          const labelX = cx + r * 0.6 * Math.cos(midRad);
          const labelY = cy + r * 0.6 * Math.sin(midRad);

          return (
            <g
              key={idx}
              onClick={() => {
                if (!interactive) return;
                const nextShaded = idx + 1 === activeCount ? idx : idx + 1;
                updateFraction(slices, nextShaded);
              }}
              className={interactive ? 'cursor-pointer hover:opacity-90' : ''}
            >
              <path
                d={pathData}
                fill={isShaded ? '#f97316' : '#fffbeb'}
                stroke="#b45309"
                strokeWidth="2.5"
              />
              <text
                x={labelX}
                y={labelY + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill={isShaded ? '#ffffff' : '#92400e'}
              >
                1/{slices}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const ratio = shadedSlices / totalSlices;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Chiếc bánh tương tác của học sinh */}
        <div className="rounded-2xl bg-white border-2 border-amber-200 p-4 flex flex-col items-center">
          <div className="text-sm font-bold text-amber-950 mb-1">
            Chiếc bánh của con (Bấm vào miếng bánh để chọn/bỏ chọn)
          </div>
          {renderPie(totalSlices, shadedSlices, true)}
          <div className="mt-2 flex items-center gap-4">
            <div className="flex flex-col items-center rounded-xl bg-amber-100 px-4 py-1.5 border border-amber-300">
              <span className="text-2xl font-extrabold text-orange-700 border-b-2 border-orange-800 px-2">
                {shadedSlices}
              </span>
              <span className="text-2xl font-extrabold text-amber-950 px-2">
                {totalSlices}
              </span>
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <div>
                <strong>Tử số ({shadedSlices}):</strong> Số phần bánh được tô màu cam.
              </div>
              <div>
                <strong>Mẫu số ({totalSlices}):</strong> Tổng số phần bằng nhau của cả bánh.
              </div>
            </div>
          </div>
        </div>

        {/* Điều khiển cắt bánh & Đối chiếu trực quan với 1/2, 1/3, 1/4 */}
        <div className="space-y-3">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5">
            <div className="text-sm font-bold text-amber-950 mb-2">
              Bước 1: Chia chiếc bánh thành mấy phần bằng nhau (Mẫu số)?
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[2, 3, 4, 6, 8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateFraction(s, Math.min(shadedSlices, s))}
                  className={`rounded-xl py-2 font-extrabold text-sm border transition-all ${
                    totalSlices === s
                      ? 'bg-amber-600 text-white border-amber-700 scale-105'
                      : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  {s} phần
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-orange-50 border border-orange-200 p-3.5">
            <div className="text-sm font-bold text-orange-950 mb-2">
              Bước 2: Chọn số phần bánh lấy ra (Tử số = {shadedSlices} phần)
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateFraction(totalSlices, shadedSlices - 1)}
                disabled={shadedSlices <= 0}
                className="flex-1 rounded-xl bg-white border border-orange-300 py-2 font-bold text-orange-900 hover:bg-orange-100 disabled:opacity-40"
              >
                − Bớt 1 miếng
              </button>
              <button
                type="button"
                onClick={() => updateFraction(totalSlices, shadedSlices + 1)}
                disabled={shadedSlices >= totalSlices}
                className="flex-1 rounded-xl bg-orange-600 py-2 font-bold text-white hover:bg-orange-700 disabled:opacity-40"
              >
                + Thêm 1 miếng
              </button>
            </div>
          </div>

          {/* Thanh so sánh trực quan phân số tương đương */}
          <div className="rounded-2xl bg-slate-900 text-white p-3.5 space-y-2">
            <div className="text-xs font-bold text-amber-300 uppercase">
              Thanh So sánh Diện tích Phân số Trực quan
            </div>
            <div className="space-y-1.5 text-xs">
              <div>
                <div className="flex justify-between mb-0.5">
                  <span>Bánh của con: {shadedSlices}/{totalSlices}</span>
                  <span>{Math.round(ratio * 100)}% chiếc bánh</span>
                </div>
                <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-0.5 text-slate-300">
                  <span>Mốc so sánh 1/2 (Một nửa bánh)</span>
                  <span>50% chiếc bánh</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-1/2" />
                </div>
              </div>
              {Math.abs(ratio - 0.5) < 0.001 && (
                <div className="text-emerald-300 font-bold pt-1">
                  ✨ Phát hiện: {shadedSlices}/{totalSlices} có diện tích BẰNG HỆT 1/2!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. LỚP 4: MÔ PHỎNG VÒNG TUẦN HOÀN CỦA NƯỚC (science_water_cycle)
// ============================================================================
const WaterCycleSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
  reducedMotion: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const sunTempC = state.sunTempC ?? 18;
  const windLevel = state.windLevel ?? 1;
  const observed = state.observedProcesses ?? [];

  const toggleProcess = (proc: string, nextTemp = sunTempC, nextWind = windLevel) => {
    const set = new Set(observed);
    set.add(proc);
    // Tự động kích hoạt các giai đoạn khi đủ điều kiện vật lý
    if (nextTemp >= 28) set.add('evaporation');
    if (nextTemp >= 28 && nextWind >= 2) {
      set.add('condensation');
      set.add('precipitation');
    }
    playFeedbackTone('pop', voiceEnabled);
    onChange({
      ...state,
      sunTempC: nextTemp,
      windLevel: nextWind,
      observedProcesses: Array.from(set),
    });
  };

  const isEvaporating = sunTempC >= 26;
  const isCondensing = sunTempC >= 28 && windLevel >= 2;
  const isRaining = isCondensing && observed.includes('precipitation');

  return (
    <div className="space-y-4">
      {/* Khung cảnh tự nhiên 2D SVG */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-sky-300 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 p-3">
        <svg viewBox="0 0 600 270" className="w-full h-60 select-none">
          {/* Mặt Trời */}
          <g
            onClick={() => toggleProcess('evaporation', Math.max(sunTempC, 32), windLevel)}
            className="cursor-pointer"
          >
            <circle
              cx="85"
              cy="55"
              r={sunTempC >= 28 ? 34 : 24}
              fill={sunTempC >= 28 ? '#f59e0b' : '#fcd34d'}
            />
            <text x="85" y="60" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350f">
              {sunTempC}°C
            </text>
          </g>

          {/* Núi và Rừng cây */}
          <polygon points="360,210 470,75 585,210" fill="#64748b" />
          <polygon points="445,105 470,75 495,105" fill="#f8fafc" />
          <polygon points="290,215 385,115 480,215" fill="#10b981" />

          {/* Biển / Hồ nước bên trái */}
          <path d="M 0 210 Q 180 200 350 215 L 600 215 L 600 270 L 0 270 Z" fill="#0284c7" />
          <text x="115" y="245" fill="#ffffff" fontSize="13" fontWeight="bold">
            Đại dương / Hồ nước (Thể lỏng)
          </text>

          {/* 1. BỐC HƠI (Evaporation) */}
          {isEvaporating && (
            <g
              onClick={() => toggleProcess('evaporation')}
              className="cursor-pointer"
            >
              <path
                d="M 90 195 Q 80 155 95 120"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="5 4"
                fill="none"
              />
              <path
                d="M 140 195 Q 130 155 145 120"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="5 4"
                fill="none"
              />
              <rect x="65" y="135" width="115" height="24" rx="8" fill="#0369a1" />
              <text x="122" y="151" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                1. Bốc hơi (Hơi nước) ↑
              </text>
            </g>
          )}

          {/* 2. NGƯNG TỤ THÀNH MÂY (Condensation) */}
          <g
            onClick={() => toggleProcess('condensation')}
            className="cursor-pointer"
          >
            <ellipse
              cx={isCondensing ? 290 : 230}
              cy="58"
              rx={isCondensing ? 75 : 48}
              ry={isCondensing ? 28 : 18}
              fill={isCondensing ? '#475569' : '#ffffff'}
            />
            <text
              x={isCondensing ? 290 : 230}
              y="62"
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill={isCondensing ? '#ffffff' : '#334155'}
            >
              {isCondensing ? '2. Ngưng tụ (Mây nặng hạt)' : 'Mây mỏng (Gió yếu)'}
            </text>
          </g>

          {/* 3. MƯA & DÒNG CHẢY (Precipitation & Collection) */}
          {isCondensing && (
            <g
              onClick={() => toggleProcess('precipitation')}
              className="cursor-pointer"
            >
              <line x1="260" y1="90" x2="250" y2="165" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 6" />
              <line x1="295" y1="90" x2="285" y2="165" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 6" />
              <line x1="330" y1="90" x2="320" y2="165" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 6" />
              <rect x="235" y="115" width="115" height="24" rx="8" fill="#1d4ed8" />
              <text x="292" y="131" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                3. Mưa rơi xuống ↓
              </text>
              {/* Dòng sông chảy từ núi về biển */}
              <path
                d="M 410 165 Q 360 195 290 215"
                stroke="#38bdf8"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Thanh điều khiển biến số tự nhiên */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5">
          <div className="flex justify-between text-sm font-bold text-amber-950 mb-1">
            <span>☀️ Nhiệt độ Mặt Trời:</span>
            <span className="text-amber-700">{sunTempC}°C</span>
          </div>
          <input
            type="range"
            min={15}
            max={40}
            value={sunTempC}
            onChange={(e) => toggleProcess('evaporation', Number(e.target.value), windLevel)}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="text-xs text-slate-600 mt-1">
            {sunTempC < 28
              ? 'Trời còn mát, nước bốc hơi chậm. Hãy tăng lên >= 28°C!'
              : 'Nắng ấm! Nước mặt biển đang bốc hơi mạnh lên bầu trời.'}
          </div>
        </div>

        <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5">
          <div className="flex justify-between text-sm font-bold text-sky-950 mb-1">
            <span>💨 Sức gió đẩy hơi nước lên cao:</span>
            <span className="text-sky-700">Cấp {windLevel}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            value={windLevel}
            onChange={(e) => toggleProcess('condensation', sunTempC, Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
          <div className="text-xs text-slate-600 mt-1">
            {windLevel < 2
              ? 'Gió nhẹ. Hãy tăng gió lên Cấp 2–4 để đưa hơi nước lên tầng lạnh!'
              : 'Gió đã đưa hơi nước lên cao gặp lạnh ngưng tụ thành mây mưa!'}
          </div>
        </div>
      </div>

      {/* 3 Nút giai đoạn chu trình */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'evaporation', label: '1. Bốc hơi (Lỏng → Khí)' },
          { id: 'condensation', label: '2. Ngưng tụ (Khí → Mây)' },
          { id: 'precipitation', label: '3. Mưa & Chảy về biển' },
        ].map((st) => {
          const done = observed.includes(st.id);
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => toggleProcess(st.id)}
              className={`rounded-xl p-2.5 text-xs font-bold border text-center transition-all ${
                done
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {done ? '✓ ' : ''}{st.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 5. LỚP 5: HÌNH HỌC CHU VI & DIỆN TÍCH TRỰC QUAN (math_geometry_area)
// ============================================================================
const GeometryAreaSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const w = state.widthUnits ?? 4;
  const h = state.heightUnits ?? 2;

  const setDimensions = (nextW: number, nextH: number) => {
    const safeW = Math.max(1, Math.min(8, nextW));
    const safeH = Math.max(1, Math.min(8, nextH));
    playFeedbackTone('pop', voiceEnabled);
    onChange({
      ...state,
      widthUnits: safeW,
      heightUnits: safeH,
      userPerimeter: 2 * (safeW + safeH),
      userArea: safeW * safeH,
    });
  };

  const perimeter = 2 * (w + h);
  const area = w * h;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Lưới ô vuông đơn vị trực quan */}
        <div className="rounded-2xl bg-white border-2 border-indigo-200 p-4 flex flex-col items-center">
          <div className="text-xs font-bold text-indigo-950 mb-2">
            Mỗi ô vuông = 1 m² | Đường viền cam = Chu vi hàng rào ({perimeter} m)
          </div>
          <div
            className="grid gap-1 p-2 rounded-xl bg-amber-50 border-4 border-orange-500 shadow-xs transition-all"
            style={{
              gridTemplateColumns: `repeat(${w}, minmax(28px, 36px))`,
            }}
          >
            {Array.from({ length: area }).map((_, idx) => (
              <div
                key={idx}
                className="h-8 rounded-md bg-indigo-500/90 text-white text-xs font-extrabold flex items-center justify-center border border-indigo-300"
              >
                {idx + 1}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setDimensions(h, w)}
              className="rounded-xl bg-indigo-50 border border-indigo-300 px-3 py-1.5 text-xs font-bold text-indigo-900 hover:bg-indigo-100"
            >
              🔄 Xoay hình ({w}×{h} → {h}×{w})
            </button>
          </div>
        </div>

        {/* Điều chỉnh Chiều dài & Chiều rộng + Công thức trực tiếp */}
        <div className="space-y-3">
          <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-3.5">
            <div className="flex justify-between text-sm font-bold text-indigo-950 mb-1">
              <span>Chiều dài (a):</span>
              <span>{w} m (cột)</span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={w}
              onChange={(e) => setDimensions(Number(e.target.value), h)}
              className="w-full accent-indigo-600 cursor-pointer"
            />

            <div className="flex justify-between text-sm font-bold text-indigo-950 mt-3 mb-1">
              <span>Chiều rộng (b):</span>
              <span>{h} m (hàng)</span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={h}
              onChange={(e) => setDimensions(w, Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Bảng phân biệt Chu vi vs Diện tích */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-orange-50 border-2 border-orange-300 p-3">
              <div className="text-xs font-bold text-orange-900 uppercase">
                Chu vi (Đường bao quanh)
              </div>
              <div className="text-2xl font-extrabold text-orange-700 my-1">
                P = {perimeter} m
              </div>
              <div className="text-xs text-slate-700">
                ({w} + {h}) × 2 = {perimeter}
              </div>
            </div>

            <div className="rounded-2xl bg-indigo-900 text-white p-3">
              <div className="text-xs font-bold text-indigo-200 uppercase">
                Diện tích (Số ô bên trong)
              </div>
              <div className="text-2xl font-extrabold text-amber-300 my-1">
                S = {area} m²
              </div>
              <div className="text-xs text-indigo-200">
                {h} hàng × {w} ô = {area} ô vuông
              </div>
            </div>
          </div>

          {/* Nút thử nghiệm nhanh các hình có cùng Chu vi = 16m */}
          <div className="rounded-2xl bg-slate-100 border border-slate-200 p-3">
            <div className="text-xs font-bold text-slate-700 mb-1.5">
              Thử nhanh các hình có CÙNG CHU VI 16m nhưng DIỆN TÍCH khác nhau:
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { w: 7, h: 1 },
                { w: 6, h: 2 },
                { w: 5, h: 3 },
                { w: 4, h: 4 },
              ].map((pair) => (
                <button
                  key={`${pair.w}x${pair.h}`}
                  type="button"
                  onClick={() => setDimensions(pair.w, pair.h)}
                  className={`rounded-xl py-1.5 text-xs font-bold border ${
                    w === pair.w && h === pair.h
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {pair.w}×{pair.h} (S={pair.w * pair.h})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. TIẾNG VIỆT: DỰNG CÂU & KỂ CHUYỆN BẰNG HÌNH ẢNH (vietnamese_story_builder)
// ============================================================================
const VietnameseStorySim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const selectedWords = state.selectedWords ?? ['Chú mèo vàng', 'đang nằm ngủ', 'dưới gốc cây xanh'];
  const chosenEnding = state.chosenEnding ?? 'ending_share';

  const WORD_BANK = [
    { text: 'Chú mèo vàng', role: 'Ai / Con gì?' },
    { text: 'Chú mèo nhỏ', role: 'Ai / Con gì?' },
    { text: 'đang nằm ngủ', role: 'Làm gì?' },
    { text: 'nằm sưởi nắng', role: 'Làm gì?' },
    { text: 'dưới gốc cây xanh', role: 'Ở đâu?' },
    { text: 'Dưới gốc cây xanh,', role: 'Ở đâu (Đầu câu)' },
  ];

  const toggleWord = (word: string) => {
    const exists = selectedWords.includes(word);
    const next = exists ? selectedWords.filter((w) => w !== word) : [...selectedWords, word];
    playFeedbackTone('pop', voiceEnabled);
    speakText(word, 'vi-VN', voiceEnabled);
    onChange({
      ...state,
      selectedWords: next,
    });
  };

  const fullSentence = selectedWords.join(' ') + '.';

  return (
    <div className="space-y-4">
      {/* Tranh minh họa 2D */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50 to-sky-50 border-2 border-rose-200 p-4 flex flex-col sm:flex-row items-center gap-4">
        <svg viewBox="0 0 220 140" className="w-48 h-32 shrink-0 rounded-xl bg-sky-100 border border-emerald-200">
          <circle cx="35" cy="30" r="18" fill="#fbbf24" />
          <rect x="0" y="105" width="220" height="35" fill="#4ade80" />
          {/* Gốc cây xanh */}
          <rect x="140" y="55" width="22" height="55" fill="#78350f" />
          <circle cx="151" cy="45" r="36" fill="#16a34a" />
          {/* Chú mèo vàng */}
          <ellipse cx="110" cy="105" rx="24" ry="13" fill="#f59e0b" />
          <circle cx="90" cy="98" r="11" fill="#fbbf24" />
          <polygon points="82,90 86,80 92,89" fill="#d97706" />
          <polygon points="92,89 98,80 100,90" fill="#d97706" />
          <text x="65" y="82" fontSize="11" fontWeight="bold" fill="#475569">Zzz...</text>
        </svg>
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase text-rose-700">Quan sát tranh & Dựng câu</div>
          <p className="text-sm text-slate-700">
            Trong tranh có <strong>chú mèo vàng</strong> đang <strong>nằm ngủ / sưởi nắng</strong> bình yên ở <strong>dưới gốc cây xanh</strong>. Con hãy bấm chọn các cụm từ để ghép thành câu văn của riêng con nhé!
          </p>
        </div>
      </div>

      {/* Câu đang tạo */}
      <div className="rounded-2xl bg-white border-2 border-rose-300 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-rose-900 uppercase">Câu văn của con:</span>
          <button
            type="button"
            onClick={() => speakText(fullSentence, 'vi-VN', voiceEnabled)}
            className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100"
          >
            🔊 Nghe đọc câu
          </button>
        </div>
        <div className="min-h-[48px] flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-rose-50/60 border border-rose-200">
          {selectedWords.length === 0 ? (
            <span className="text-sm text-slate-400">Hãy bấm vào các thẻ từ bên dưới để ghép câu...</span>
          ) : (
            selectedWords.map((w, idx) => (
              <button
                key={`${w}-${idx}`}
                type="button"
                onClick={() => toggleWord(w)}
                className="rounded-xl bg-rose-600 text-white px-3 py-1.5 text-sm font-bold shadow-xs hover:bg-rose-700"
              >
                {w} ✕
              </button>
            ))
          )}
        </div>
      </div>

      {/* Ngân hàng thẻ từ */}
      <div className="flex flex-wrap gap-2">
        {WORD_BANK.map((item) => {
          const active = selectedWords.includes(item.text);
          return (
            <button
              key={item.text}
              type="button"
              onClick={() => toggleWord(item.text)}
              className={`rounded-xl px-3 py-2 text-left border transition-all ${
                active
                  ? 'bg-rose-100 border-rose-400 text-rose-900 opacity-60'
                  : 'bg-white border-slate-300 hover:border-rose-400 text-slate-800'
              }`}
            >
              <div className="text-sm font-bold">{item.text}</div>
              <div className="text-[11px] text-slate-500">{item.role}</div>
            </button>
          );
        })}
      </div>

      {/* Chọn kết thúc câu chuyện */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5">
        <div className="text-xs font-bold text-amber-950 mb-2">
          Chọn kết thúc sáng tạo cho câu chuyện khi chú chim nhỏ bay tới:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            {
              id: 'ending_share',
              text: 'Kết thúc 1: Chú mèo thức dậy, mỉm cười nghe chim hót dưới bóng cây mát rượi.',
            },
            {
              id: 'ending_play',
              text: 'Kết thúc 2: Hai người bạn mèo và chim cùng chơi đuổi bắt quanh khu vườn đầy hoa.',
            },
          ].map((end) => (
            <button
              key={end.id}
              type="button"
              onClick={() => onChange({ ...state, chosenEnding: end.id })}
              className={`rounded-xl p-2.5 text-xs font-semibold text-left border ${
                chosenEnding === end.id
                  ? 'bg-amber-600 text-white border-amber-700'
                  : 'bg-white text-slate-700 border-amber-200'
              }`}
            >
              {end.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 7. KHOA HỌC: QUÁ TRÌNH CÂY PHÁT TRIỂN (science_plant_growth)
// ============================================================================
const PlantGrowthSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const light = state.lightLevel ?? 30;
  const water = state.waterLevel ?? 25;

  const isHealthy = light >= 50 && light <= 85 && water >= 45 && water <= 80;
  const isFlooded = water > 80;
  const isDry = water < 45;
  const isDark = light < 50;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="rounded-2xl bg-gradient-to-b from-sky-100 to-amber-100 border-2 border-emerald-300 p-4 flex flex-col items-center">
          <svg viewBox="0 0 220 200" className="w-52 h-48">
            {/* Mặt trời */}
            <circle
              cx="45"
              cy="40"
              r={14 + (light / 100) * 18}
              fill={light >= 50 ? '#f59e0b' : '#cbd5e1'}
            />
            {/* Chậu đất */}
            <rect
              x="0"
              y="145"
              width="220"
              height="55"
              fill={isFlooded ? '#1e3a8a' : isDry ? '#d97706' : '#78350f'}
            />
            {/* Thân cây */}
            <path
              d={
                isDry
                  ? 'M 110 145 Q 115 115 135 110'
                  : 'M 110 145 Q 110 95 110 60'
              }
              stroke={isDark ? '#eab308' : '#15803d'}
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            {/* Lá cây */}
            <ellipse
              cx="92"
              cy="100"
              rx="18"
              ry="9"
              fill={isDark ? '#facc15' : '#22c55e'}
            />
            <ellipse
              cx="128"
              cy="92"
              rx="18"
              ry="9"
              fill={isDark ? '#facc15' : '#22c55e'}
            />
            {/* Hoa nở khi cân bằng */}
            {isHealthy && (
              <g>
                <circle cx="110" cy="52" r="14" fill="#fb7185" />
                <circle cx="110" cy="52" r="6" fill="#fef08a" />
              </g>
            )}
          </svg>
          <div className="text-xs font-bold text-center px-3 py-1.5 rounded-xl bg-white/90 border border-emerald-200 text-slate-800">
            {isHealthy
              ? '🌸 Cây đậu xanh tốt, quang hợp mạnh và đã nở hoa!'
              : isFlooded
              ? '🌊 Đất ngập úng nước (>80%)! Rễ cây bị thiếu oxy.'
              : isDry
              ? '🥀 Đất quá khô (<45%)! Cây đang bị héo.'
              : '☁️ Thiếu ánh sáng (<50%)! Lá cây bị vàng úa.'}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5">
            <div className="flex justify-between text-sm font-bold text-amber-950 mb-1">
              <span>☀️ Ánh sáng Mặt Trời:</span>
              <span>{light}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={light}
              onChange={(e) => {
                playFeedbackTone('pop', voiceEnabled);
                onChange({ ...state, lightLevel: Number(e.target.value) });
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-xs text-slate-600 mt-1">
              Khoảng tối ưu cho cây đậu: 50% – 85%.
            </div>
          </div>

          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5">
            <div className="flex justify-between text-sm font-bold text-sky-950 mb-1">
              <span>💧 Lượng nước tưới (Độ ẩm đất):</span>
              <span>{water}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={water}
              onChange={(e) => {
                playFeedbackTone('pop', voiceEnabled);
                onChange({ ...state, waterLevel: Number(e.target.value) });
              }}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="text-xs text-slate-600 mt-1">
              Khoảng tối ưu: 45% – 80% (Tưới quá 80% sẽ gây ngập úng rễ).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 8. TIẾNG ANH: CĂN PHÒNG TƯƠNG TÁC (english_room_explorer)
// ============================================================================
const EnglishRoomSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const found = state.foundObjectIds ?? ['book'];
  const [activeItem, setActiveItem] = useState<{
    id: string;
    word: string;
    phonetic: string;
    sentence: string;
    vi: string;
  } | null>(null);

  const OBJECTS = [
    {
      id: 'book',
      icon: '📘',
      word: 'Book',
      phonetic: '/bʊk/',
      sentence: 'The blue book is ON the desk.',
      vi: 'Quyển sách màu xanh nằm TRÊN bàn học.',
    },
    {
      id: 'apple',
      icon: '🍎',
      word: 'Red Apple',
      phonetic: '/ˈæp.əl/',
      sentence: 'The red apple is ON the desk.',
      vi: 'Quả táo đỏ nằm TRÊN bàn học.',
    },
    {
      id: 'clock',
      icon: '🕒',
      word: 'Wall Clock',
      phonetic: '/klɒk/',
      sentence: 'The clock is ON the wall.',
      vi: 'Chiếc đồng hồ treo TRÊN tường.',
    },
    {
      id: 'backpack',
      icon: '🎒',
      word: 'Backpack',
      phonetic: '/ˈbæk.pæk/',
      sentence: 'The backpack is UNDER the chair.',
      vi: 'Chiếc cặp sách đặt DƯỚI ghế.',
    },
  ];

  const handleSelectObject = (obj: (typeof OBJECTS)[number]) => {
    setActiveItem(obj);
    speakText(`${obj.word}. ${obj.sentence}`, 'en-US', true);
    const nextFound = Array.from(new Set([...found, obj.id]));
    onChange({
      ...state,
      foundObjectIds: nextFound,
      spokenSentence: obj.sentence,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {OBJECTS.map((obj) => {
          const isDiscovered = found.includes(obj.id);
          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => handleSelectObject(obj)}
              className={`rounded-2xl p-4 border-2 flex flex-col items-center gap-1.5 transition-all ${
                isDiscovered
                  ? 'bg-sky-50 border-sky-400 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              <span className="text-4xl">{obj.icon}</span>
              <span className="font-extrabold text-slate-900 text-sm">{obj.word}</span>
              <span className="text-xs text-sky-700 font-mono">{obj.phonetic}</span>
              <span className="text-[11px] font-bold text-emerald-700">
                {isDiscovered ? '✓ Đã nghe' : '🔊 Bấm để nghe'}
              </span>
            </button>
          );
        })}
      </div>

      {activeItem && (
        <div className="rounded-2xl bg-slate-900 text-white p-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-sky-300 font-bold uppercase">
              Situational Sentence (Câu giao tiếp theo ngữ cảnh):
            </div>
            <div className="text-lg font-extrabold text-amber-300 mt-0.5">
              "{activeItem.sentence}"
            </div>
            <div className="text-xs text-slate-300 mt-0.5">{activeItem.vi}</div>
          </div>
          <button
            type="button"
            onClick={() => speakText(activeItem.sentence, 'en-US', true)}
            className="shrink-0 rounded-xl bg-sky-500 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-sky-400"
          >
            🔊 Read Aloud
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 9. LỊCH SỬ - ĐỊA LÝ - ĐẠO ĐỨC - TIN HỌC: BẢN ĐỒ VIỆT NAM & AN TOÀN SỐ
// ============================================================================
const VietnamMapCivicsSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const selectedRegion = state.selectedRegionId ?? 'north';
  const ethicsChoice = state.ethicsChoiceId ?? 'safe_verify';

  const REGIONS = [
    {
      id: 'north',
      name: 'Miền Bắc (Bắc Bộ)',
      highlights: 'Thủ đô Hà Nội nghìn năm văn hiến, Đền Hùng (Phú Thọ), Vịnh Hạ Long.',
      terrain: 'Đồng bằng sông Hồng châu thổ màu mỡ & vùng núi trung du Bắc Bộ.',
    },
    {
      id: 'central',
      name: 'Miền Trung (Trung Bộ & Tây Nguyên)',
      highlights: 'Cố đô Huế, Phố cổ Hội An, Phong Nha – Kẻ Bàng, Không gian văn hóa Cồng chiêng Tây Nguyên.',
      terrain: 'Dải đất ven biển miền Trung và cao nguyên đất đỏ bazan.',
    },
    {
      id: 'south',
      name: 'Miền Nam (Nam Bộ)',
      highlights: 'TP. Hồ Chí Minh năng động, Địa đạo Củ Chi, Chợ nổi Đồng bằng sông Cửu Long.',
      terrain: 'Vựa lúa và trái cây lớn nhất cả nước với mạng lưới sông ngòi chằng chịt.',
    },
    {
      id: 'islands',
      name: 'Biển đảo Việt Nam (Quần đảo Hoàng Sa & Trường Sa)',
      highlights: 'Quần đảo Hoàng Sa (Đà Nẵng) và Quần đảo Trường Sa (Khánh Hòa) thuộc chủ quyền thiêng liêng của Việt Nam.',
      terrain: 'Vùng biển đảo giàu tài nguyên và vị trí chiến lược trên Biển Đông.',
    },
  ];

  const activeRegionMeta = REGIONS.find((r) => r.id === selectedRegion) ?? REGIONS[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chọn vùng trên Bản đồ Việt Nam */}
        <div className="rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 p-4 space-y-2.5">
          <div className="text-sm font-extrabold text-indigo-950">
            🗺️ Bản đồ Tương tác Việt Nam (Chọn vùng để khám phá):
          </div>
          <div className="grid grid-cols-1 gap-2">
            {REGIONS.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => {
                  playFeedbackTone('pop', voiceEnabled);
                  onChange({ ...state, selectedRegionId: reg.id });
                }}
                className={`rounded-xl p-2.5 text-left border transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : 'bg-white text-slate-800 border-indigo-200 hover:bg-indigo-100/50'
                }`}
              >
                <div className="text-xs font-extrabold">{reg.name}</div>
              </button>
            ))}
          </div>
          <div className="rounded-xl bg-white p-3 border border-indigo-200 text-xs space-y-1">
            <div className="font-bold text-indigo-900">{activeRegionMeta.name}</div>
            <div className="text-slate-700">
              <strong>Danh thắng & Lịch sử:</strong> {activeRegionMeta.highlights}
            </div>
            <div className="text-slate-600">
              <strong>Địa hình:</strong> {activeRegionMeta.terrain}
            </div>
          </div>
        </div>

        {/* Tình huống Đạo đức & An toàn Internet */}
        <div className="rounded-2xl bg-amber-50/80 border-2 border-amber-200 p-4 space-y-3">
          <div className="text-sm font-extrabold text-amber-950">
            🛡️ Tình huống Công dân số (Tin học & Đạo đức):
          </div>
          <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-amber-200">
            Khi đang học trực tuyến, có một tài khoản lạ nhắn tin: <em>"Chào em, hãy gửi cho anh địa chỉ nhà, số điện thoại của bố mẹ và mật khẩu để nhận quà miễn phí nhé!"</em> Con sẽ chọn cách xử lý nào?
          </p>
          <div className="space-y-2">
            {[
              {
                id: 'safe_verify',
                label: 'Phương án A (An toàn): Tuyệt đối không gửi thông tin cá nhân/mật khẩu và báo ngay cho bố mẹ hoặc thầy cô.',
              },
              {
                id: 'unsafe_share',
                label: 'Phương án B (Nguy hiểm): Gửi ngay địa chỉ nhà và mật khẩu vì muốn nhận quà.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  playFeedbackTone('pop', voiceEnabled);
                  onChange({ ...state, ethicsChoiceId: opt.id });
                }}
                className={`w-full rounded-xl p-3 text-left text-xs font-bold border transition-all ${
                  ethicsChoice === opt.id
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white text-slate-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 10. CÔNG NGHỆ, AI & LẬP TRÌNH: HUẤN LUYỆN AI & GỠ LỖI ROBOT (tech_ai_pattern_lab)
// ============================================================================
const TechAIPatternLabSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const [labels, setLabels] = useState<Record<string, 'life' | 'plastic'>>({
    dolphin: 'life',
    turtle: 'life',
  });
  const debugCmd = state.debugFixedCommand ?? 'TURN_LEFT';

  const SAMPLES = [
    { id: 'dolphin', icon: '🐬', name: 'Cá heo xanh', expected: 'life' as const },
    { id: 'bottle', icon: '🧴', name: 'Chai nhựa trôi nổi', expected: 'plastic' as const },
    { id: 'turtle', icon: '🐢', name: 'Rùa biển', expected: 'life' as const },
    { id: 'bag', icon: '🛍️', name: 'Túi nilon trong suốt', expected: 'plastic' as const },
  ];

  const handleLabel = (sampleId: string, chosen: 'life' | 'plastic') => {
    const next = { ...labels, [sampleId]: chosen };
    setLabels(next);
    const correctCount = SAMPLES.filter((s) => next[s.id] === s.expected).length;
    playFeedbackTone('pop', voiceEnabled);
    onChange({
      ...state,
      aiTrainedCorrectCount: correctCount,
    });
  };

  const correctTrained = SAMPLES.filter((s) => labels[s.id] === s.expected).length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-violet-50 border-2 border-violet-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold text-violet-950">
            🤖 Bước 1: Dạy AI Phân biệt Sinh vật biển & Rác thải nhựa
          </div>
          <span className="rounded-full bg-violet-600 text-white px-3 py-0.5 text-xs font-extrabold">
            Độ chính xác mẫu: {correctTrained}/4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLES.map((s) => {
            const current = labels[s.id];
            const isRight = current === s.expected;
            return (
              <div
                key={s.id}
                className="rounded-xl bg-white border border-violet-200 p-3 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{s.name}</div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      {current
                        ? isRight
                          ? '✓ Đã gán nhãn chuẩn'
                          : '⚠️ Nhãn đang bị nhầm'
                        : 'Chưa gán nhãn'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleLabel(s.id, 'life')}
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold border ${
                      current === 'life'
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    🐬 Sinh vật
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLabel(s.id, 'plastic')}
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold border ${
                      current === 'plastic'
                        ? 'bg-amber-600 text-white border-amber-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    ♻️ Rác nhựa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bước 2: Gỡ lỗi thuật toán cho tàu ngầm */}
      <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-2.5">
        <div className="text-xs font-extrabold uppercase text-violet-300">
          🐞 Bước 2: Thám tử Gỡ lỗi (Debug) Chương trình Tàu ngầm
        </div>
        <p className="text-xs text-slate-300">
          Phía bên trái tàu ngầm có tảng đá ngầm 🪨, còn rác nhựa cần thu gom ở phía bên phải ➡️. Bước lệnh thứ 2 đang bị viết nhầm thành <code>TURN_LEFT</code>. Con hãy chọn khối lệnh đúng để sửa lỗi:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: 'TURN_LEFT', label: '⬅️ Rẽ Trái (Vướng đá ngầm 🪨)' },
            { id: 'TURN_RIGHT', label: '➡️ Rẽ Phải tránh đá (TURN_RIGHT ✓)' },
          ].map((cmd) => (
            <button
              key={cmd.id}
              type="button"
              onClick={() => {
                playFeedbackTone('pop', voiceEnabled);
                onChange({
                  ...state,
                  aiTrainedCorrectCount: correctTrained,
                  debugFixedCommand: cmd.id,
                });
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-extrabold border ${
                debugCmd === cmd.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 11. NGHỆ THUẬT, ÂM NHẠC & THIẾT KẾ: STUDIO MÀU PASTEL & ĐỐI XỨNG (art_color_symmetry_studio)
// ============================================================================
const ArtColorSymmetrySim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const [activeCells, setActiveCells] = useState<string[]>(['0-1', '1-1', '1-2', '2-0']);
  const selectedColor = state.mixedColorCode ?? 'lavender';

  const PALETTES = [
    { id: 'lavender', name: 'Tím Lavender (Đỏ + Lam + Trắng)', hex: 'bg-purple-300 border-purple-500' },
    { id: 'mint', name: 'Xanh Mint (Vàng + Lam + Trắng)', hex: 'bg-emerald-300 border-emerald-500' },
    { id: 'peach', name: 'Cam Đào Pastel (Đỏ + Vàng + Trắng)', hex: 'bg-orange-300 border-orange-500' },
    { id: 'rose', name: 'Hồng Phấn Pastel (Đỏ + Trắng)', hex: 'bg-pink-300 border-pink-500' },
  ];

  const currentPalette = PALETTES.find((p) => p.id === selectedColor) ?? PALETTES[0];

  const toggleWingCell = (row: number, col: number) => {
    const key = `${row}-${col}`;
    const exists = activeCells.includes(key);
    const next = exists ? activeCells.filter((k) => k !== key) : [...activeCells, key];
    setActiveCells(next);
    playFeedbackTone('pop', voiceEnabled);
    onChange({
      ...state,
      mixedColorCode: selectedColor,
      symmetryCellsCount: next.length,
    });
  };

  return (
    <div className="space-y-4">
      {/* Chọn công thức pha màu Pastel */}
      <div className="rounded-2xl bg-pink-50/80 border border-pink-200 p-3.5 space-y-2">
        <div className="text-xs font-extrabold text-pink-950">
          🎨 Bước 1: Chọn công thức pha màu Pastel dịu mắt:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                playFeedbackTone('pop', voiceEnabled);
                onChange({
                  ...state,
                  mixedColorCode: p.id,
                  symmetryCellsCount: activeCells.length,
                });
              }}
              className={`rounded-xl p-2 text-left text-xs font-bold border flex items-center gap-2 ${
                selectedColor === p.id
                  ? 'bg-pink-600 text-white border-pink-700'
                  : 'bg-white text-slate-800 border-pink-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full border ${p.hex}`} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bảng vẽ Đối xứng Gương 4 hàng x (3 cột trái | Trục gương | 3 cột phải) */}
      <div className="rounded-2xl bg-white border-2 border-pink-200 p-4 flex flex-col items-center">
        <div className="text-xs font-extrabold text-slate-700 mb-2">
          🦋 Bước 2: Chạm vào các ô bên trái hoặc phải để vẽ đôi cánh đối xứng ({activeCells.length} cặp ô đã tô)
        </div>
        <div className="space-y-1.5">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-1.5">
              {/* Cánh Trái (cột 0, 1, 2) */}
              {[0, 1, 2].map((col) => {
                const isLit = activeCells.includes(`${row}-${col}`);
                return (
                  <button
                    key={`L-${row}-${col}`}
                    type="button"
                    onClick={() => toggleWingCell(row, col)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all ${
                      isLit ? currentPalette.hex : 'bg-slate-50 border-slate-200 hover:bg-pink-50'
                    }`}
                    aria-label={`Ô cánh trái hàng ${row + 1} cột ${col + 1}`}
                  />
                );
              })}

              {/* Trục đối xứng gương */}
              <div className="w-2 h-10 rounded-full bg-amber-400 mx-1" title="Trục đối xứng gương" />

              {/* Cánh Phải phản chiếu tự động (cột 2, 1, 0) */}
              {[2, 1, 0].map((col) => {
                const isLit = activeCells.includes(`${row}-${col}`);
                return (
                  <button
                    key={`R-${row}-${col}`}
                    type="button"
                    onClick={() => toggleWingCell(row, col)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all ${
                      isLit ? currentPalette.hex : 'bg-slate-50 border-slate-200 hover:bg-pink-50'
                    }`}
                    aria-label={`Ô cánh phải đối xứng hàng ${row + 1} cột ${col + 1}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 12. LOGIC, KỸ NĂNG SỐNG & TÀI CHÍNH: NGÂN SÁCH 100 XU (finance_smart_budget_lab)
// ============================================================================
const FinanceSmartBudgetSim: React.FC<{
  state: SimulationSubmission;
  onChange: (s: SimulationSubmission) => void;
  voiceEnabled: boolean;
}> = ({ state, onChange, voiceEnabled }) => {
  const selectedIds = state.selectedBudgetItems ?? ['notebook', 'stationery'];

  const ITEMS = [
    { id: 'notebook', icon: '📓', name: 'Vở ô ly & Sách học tập', cost: 25, type: 'need' as const },
    { id: 'stationery', icon: '✏️', name: 'Bộ thước kẻ & Bút chì', cost: 20, type: 'need' as const },
    { id: 'healthy_lunch', icon: '🥗', name: 'Bữa trưa dinh dưỡng', cost: 25, type: 'need' as const },
    { id: 'science_book', icon: '🔭', name: 'Cẩm nang Khám phá Khoa học', cost: 30, type: 'need' as const },
    { id: 'sticker_pack', icon: '✨', name: 'Bộ hình dán lấp lánh', cost: 15, type: 'want' as const },
    { id: 'candy_box', icon: '🍬', name: 'Hộp kẹo bông gòn', cost: 20, type: 'want' as const },
    { id: 'plush_toy', icon: '🧸', name: 'Gấu bông khổng lồ', cost: 45, type: 'want' as const },
  ];

  const toggleItem = (id: string) => {
    const exists = selectedIds.includes(id);
    const next = exists ? selectedIds.filter((i) => i !== id) : [...selectedIds, id];
    playFeedbackTone('pop', voiceEnabled);
    onChange({
      ...state,
      selectedBudgetItems: next,
    });
  };

  const chosenObjects = ITEMS.filter((i) => selectedIds.includes(i.id));
  const totalSpent = chosenObjects.reduce((s, i) => s + i.cost, 0);
  const savedCoins = 100 - totalSpent;
  const needsCount = chosenObjects.filter((i) => i.type === 'need').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-teal-50 border border-teal-200 p-3 text-center">
          <div className="text-xs font-bold text-teal-800">Tổng Ngân Sách</div>
          <div className="text-2xl font-extrabold text-teal-950">100 xu</div>
        </div>
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-center">
          <div className="text-xs font-bold text-amber-800">Món Cần Thiết Đã Chọn</div>
          <div className="text-2xl font-extrabold text-amber-950">{needsCount} món</div>
        </div>
        <div
          className={`rounded-2xl border p-3 text-center ${
            savedCoins >= 20
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="text-xs font-bold">🐷 Lọ Tiết Kiệm Còn Lại</div>
          <div className="text-2xl font-extrabold">{savedCoins} xu</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ITEMS.map((item) => {
          const active = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className={`rounded-2xl p-3 text-left border-2 flex items-center justify-between transition-all ${
                active
                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-xs font-extrabold">{item.name}</div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                      active
                        ? 'bg-white/20 text-white'
                        : item.type === 'need'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-pink-100 text-pink-900'
                    }`}
                  >
                    {item.type === 'need' ? '✓ CẦN THIẾT (Need)' : '✨ MONG MUỐN (Want)'}
                  </span>
                </div>
              </div>
              <div className="text-sm font-extrabold">{item.cost} xu</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

