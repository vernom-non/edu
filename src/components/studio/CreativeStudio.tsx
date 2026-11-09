// ============================================================================
// EduExplore – Xưởng Sáng Tạo (Creative Studio)
// 5 Công cụ tư duy & sáng tạo có tương tác thật, trạng thái thực và phản hồi tức thì:
// 1. Logic Playground | 2. Creative Builder | 3. Story Creator | 4. Mini Coding Lab | 5. What If Lab
// ============================================================================

import React, { useState } from 'react';
import { playFeedbackTone, speakText } from '../../utils/speechAndAudio.ts';

type StudioTab =
  | 'logic_playground'
  | 'creative_builder'
  | 'story_creator'
  | 'mini_coding_lab'
  | 'what_if_lab';

interface CreativeStudioProps {
  voiceEnabled: boolean;
}

export const CreativeStudio: React.FC<CreativeStudioProps> = ({ voiceEnabled }) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('mini_coding_lab');

  // --- 1. State cho Logic Playground ---
  const [patternAnswer, setPatternAnswer] = useState<number | null>(null);
  const [balanceBoxes, setBalanceBoxes] = useState<number>(2);

  // --- 2. State cho Creative Builder ---
  const [placedBlocks, setPlacedBlocks] = useState<
    { id: string; type: 'square' | 'triangle' | 'rect' | 'circle'; label: string; area: number; color: string }[]
  >([
    { id: 'b1', type: 'square', label: 'Thân nhà (Vuông 4m²)', area: 4, color: 'bg-amber-400' },
    { id: 'b2', type: 'triangle', label: 'Mái nhà (Tam giác 2m²)', area: 2, color: 'bg-rose-500' },
  ]);

  // --- 3. State cho Story Creator ---
  const [storyHero, setStoryHero] = useState('Chú Sóc Nâu thông minh');
  const [storySetting, setStorySetting] = useState('khu rừng thông ngập nắng');
  const [storyChallenge, setStoryChallenge] = useState('tìm cách bắc chiếc cầu nhỏ qua suối cho đàn kiến');
  const [storyMoral, setStoryMoral] = useState('khi biết hợp sức và suy nghĩ sáng tạo, việc khó mấy cũng làm được');

  // --- 4. State cho Mini Coding Lab (Mê cung 5x5) ---
  // Lưới 5x5: Rô-bốt bắt đầu ở (0,0), Ngôi sao ở (3,2), Chướng ngại vật đá ở (1,0) và (2,1)
  const [commandQueue, setCommandQueue] = useState<('DOWN' | 'RIGHT' | 'UP' | 'LEFT')[]>([
    'DOWN',
    'RIGHT',
    'RIGHT',
    'DOWN',
    'RIGHT',
  ]);
  const [robotPos, setRobotPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [codingFeedback, setCodingFeedback] = useState<string>(
    'Hãy lập chuỗi khối lệnh để đưa Rô-bốt Bắp 🤖 từ ô (0,0) đến Ngôi sao ⭐ ở ô (3,2) mà không đâm vào Đá 🪨!'
  );

  // --- 5. State cho What If Lab ---
  const [forestCoverPercent, setForestCoverPercent] = useState(75);
  const [rainfallIntensity, setRainfallIntensity] = useState(60);
  const [gravityMultiplier, setGravityMultiplier] = useState<'earth' | 'moon' | 'jupiter'>('earth');

  // Chạy chương trình khối lệnh trong Mini Coding Lab
  const runRobotCommands = () => {
    let x = 0;
    let y = 0;
    const obstacles = new Set(['1,0', '2,1']);
    const target = { x: 3, y: 2 };

    for (let i = 0; i < commandQueue.length; i++) {
      const cmd = commandQueue[i];
      if (cmd === 'RIGHT') x = Math.min(4, x + 1);
      if (cmd === 'LEFT') x = Math.max(0, x - 1);
      if (cmd === 'DOWN') y = Math.min(4, y + 1);
      if (cmd === 'UP') y = Math.max(0, y - 1);

      if (obstacles.has(`${x},${y}`)) {
        setRobotPos({ x, y });
        playFeedbackTone('hint', voiceEnabled);
        setCodingFeedback(
          `⚠️ Ở bước lệnh thứ ${i + 1}, Rô-bốt đã vướng vào tảng đá tại ô (${x},${y})! Con hãy chỉnh lại thứ tự khối lệnh nhé.`
        );
        return;
      }
    }

    setRobotPos({ x, y });
    if (x === target.x && y === target.y) {
      playFeedbackTone('success', voiceEnabled);
      const msg = `🎉 Tuyệt vời! Sau ${commandQueue.length} khối lệnh, Rô-bốt Bắp đã đến đúng ô Ngôi sao (${x},${y})!`;
      setCodingFeedback(msg);
      speakText(msg, 'vi-VN', voiceEnabled);
    } else {
      playFeedbackTone('hint', voiceEnabled);
      setCodingFeedback(
        `🤔 Rô-bốt đang dừng ở ô (${x},${y}), trong khi Ngôi sao ở ô (3,2). Con hãy thêm hoặc sửa khối lệnh nhé!`
      );
    }
  };

  const totalBuiltArea = placedBlocks.reduce((acc, b) => acc + b.area, 0);

  // Tính toán mô phỏng What-If Lab: Độ xói mòn đất & chiều cao bật nhảy
  const soilRetention = Math.min(98, Math.round(forestCoverPercent * 1.15 - rainfallIntensity * 0.2));
  const floodRisk = Math.max(5, Math.min(95, Math.round(rainfallIntensity * 1.1 - forestCoverPercent * 0.75)));
  const jumpHeightMeters =
    gravityMultiplier === 'moon' ? 3.0 : gravityMultiplier === 'earth' ? 0.5 : 0.2;

  return (
    <div className="space-y-4">
      {/* Header Xưởng Sáng Tạo */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-amber-950 text-white p-5 shadow-xs">
        <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
          Không gian Thực hành & Sáng tạo Mở
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold mt-0.5">
          🎨 Xưởng Sáng Tạo EduExplore (Creative & Thinking Labs)
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-3xl">
          Nơi con vận dụng kiến thức Toán, Khoa học, Ngôn ngữ và Thuật toán để tự tay lắp ráp mô hình, lập trình điều khiển nhân vật và đặt câu hỏi "Điều gì sẽ xảy ra nếu...?"
        </p>

        {/* 5 Công cụ Xưởng sáng tạo */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { id: 'mini_coding_lab', label: '🤖 Mini Coding Lab (Lập trình khối)' },
            { id: 'logic_playground', label: '🧩 Logic Playground (Quy luật & Cân)' },
            { id: 'creative_builder', label: '🏗️ Creative Builder (Xây dựng hình học)' },
            { id: 'story_creator', label: '📖 Story Creator (Sáng tác truyện)' },
            { id: 'what_if_lab', label: '🔬 What If Lab (Thử nghiệm biến số)' },
          ].map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => {
                playFeedbackTone('pop', voiceEnabled);
                setActiveTab(tool.id as StudioTab);
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all ${
                activeTab === tool.id
                  ? 'bg-amber-400 text-slate-950 scale-105 shadow-xs'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. MINI CODING LAB */}
      {activeTab === 'mini_coding_lab' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 rounded-2xl bg-white border-2 border-indigo-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-indigo-950">
                🤖 Mê cung Thuật toán 5×5
              </h2>
              <button
                type="button"
                onClick={() => {
                  setRobotPos({ x: 0, y: 0 });
                  setCodingFeedback('Đã đưa Rô-bốt về vị trí xuất phát (0,0).');
                }}
                className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
              >
                ↺ Đặt lại vị trí (0,0)
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1.5 max-w-xs mx-auto p-3 rounded-2xl bg-slate-100 border border-slate-300">
              {Array.from({ length: 25 }).map((_, idx) => {
                const x = idx % 5;
                const y = Math.floor(idx / 5);
                const isRobot = robotPos.x === x && robotPos.y === y;
                const isStar = x === 3 && y === 2;
                const isObstacle = (x === 1 && y === 0) || (x === 2 && y === 1);

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`h-13 rounded-xl border flex flex-col items-center justify-center text-lg font-bold ${
                      isRobot
                        ? 'bg-indigo-600 text-white border-indigo-800 scale-105 shadow-xs'
                        : isStar
                        ? 'bg-amber-100 border-amber-400'
                        : isObstacle
                        ? 'bg-slate-300 border-slate-400'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <span>
                      {isRobot ? '🤖' : isStar ? '⭐' : isObstacle ? '🪨' : ''}
                    </span>
                    <span className="text-[9px] opacity-60">
                      ({x},{y})
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 text-xs font-semibold text-indigo-950">
              {codingFeedback}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Khối lệnh điều khiển (Bấm để thêm vào chương trình):
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { cmd: 'RIGHT', label: '➡️ Sang Phải' },
                { cmd: 'DOWN', label: '⬇️ Đi Xuống' },
                { cmd: 'LEFT', label: '⬅️ Sang Trái' },
                { cmd: 'UP', label: '⬆️ Đi Lên' },
              ].map((b) => (
                <button
                  key={b.cmd}
                  type="button"
                  onClick={() => {
                    playFeedbackTone('pop', voiceEnabled);
                    setCommandQueue([...commandQueue, b.cmd as 'RIGHT' | 'DOWN' | 'LEFT' | 'UP']);
                  }}
                  className="rounded-xl bg-indigo-50 border border-indigo-300 py-2.5 px-3 text-xs font-extrabold text-indigo-900 hover:bg-indigo-100"
                >
                  + {b.label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-900 text-white p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  Chuỗi lệnh hiện tại ({commandQueue.length} bước):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCommandQueue([]);
                    setRobotPos({ x: 0, y: 0 });
                  }}
                  className="text-xs text-rose-300 hover:underline"
                >
                  Xoá hết lệnh
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[42px]">
                {commandQueue.map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setCommandQueue(commandQueue.filter((_, i) => i !== idx))
                    }
                    className="rounded-lg bg-indigo-500/40 border border-indigo-400 px-2.5 py-1 text-xs font-bold hover:bg-rose-500/50"
                    title="Bấm để xoá khối lệnh này"
                  >
                    {idx + 1}. {cmd === 'RIGHT' ? '➡️ Phải' : cmd === 'DOWN' ? '⬇️ Xuống' : cmd === 'LEFT' ? '⬅️ Trái' : '⬆️ Lên'} ✕
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={runRobotCommands}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-sm font-extrabold shadow-xs"
            >
              ▶ Chạy chuỗi lệnh điều khiển Rô-bốt
            </button>
          </div>
        </div>
      )}

      {/* 2. LOGIC PLAYGROUND */}
      {activeTab === 'logic_playground' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Câu đố quy luật dãy số hình học */}
          <div className="rounded-2xl bg-white border-2 border-amber-200 p-4 space-y-3">
            <h2 className="text-base font-extrabold text-amber-950">
              🧩 Thử thách 1: Tìm quy luật bước nhảy
            </h2>
            <p className="text-xs text-slate-700">
              Quan sát số chấm tròn tăng dần trong từng ô: <strong>2 → 5 → 8 → 11 → [ ? ]</strong>. Mỗi bước tăng thêm mấy đơn vị?
            </p>
            <div className="flex items-center justify-center gap-2 py-3 bg-amber-50 rounded-xl border border-amber-200 font-extrabold text-lg">
              <span className="px-3 py-1 bg-white rounded-lg border">2</span>
              <span>→</span>
              <span className="px-3 py-1 bg-white rounded-lg border">5</span>
              <span>→</span>
              <span className="px-3 py-1 bg-white rounded-lg border">8</span>
              <span>→</span>
              <span className="px-3 py-1 bg-white rounded-lg border">11</span>
              <span>→</span>
              <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-lg">
                {patternAnswer ?? '?'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[12, 13, 14, 15].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setPatternAnswer(val);
                    playFeedbackTone(val === 14 ? 'success' : 'hint', voiceEnabled);
                  }}
                  className={`rounded-xl py-2 font-extrabold text-sm border ${
                    patternAnswer === val
                      ? val === 14
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-rose-600 text-white border-rose-700'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            {patternAnswer !== null && (
              <div className="text-xs font-bold p-2.5 rounded-xl bg-slate-50 border">
                {patternAnswer === 14
                  ? '🎉 Chính xác! Quy luật là mỗi số sau bằng số liền trước cộng thêm 3 (11 + 3 = 14)!'
                  : '🤔 Chưa đúng rồi! Con thử tính xem 5 hơn 2 mấy đơn vị, 8 hơn 5 mấy đơn vị nhé!'}
              </div>
            )}
          </div>

          {/* Cân thăng bằng logic */}
          <div className="rounded-2xl bg-white border-2 border-emerald-200 p-4 space-y-3">
            <h2 className="text-base font-extrabold text-emerald-950">
              ⚖️ Thử thách 2: Cân thăng bằng Tư duy
            </h2>
            <p className="text-xs text-slate-700">
              Đĩa cân bên trái có <strong>1 quả Dưa hấu (nặng 6 kg)</strong>. Mỗi hộp quà bên phải nặng <strong>2 kg</strong>. Cần đặt mấy hộp quà để chiếc cân thăng bằng?
            </p>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-2">
              <div className="flex items-center justify-around font-extrabold text-sm">
                <div className="p-2 bg-white rounded-xl border border-emerald-300">
                  🍉 Dưa hấu = 6 kg
                </div>
                <div className="text-xl">
                  {balanceBoxes * 2 === 6 ? '⚖️ CÂN BẰNG' : balanceBoxes * 2 < 6 ? '↙️ Nghiêng Trái' : '↘️ Nghiêng Phải'}
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-300">
                  🎁 × {balanceBoxes} = {balanceBoxes * 2} kg
                </div>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      setBalanceBoxes(cnt);
                      playFeedbackTone(cnt === 3 ? 'success' : 'pop', voiceEnabled);
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-extrabold border ${
                      balanceBoxes === cnt
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white text-slate-800 border-slate-300'
                    }`}
                  >
                    {cnt} hộp ({cnt * 2}kg)
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CREATIVE BUILDER */}
      {activeTab === 'creative_builder' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900">
              🏗️ Kho Khối Hình Học Sáng Tạo
            </h2>
            <p className="text-xs text-slate-600">
              Bấm chọn các khối hình học để lắp ghép ngôi nhà, cây cầu hoặc tàu vũ trụ và quan sát tổng diện tích mô hình!
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { type: 'square', label: 'Khối Vuông (Tường nhà - 4m²)', area: 4, color: 'bg-amber-400' },
                { type: 'triangle', label: 'Khối Tam Giác (Mái ngói - 2m²)', area: 2, color: 'bg-rose-500' },
                { type: 'rect', label: 'Dầm Chữ Nhật (Thân cầu - 6m²)', area: 6, color: 'bg-sky-500' },
                { type: 'circle', label: 'Khối Tròn (Bánh xe / Cửa sổ - 3m²)', area: 3, color: 'bg-emerald-500' },
              ].map((b) => (
                <button
                  key={b.type}
                  type="button"
                  onClick={() => {
                    playFeedbackTone('pop', voiceEnabled);
                    setPlacedBlocks([
                      ...placedBlocks,
                      {
                        id: `${b.type}-${Date.now()}`,
                        type: b.type as 'square' | 'triangle' | 'rect' | 'circle',
                        label: b.label,
                        area: b.area,
                        color: b.color,
                      },
                    ]);
                  }}
                  className="rounded-xl p-2.5 text-left border border-slate-300 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800">+ {b.label}</span>
                  <span className="text-xs font-extrabold text-indigo-700">+{b.area} m²</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 rounded-2xl bg-white border-2 border-indigo-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-indigo-950">
                Bản vẽ Mô hình của con ({placedBlocks.length} khối • Tổng diện tích: {totalBuiltArea} m²)
              </div>
              <button
                type="button"
                onClick={() => setPlacedBlocks([])}
                className="text-xs font-bold text-rose-700 hover:underline"
              >
                Xoá bàn lắp ghép
              </button>
            </div>
            <div className="min-h-[160px] rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-wrap items-center justify-center gap-3">
              {placedBlocks.map((blk) => (
                <button
                  key={blk.id}
                  type="button"
                  onClick={() =>
                    setPlacedBlocks(placedBlocks.filter((item) => item.id !== blk.id))
                  }
                  className={`${blk.color} text-white px-4 py-3 rounded-xl font-extrabold text-xs shadow-xs hover:opacity-85`}
                  title="Bấm để tháo khối này"
                >
                  {blk.label} ✕
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. STORY CREATOR */}
      {activeTab === 'story_creator' && (
        <div className="rounded-2xl bg-white border-2 border-rose-200 p-5 space-y-4">
          <h2 className="text-base font-extrabold text-rose-950">
            📖 Xưởng Sáng Tác Câu Chuyện Của Em
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">1. Nhân vật chính:</label>
              <select
                value={storyHero}
                onChange={(e) => setStoryHero(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 font-semibold"
              >
                <option value="Chú Sóc Nâu thông minh">Chú Sóc Nâu thông minh</option>
                <option value="Bạn Rùa Nhỏ kiên trì">Bạn Rùa Nhỏ kiên trì</option>
                <option value="Cô Chim Sơn Ca tốt bụng">Cô Chim Sơn Ca tốt bụng</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">2. Bối cảnh câu chuyện:</label>
              <select
                value={storySetting}
                onChange={(e) => setStorySetting(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 font-semibold"
              >
                <option value="khu rừng thông ngập nắng">Khu rừng thông ngập nắng</option>
                <option value="ngôi làng ven dòng sông xanh">Ngôi làng ven dòng sông xanh</option>
                <option value="hòn đảo hoa hướng dương">Hòn đảo hoa hướng dương</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">3. Thử thách gặp phải:</label>
              <select
                value={storyChallenge}
                onChange={(e) => setStoryChallenge(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 font-semibold"
              >
                <option value="tìm cách bắc chiếc cầu nhỏ qua suối cho đàn kiến">
                  Bắc cầu nhỏ qua suối giúp đàn kiến
                </option>
                <option value="gieo hạt và dẫn nước tưới cho mảnh đồi khô hạn">
                  Dẫn nước tưới cho mảnh đồi khô hạn
                </option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">4. Bài học ý nghĩa:</label>
              <select
                value={storyMoral}
                onChange={(e) => setStoryMoral(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 font-semibold"
              >
                <option value="khi biết hợp sức và suy nghĩ sáng tạo, việc khó mấy cũng làm được">
                  Hợp sức và sáng tạo giúp vượt mọi khó khăn
                </option>
                <option value="lòng tốt và sự kiên nhẫn luôn mang lại niềm vui cho muôn loài">
                  Lòng tốt và sự kiên nhẫn mang lại niềm vui
                </option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              "Ngày xửa ngày xưa, tại <strong>{storySetting}</strong>, có{' '}
              <strong>{storyHero}</strong> đã cùng các bạn{' '}
              <strong>{storyChallenge}</strong>. Qua chuyến phiêu lưu ấy, cả khu rừng nhận ra rằng{' '}
              <strong>{storyMoral}</strong>."
            </p>
            <button
              type="button"
              onClick={() =>
                speakText(
                  `Ngày xửa ngày xưa, tại ${storySetting}, có ${storyHero} đã cùng các bạn ${storyChallenge}. Qua chuyến phiêu lưu ấy, cả khu rừng nhận ra rằng ${storyMoral}.`,
                  'vi-VN',
                  true
                )
              }
              className="shrink-0 rounded-xl bg-rose-600 text-white px-4 py-2 text-xs font-extrabold hover:bg-rose-700"
            >
              🔊 Đọc truyện của em
            </button>
          </div>
        </div>
      )}

      {/* 5. WHAT IF LAB */}
      {activeTab === 'what_if_lab' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Thí nghiệm 1: Độ che phủ rừng vs Lũ quét */}
          <div className="rounded-2xl bg-white border-2 border-emerald-200 p-4 space-y-3">
            <h2 className="text-base font-extrabold text-emerald-950">
              🌲 Thí nghiệm Giả định 1: Điều gì xảy ra nếu đồi trọc không còn cây rừng khi mưa lớn?
            </h2>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Độ che phủ rừng cây:</span>
                <span className="text-emerald-700">{forestCoverPercent}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={95}
                value={forestCoverPercent}
                onChange={(e) => setForestCoverPercent(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Lượng mưa trên sườn núi:</span>
                <span className="text-sky-700">{rainfallIntensity}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={rainfallIntensity}
                onChange={(e) => setRainfallIntensity(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs space-y-1">
              <div>
                <strong>Khả năng giữ đất & nước ngầm của rễ cây:</strong> {soilRetention}%
              </div>
              <div>
                <strong>Nguy cơ sạt lở & lũ ống hạ nguồn:</strong>{' '}
                <span className={floodRisk > 55 ? 'text-rose-700 font-extrabold' : 'text-emerald-800 font-bold'}>
                  {floodRisk}% ({floodRisk > 55 ? 'Cao - Cần trồng thêm rừng!' : 'An toàn nhờ tán rừng giữ nước'})
                </span>
              </div>
            </div>
          </div>

          {/* Thí nghiệm 2: Trọng lực các hành tinh */}
          <div className="rounded-2xl bg-white border-2 border-indigo-200 p-4 space-y-3">
            <h2 className="text-base font-extrabold text-indigo-950">
              🚀 Thí nghiệm Giả định 2: Điều gì xảy ra nếu con bật nhảy trên Mặt Trăng hoặc Sao Mộc?
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'earth', label: '🌍 Trái Đất (1g)' },
                { id: 'moon', label: '🌕 Mặt Trăng (1/6g)' },
                { id: 'jupiter', label: '🪐 Sao Mộc (2.5g)' },
              ].map((pl) => (
                <button
                  key={pl.id}
                  type="button"
                  onClick={() =>
                    setGravityMultiplier(pl.id as 'earth' | 'moon' | 'jupiter')
                  }
                  className={`rounded-xl py-2 text-xs font-extrabold border ${
                    gravityMultiplier === pl.id
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >
                  {pl.label}
                </button>
              ))}
            </div>
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3.5 text-xs space-y-1">
              <div className="text-sm font-extrabold text-indigo-900">
                Độ cao bật nhảy của con: ~ {jumpHeightMeters} mét!
              </div>
              <p className="text-slate-700">
                {gravityMultiplier === 'moon'
                  ? 'Trên Mặt Trăng lực hút chỉ bằng 1/6 Trái Đất, nên cùng một lực chân con có thể bật cao gấp 6 lần (tới 3 mét)!'
                  : gravityMultiplier === 'jupiter'
                  ? 'Sao Mộc có khối lượng rất lớn, lực hấp dẫn mạnh gấp 2,5 lần Trái Đất khiến con bật nhảy rất nặng nề!'
                  : 'Trên Trái Đất thân yêu, một cú bật nhảy bình thường của học sinh tiểu học cao khoảng 0,5 mét.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
