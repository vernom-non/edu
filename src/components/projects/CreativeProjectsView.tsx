// ============================================================================
// Little Genius – 5 Dự Án Liên Môn Sáng Tạo (Cross-Disciplinary Creative Projects)
// Lưu trữ sản phẩm và tiến độ riêng tư cho từng học sinh
// ============================================================================

import React, { useState } from 'react';
import type { CreativeProjectRecord } from '../../types/education.ts';
import { playFeedbackTone, speakText } from '../../utils/speechAndAudio.ts';

type ProjectCode = CreativeProjectRecord['projectCode'];

interface CreativeProjectsViewProps {
  voiceEnabled: boolean;
  savedProjects: Record<string, CreativeProjectRecord>;
  onSaveProject: (record: CreativeProjectRecord) => void;
  onAwardPraise: (badgeCode: string, badgeTitle: string, praise: string) => void;
}

export const CreativeProjectsView: React.FC<CreativeProjectsViewProps> = ({
  voiceEnabled,
  savedProjects,
  onSaveProject,
  onAwardPraise,
}) => {
  const [activeProject, setActiveProject] = useState<ProjectCode>('my_garden');
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // --- Dự án 1: Khu vườn của em ---
  const [gardenWidth, setGardenWidth] = useState(5);
  const [gardenHeight, setGardenHeight] = useState(4);
  const [gardenPlants, setGardenPlants] = useState<string[]>(['lavender', 'strawberry']);
  const [gardenJournal, setGardenJournal] = useState(
    'Ngày 1: Em chia khu vườn 20 m² thành luống hoa oải hương tím và dâu tây đỏ, tưới nước vừa đủ mỗi sáng.'
  );

  // --- Dự án 2: Cửa hàng bánh ---
  const [cakeCost, setCakeCost] = useState(12);
  const [cakePrice, setCakePrice] = useState(18);
  const [customerPaid, setCustomerPaid] = useState(50);
  const [cakeQty, setCakeQty] = useState(2);
  const [cakeSlogan, setCakeSlogan] = useState(
    'Bánh Cupcake Dâu Tây ít đường, làm từ trái cây tươi sạch mỗi ngày!'
  );

  // --- Dự án 3: Thành phố tương lai ---
  const [greenParkRatio, setGreenParkRatio] = useState(40);
  const [energySource, setEnergySource] = useState<'solar_wind' | 'coal'>('solar_wind');
  const [cityRobotTask, setCityRobotTask] = useState(
    'Robot năng lượng mặt trời tự động phân loại rác tái chế và tưới cây công viên.'
  );

  // --- Dự án 4: Nhà thám hiểm vũ trụ ---
  const [targetPlanet, setTargetPlanet] = useState<'mars' | 'moon' | 'europa'>('mars');
  const [shipSpeedUnits, setShipSpeedUnits] = useState(5);
  const [spaceStory, setSpaceStory] = useState(
    'Tàu Ánh Sao đáp xuống Sao Hỏa, dựng nhà kính trồng rau xanh dưới vòm bảo vệ.'
  );

  // --- Dự án 5: Nhà phát minh nhí ---
  const [problemStatement, setProblemStatement] = useState(
    'Các bạn nhỏ hay quên tưới cây khi bận ôn thi làm chậu cây ở lớp bị héo.'
  );
  const [prototypeSolution, setPrototypeSolution] = useState(
    'Chế tạo bình tưới nhỏ giọt tự động từ chai nhựa tái chế và dây bấc thấm nước.'
  );
  const [testImprovement, setTestImprovement] = useState(
    'Thử nghiệm 5 ngày đất vẫn ẩm đều; cải tiến thêm vạch đo mực nước bên ngoài bình.'
  );

  const handlePersistCurrentProject = () => {
    let record: CreativeProjectRecord;

    if (activeProject === 'my_garden') {
      record = {
        projectCode: 'my_garden',
        title: 'Dự án 1: Khu vườn của em',
        status: 'completed',
        data: {
          gardenWidth,
          gardenHeight,
          areaSqm: gardenWidth * gardenHeight,
          gardenPlants,
        },
        journal: gardenJournal,
        updatedAt: new Date().toISOString(),
      };
    } else if (activeProject === 'bakery_shop') {
      record = {
        projectCode: 'bakery_shop',
        title: 'Dự án 2: Cửa hàng bánh Pastel',
        status: 'completed',
        data: {
          cakeCost,
          cakePrice,
          cakeQty,
          changeReturned: customerPaid - cakePrice * cakeQty,
        },
        journal: cakeSlogan,
        updatedAt: new Date().toISOString(),
      };
    } else if (activeProject === 'future_city') {
      record = {
        projectCode: 'future_city',
        title: 'Dự án 3: Thành phố tương lai',
        status: 'completed',
        data: { greenParkRatio, energySource },
        journal: cityRobotTask,
        updatedAt: new Date().toISOString(),
      };
    } else if (activeProject === 'space_explorer') {
      record = {
        projectCode: 'space_explorer',
        title: 'Dự án 4: Nhà thám hiểm vũ trụ',
        status: 'completed',
        data: { targetPlanet, shipSpeedUnits },
        journal: spaceStory,
        updatedAt: new Date().toISOString(),
      };
    } else {
      record = {
        projectCode: 'little_inventor',
        title: 'Dự án 5: Nhà phát minh nhí',
        status: 'completed',
        data: { problemStatement, prototypeSolution },
        journal: testImprovement,
        updatedAt: new Date().toISOString(),
      };
    }

    onSaveProject(record);
    onAwardPraise(
      `project_${activeProject}`,
      'Kiến Trúc Sư Dự Án Liên Môn',
      'Con đã kết hợp Toán học, Khoa học, Ngôn ngữ và Thiết kế để hoàn thành sản phẩm sáng tạo!'
    );
    playFeedbackTone('success', voiceEnabled);
    speakText(`Đã lưu ${record.title} vào bộ sưu tập cá nhân!`, 'vi-VN', voiceEnabled);
    setSaveBanner(`Đã lưu "${record.title}" vào Bộ sưu tập sáng tạo của con!`);
  };

  const gardenArea = gardenWidth * gardenHeight;
  const gardenBudgetCost = gardenPlants.length * 25;

  const totalOrderPrice = cakePrice * cakeQty;
  const customerChange = customerPaid - totalOrderPrice;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="rounded-3xl bg-[#FDF2F7] border border-[#F5B8D1] text-[#263238] p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-extrabold">
          5 Dự Án Liên Môn Sáng Tạo
        </h1>
        <p className="text-xs sm:text-sm text-[#546E7A] mt-1">
          Chọn một dự án con yêu thích để tự tay thiết kế và lưu vào bộ sưu tập cá nhân nhé.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {(
            [
              { code: 'my_garden', label: '🌿 Khu vườn của em' },
              { code: 'bakery_shop', label: '🧁 Cửa hàng bánh' },
              { code: 'future_city', label: '🏙️ Thành phố tương lai' },
              { code: 'space_explorer', label: '🚀 Nhà thám hiểm vũ trụ' },
              { code: 'little_inventor', label: '💡 Nhà phát minh nhí' },
            ] as { code: ProjectCode; label: string }[]
          ).map((p) => {
            const isDone = savedProjects[p.code]?.status === 'completed';
            return (
              <button
                key={p.code}
                type="button"
                onClick={() => {
                  playFeedbackTone('pop', voiceEnabled);
                  setActiveProject(p.code);
                  setSaveBanner(null);
                }}
                className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-extrabold border transition-colors min-h-[44px] ${
                  activeProject === p.code
                    ? 'bg-[#263238] text-white border-[#263238]'
                    : 'bg-white text-[#263238] border-[#E6E4DD]'
                }`}
              >
                {isDone ? '✓ ' : ''}{p.label}
              </button>
            );
          })}
        </div>
      </div>

      {saveBanner && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3.5 text-xs font-extrabold text-emerald-950">
          🎉 {saveBanner}
        </div>
      )}

      {/* DỰ ÁN 1: KHU VƯỜN CỦA EM */}
      {activeProject === 'my_garden' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 rounded-3xl bg-white border-2 border-emerald-200 p-5 space-y-4">
            <h2 className="text-base font-extrabold text-emerald-950">
              🌿 Dự án 1: Thiết kế Khu vườn của em (Toán Diện tích + Sinh học + Ngân sách)
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Chiều dài vườn: {gardenWidth}m</label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={gardenWidth}
                  onChange={(e) => setGardenWidth(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Chiều rộng vườn: {gardenHeight}m</label>
                <input
                  type="range"
                  min={2}
                  max={6}
                  value={gardenHeight}
                  onChange={(e) => setGardenHeight(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 flex justify-around text-center text-xs">
              <div>
                <div className="text-slate-600 font-bold">Diện tích vườn</div>
                <div className="text-lg font-extrabold text-emerald-900">
                  {gardenWidth} × {gardenHeight} = {gardenArea} m²
                </div>
              </div>
              <div>
                <div className="text-slate-600 font-bold">Chu vi hàng rào</div>
                <div className="text-lg font-extrabold text-emerald-900">
                  {(gardenWidth + gardenHeight) * 2} m
                </div>
              </div>
              <div>
                <div className="text-slate-600 font-bold">Ngân sách hạt giống</div>
                <div className="text-lg font-extrabold text-amber-800">
                  {gardenBudgetCost} / 100 xu
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700">
                Chọn cây trồng cho khu vườn (25 xu / giống cây):
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'lavender', label: '💜 Hoa Oải Hương' },
                  { id: 'strawberry', label: '🍓 Dâu Tây Đỏ' },
                  { id: 'sunflower', label: '🌻 Hoa Hướng Dương' },
                  { id: 'mint', label: '🌿 Bạc Hà Thơm' },
                ].map((pl) => {
                  const active = gardenPlants.includes(pl.id);
                  return (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() =>
                        setGardenPlants(
                          active
                            ? gardenPlants.filter((x) => x !== pl.id)
                            : [...gardenPlants, pl.id]
                        )
                      }
                      className={`rounded-xl px-3 py-1.5 text-xs font-extrabold border ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {pl.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-6 rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
            <div className="text-xs font-extrabold uppercase text-emerald-800">
              Nhật ký Quan sát Khu vườn của em:
            </div>
            <textarea
              value={gardenJournal}
              onChange={(e) => setGardenJournal(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-300 p-3 text-xs"
            />
            <button
              type="button"
              onClick={handlePersistCurrentProject}
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-extrabold"
            >
              💾 Lưu Dự án Khu vườn của em
            </button>
          </div>
        </div>
      )}

      {/* DỰ ÁN 2: CỬA HÀNG BÁNH */}
      {activeProject === 'bakery_shop' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7 rounded-3xl bg-white border-2 border-pink-200 p-5 space-y-4">
            <h2 className="text-base font-extrabold text-pink-950">
              🧁 Dự án 2: Cửa hàng bánh Pastel (Tính giá bán, Tiền thừa & Quảng cáo sáng tạo)
            </h2>
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="rounded-xl bg-pink-50 p-3 border border-pink-200">
                <div className="font-bold">Giá nguyên liệu 1 bánh:</div>
                <div className="text-lg font-extrabold text-pink-900">{cakeCost} xu</div>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200">
                <label className="font-bold block">Giá bán 1 bánh ({cakePrice} xu):</label>
                <input
                  type="range"
                  min={14}
                  max={24}
                  value={cakePrice}
                  onChange={(e) => setCakePrice(Number(e.target.value))}
                  className="w-full accent-pink-600 mt-1"
                />
              </div>
              <div className="rounded-xl bg-sky-50 p-3 border border-sky-200">
                <label className="font-bold block">Khách mua ({cakeQty} chiếc):</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={cakeQty}
                  onChange={(e) => setCakeQty(Number(e.target.value))}
                  className="w-full accent-sky-600 mt-1"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 text-white p-4 text-xs space-y-1">
              <div>
                Tổng tiền hóa đơn ({cakeQty} bánh × {cakePrice} xu):{' '}
                <strong className="text-amber-300">{totalOrderPrice} xu</strong>
              </div>
              <div>
                Khách đưa <strong>{customerPaid} xu</strong> → Tiền thừa cần trả lại cho khách:{' '}
                <strong className="text-emerald-300">
                  {customerPaid} - {totalOrderPrice} = {customerChange} xu
                </strong>
              </div>
              <div>
                Tiền lãi tích lũy vào Quỹ Từ Thiện Nhí:{' '}
                <strong>{(cakePrice - cakeCost) * cakeQty} xu</strong>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
            <div className="text-xs font-extrabold uppercase text-pink-800">
              Lời giới thiệu bánh trung thực & đáng yêu:
            </div>
            <textarea
              value={cakeSlogan}
              onChange={(e) => setCakeSlogan(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-slate-300 p-3 text-xs"
            />
            <button
              type="button"
              onClick={handlePersistCurrentProject}
              className="w-full rounded-2xl bg-pink-600 hover:bg-pink-700 text-white py-3 text-xs font-extrabold"
            >
              💾 Lưu Dự án Cửa hàng bánh
            </button>
          </div>
        </div>
      )}

      {/* DỰ ÁN 3: THÀNH PHỐ TƯƠNG LAI */}
      {activeProject === 'future_city' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7 rounded-3xl bg-white border-2 border-sky-200 p-5 space-y-4">
            <h2 className="text-base font-extrabold text-sky-950">
              🏙️ Dự án 3: Thành phố tương lai Xanh & Thông minh
            </h2>
            <div className="text-xs space-y-2">
              <label className="font-bold block">
                Tỷ lệ diện tích dành cho Công viên & Cây xanh: {greenParkRatio}%
              </label>
              <input
                type="range"
                min={15}
                max={60}
                value={greenParkRatio}
                onChange={(e) => setGreenParkRatio(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEnergySource('solar_wind')}
                className={`flex-1 rounded-xl p-3 text-xs font-extrabold border ${
                  energySource === 'solar_wind'
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-white'
                }`}
              >
                ☀️🌬️ Điện Mặt Trời & Gió (Sạch 100%)
              </button>
              <button
                type="button"
                onClick={() => setEnergySource('coal')}
                className={`flex-1 rounded-xl p-3 text-xs font-extrabold border ${
                  energySource === 'coal'
                    ? 'bg-slate-700 text-white'
                    : 'bg-white'
                }`}
              >
                🏭 Nhiệt điện khói bụi
              </button>
            </div>
          </div>

          <div className="md:col-span-5 rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
            <div className="text-xs font-extrabold uppercase text-sky-900">
              Nhiệm vụ Robot Môi trường trong Thành phố của em:
            </div>
            <textarea
              value={cityRobotTask}
              onChange={(e) => setCityRobotTask(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-slate-300 p-3 text-xs"
            />
            <button
              type="button"
              onClick={handlePersistCurrentProject}
              className="w-full rounded-2xl bg-sky-600 hover:bg-sky-700 text-white py-3 text-xs font-extrabold"
            >
              💾 Lưu Dự án Thành phố tương lai
            </button>
          </div>
        </div>
      )}

      {/* DỰ ÁN 4: NHÀ THÁM HIỂM VŨ TRỤ */}
      {activeProject === 'space_explorer' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7 rounded-3xl bg-white border-2 border-indigo-200 p-5 space-y-4">
            <h2 className="text-base font-extrabold text-indigo-950">
              🚀 Dự án 4: Nhà thám hiểm Vũ trụ (Hành tinh, Trọng lực & Khoảng cách)
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'moon', name: '🌕 Mặt Trăng', dist: 30, gravity: '0.16g' },
                { id: 'mars', name: '🔴 Sao Hỏa', dist: 120, gravity: '0.38g' },
                { id: 'europa', name: '🧊 Vệ tinh Europa', dist: 300, gravity: '0.13g' },
              ].map((pl) => (
                <button
                  key={pl.id}
                  type="button"
                  onClick={() => setTargetPlanet(pl.id as 'mars' | 'moon' | 'europa')}
                  className={`rounded-xl p-3 text-left text-xs font-bold border ${
                    targetPlanet === pl.id
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-white'
                  }`}
                >
                  <div>{pl.name}</div>
                  <div className="text-[11px] opacity-80">Khoảng cách mô hình: {pl.dist} đơn vị</div>
                  <div className="text-[11px] opacity-80">Trọng lực: {pl.gravity}</div>
                </button>
              ))}
            </div>
            <div className="rounded-xl bg-indigo-50 p-3 text-xs font-bold text-indigo-950">
              Với vận tốc tàu vũ trụ {shipSpeedUnits} đơn vị/ngày → Thời gian hành trình mô hình:{' '}
              {Math.round(
                (targetPlanet === 'moon' ? 30 : targetPlanet === 'mars' ? 120 : 300) /
                  shipSpeedUnits
              )}{' '}
              ngày!
            </div>
          </div>

          <div className="md:col-span-5 rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
            <div className="text-xs font-extrabold uppercase text-indigo-900">
              Nhật ký Chuyến thám hiểm Vũ trụ của em:
            </div>
            <textarea
              value={spaceStory}
              onChange={(e) => setSpaceStory(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-slate-300 p-3 text-xs"
            />
            <button
              type="button"
              onClick={handlePersistCurrentProject}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-xs font-extrabold"
            >
              💾 Lưu Dự án Nhà thám hiểm vũ trụ
            </button>
          </div>
        </div>
      )}

      {/* DỰ ÁN 5: NHÀ PHÁT MINH NHÍ */}
      {activeProject === 'little_inventor' && (
        <div className="rounded-3xl bg-white border-2 border-amber-200 p-5 space-y-4">
          <h2 className="text-base font-extrabold text-amber-950">
            💡 Dự án 5: Nhà phát minh nhí (Vấn đề → Giải pháp → Nguyên mẫu → Kiểm thử & Cải tiến)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                1. Vấn đề thực tế em quan sát thấy:
              </label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 p-2.5"
              />
            </div>
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                2. Thiết kế nguyên mẫu giải quyết:
              </label>
              <textarea
                value={prototypeSolution}
                onChange={(e) => setPrototypeSolution(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 p-2.5"
              />
            </div>
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                3. Kết quả kiểm thử & Cải tiến:
              </label>
              <textarea
                value={testImprovement}
                onChange={(e) => setTestImprovement(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 p-2.5"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handlePersistCurrentProject}
            className="rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 text-xs font-extrabold"
          >
            💾 Lưu Hồ sơ Sáng chế của Nhà phát minh nhí
          </button>
        </div>
      )}
    </div>
  );
};
