// ============================================================================
// EduExplore – Deterministic Mathematical & Scientific Evaluation Engine
// Kiểm tra đáp án chính xác bằng thuật toán, độc lập hoàn toàn với AI
// ============================================================================

import type {
  Lesson,
  LessonProgressRecord,
  LessonTask,
  MasteryLevel,
  StudentProfile,
} from '../types/education.ts';

export interface SimulationSubmission {
  // 1. Toán Lớp 1: Phép cộng trái cây
  basketA?: number;
  basketB?: number;
  userNumericAnswer?: number;

  // 2. Toán Lớp 2: Đồng hồ tương tác
  hour?: number;
  minute?: number;
  dayPeriod?: 'morning' | 'afternoon' | 'evening' | 'night';

  // 3. Toán Lớp 3: Phân số chia bánh
  totalSlices?: number;
  shadedSlices?: number;
  compareModeEquivalent?: boolean;

  // 4. Khoa học Lớp 4: Vòng tuần hoàn của nước
  sunTempC?: number;
  windLevel?: number;
  cloudAltitude?: number;
  observedProcesses?: string[];

  // 5. Toán Lớp 5: Hình học Chu vi & Diện tích
  widthUnits?: number;
  heightUnits?: number;
  userPerimeter?: number;
  userArea?: number;

  // 6. Tiếng Việt: Dựng câu & Kể chuyện từ tranh
  selectedWords?: string[];
  storyOrder?: string[];
  chosenEnding?: string;

  // 7. Khoa học: Cây phát triển
  lightLevel?: number;
  waterLevel?: number;
  daysSimulated?: number;

  // 8. Tiếng Anh: Khám phá tình huống
  foundObjectIds?: string[];
  spokenSentence?: string;

  // 9. Lịch sử - Địa lý - Đạo đức - Tin học
  selectedRegionId?: string;
  ethicsChoiceId?: string;

  // 10. Công nghệ, AI & Lập trình
  aiTrainedCorrectCount?: number;
  debugFixedCommand?: string;

  // 11. Nghệ thuật, Âm nhạc & Thiết kế
  mixedColorCode?: string;
  symmetryCellsCount?: number;

  // 12. Logic, Kỹ năng sống & Tài chính
  selectedBudgetItems?: string[];
}

export interface EvaluationResult {
  isCorrect: boolean;
  diagnosticCode: string;
  misconceptionDetected?: string;
  mathematicalProof: string;
  encouragement: string;
}

/**
 * Ước chung lớn nhất để rút gọn phân số chính xác
 */
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

/**
 * Kiểm tra hai phân số có bằng nhau về giá trị toán học hay không (ví dụ 1/2 == 2/4 == 3/6)
 */
export function areFractionsEquivalent(
  num1: number,
  den1: number,
  num2: number,
  den2: number
): boolean {
  if (den1 <= 0 || den2 <= 0) return false;
  return num1 * den2 === num2 * den1;
}

/**
 * Kiểm tra kết quả bài tập dựa trên thuật toán xác định (Deterministic Validator)
 */
export function evaluateTaskSubmission(
  task: LessonTask,
  submission: SimulationSubmission
): EvaluationResult {
  const cfg = task.expectedConfig;

  switch (task.validatorType) {
    case 'fruit_sum': {
      const targetA = Number(cfg.targetA ?? 3);
      const targetB = Number(cfg.targetB ?? 2);
      const targetSum = Number(cfg.targetSum ?? targetA + targetB);
      const requireSpecificGroups = Boolean(cfg.requireSpecificGroups ?? true);

      const a = Number(submission.basketA ?? 0);
      const b = Number(submission.basketB ?? 0);
      const totalInBaskets = a + b;
      const ans =
        submission.userNumericAnswer !== undefined
          ? Number(submission.userNumericAnswer)
          : totalInBaskets;

      if (requireSpecificGroups && (a !== targetA || b !== targetB)) {
        return {
          isCorrect: false,
          diagnosticCode: 'GROUP_MISMATCH',
          misconceptionDetected: `Cần đặt đúng số lượng ở 2 nhóm (${targetA} và ${targetB}), hiện tại là ${a} và ${b}.`,
          mathematicalProof: `Nhóm 1 hiện có ${a}, Nhóm 2 hiện có ${b}. Tổng trên bàn là ${a} + ${b} = ${totalInBaskets}.`,
          encouragement:
            'Con hãy quan sát kỹ số quả cần đặt vào từng rổ trước khi gộp lại nhé!',
        };
      }

      if (totalInBaskets !== targetSum) {
        return {
          isCorrect: false,
          diagnosticCode: 'SUM_COUNT_MISMATCH',
          misconceptionDetected: `Tổng số quả trong giỏ là ${totalInBaskets}, chưa bằng ${targetSum}.`,
          mathematicalProof: `${a} + ${b} = ${totalInBaskets} (mục tiêu là ${targetSum}).`,
          encouragement: 'Con hãy thêm hoặc bớt quả táo trong rổ rồi đếm lại từng quả nhé!',
        };
      }

      if (ans !== targetSum) {
        return {
          isCorrect: false,
          diagnosticCode: 'SYMBOLIC_ANSWER_MISMATCH',
          misconceptionDetected: `Con đã xếp đúng ${totalInBaskets} quả nhưng điền số ${ans}.`,
          mathematicalProof: `Trong giỏ có ${a} quả + ${b} quả = ${totalInBaskets} quả.`,
          encouragement:
            'Số quả trong giỏ đã đúng rồi! Con đếm lại tổng số quả và chọn số tương ứng nhé.',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'EXACT_MATCH',
        mathematicalProof: `${a} + ${b} = ${targetSum}. Khi gộp ${a} vật và ${b} vật, ta đếm tiếp từ ${a}: ${Array.from({ length: b }, (_, i) => a + i + 1).join(', ')}.`,
        encouragement: 'Tuyệt vời! Con đã tự tay gộp các quả táo và tìm ra bản chất của phép cộng!',
      };
    }

    case 'clock_time': {
      const targetHour = Number(cfg.targetHour ?? 7);
      const targetMinute = Number(cfg.targetMinute ?? 30);
      const h = ((Number(submission.hour ?? 12) - 1 + 12) % 12) + 1;
      const m = ((Number(submission.minute ?? 0) % 60) + 60) % 60;

      // Kiểm tra lỗi phổ biến: nhầm kim ngắn (giờ) và kim dài (phút)
      const swappedHourAsMinute = ((targetHour % 12) * 5) % 60;
      if (m === swappedHourAsMinute && h !== targetHour) {
        return {
          isCorrect: false,
          diagnosticCode: 'SWAPPED_CLOCK_HANDS',
          misconceptionDetected: 'Nhầm lẫn giữa kim ngắn (chỉ giờ) và kim dài (chỉ phút).',
          mathematicalProof: `Kim ngắn chỉ giờ (${h} giờ), kim dài chỉ phút (${m} phút = số ${m / 5 || 12} × 5).`,
          encouragement:
            'Con lưu ý nhé: Kim NGẮN đi chậm chỉ GIỜ, còn kim DÀI đi nhanh chỉ PHÚT!',
        };
      }

      if (h !== targetHour || m !== targetMinute) {
        return {
          isCorrect: false,
          diagnosticCode: 'TIME_MISMATCH',
          misconceptionDetected: `Đồng hồ đang chỉ ${h} giờ ${m.toString().padStart(2, '0')} phút thay vì ${targetHour} giờ ${targetMinute.toString().padStart(2, '0')} phút.`,
          mathematicalProof: `Mỗi vạch số lớn trên đồng hồ ứng với 5 phút. ${targetMinute} phút tương ứng kim dài chỉ vào số ${targetMinute === 0 ? 12 : targetMinute / 5}.`,
          encouragement:
            'Con hãy chỉnh kim ngắn chỉ giờ trước, rồi xoay kim dài đếm thêm từng bước 5 phút nhé!',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'EXACT_TIME',
        mathematicalProof: `${targetHour} giờ ${targetMinute.toString().padStart(2, '0')} phút: Kim giờ ở vị trí ${targetHour}${targetMinute >= 30 ? ' rưỡi' : ''}, kim phút ở vạch ${targetMinute} phút (${targetMinute / 5 || 12} × 5 = ${targetMinute}).`,
        encouragement: 'Chính xác! Con đã làm chủ cách xem đồng hồ kim rất chuẩn!',
      };
    }

    case 'fraction_value': {
      const targetNum = Number(cfg.numerator ?? 1);
      const targetDen = Number(cfg.denominator ?? 2);
      const requireExactDenominator = Boolean(cfg.requireExactDenominator ?? false);

      const slices = Number(submission.totalSlices ?? 1);
      const shaded = Number(submission.shadedSlices ?? 0);

      if (shaded === targetNum && slices !== targetDen && !areFractionsEquivalent(shaded, slices, targetNum, targetDen)) {
        return {
          isCorrect: false,
          diagnosticCode: 'DENOMINATOR_IGNORED',
          misconceptionDetected: `Chọn đúng ${shaded} phần nhưng tổng số phần bánh là ${slices} (phân số ${shaded}/${slices} khác ${targetNum}/${targetDen}).`,
          mathematicalProof: `Mẫu số là tổng số phần bằng nhau của cả chiếc bánh (${slices}), tử số là số phần được lấy (${shaded}).`,
          encouragement:
            'Con nhớ kiểm tra xem chiếc bánh đã được chia thành mấy phần bằng nhau (mẫu số) nhé!',
        };
      }

      if (requireExactDenominator && (slices !== targetDen || shaded !== targetNum)) {
        return {
          isCorrect: false,
          diagnosticCode: 'EXACT_FRACTION_MISMATCH',
          misconceptionDetected: `Cần biểu diễn đúng phân số ${targetNum}/${targetDen}, hiện tại là ${shaded}/${slices}.`,
          mathematicalProof: `Hiện tại: ${shaded}/${slices}. Cần chia bánh thành ${targetDen} phần bằng nhau và tô màu ${targetNum} phần.`,
          encouragement: `Con hãy chia bánh thành ${targetDen} phần và tô màu ${targetNum} phần nhé!`,
        };
      }

      const isEq = areFractionsEquivalent(shaded, slices, targetNum, targetDen);
      if (!isEq) {
        return {
          isCorrect: false,
          diagnosticCode: 'FRACTION_VALUE_MISMATCH',
          misconceptionDetected: `Phân số ${shaded}/${slices} không bằng ${targetNum}/${targetDen}.`,
          mathematicalProof: `${shaded}/${slices} = ${(shaded / slices).toFixed(2)}, trong khi ${targetNum}/${targetDen} = ${(targetNum / targetDen).toFixed(2)}.`,
          encouragement:
            'Con hãy quan sát diện tích phần bánh được tô màu xem đã khớp với phần mẫu chưa nhé!',
        };
      }

      const divisor = gcd(shaded, slices);
      return {
        isCorrect: true,
        diagnosticCode: 'EQUIVALENT_FRACTION_MATCH',
        mathematicalProof: `${shaded}/${slices} rút gọn cho ${divisor} được ${shaded / divisor}/${slices / divisor} (bằng ${targetNum}/${targetDen}).`,
        encouragement:
          shaded === targetNum
            ? `Tuyệt vời! Con đã tạo đúng phân số ${shaded}/${slices}!`
            : `Xuất sắc! Con phát hiện ra ${shaded}/${slices} có diện tích bằng hệt ${targetNum}/${targetDen} (phân số tương đương)!`,
      };
    }

    case 'water_cycle_state': {
      const minSun = Number(cfg.minSunTempC ?? 28);
      const minWind = Number(cfg.minWindLevel ?? 2);
      const sun = Number(submission.sunTempC ?? 20);
      const wind = Number(submission.windLevel ?? 1);
      const processes = submission.observedProcesses ?? [];

      const hasAllStages =
        processes.includes('evaporation') &&
        processes.includes('condensation') &&
        processes.includes('precipitation');

      if (sun < minSun) {
        return {
          isCorrect: false,
          diagnosticCode: 'INSUFFICIENT_EVAPORATION_HEAT',
          misconceptionDetected: `Nhiệt độ Mặt Trời (${sun}°C) còn thấp nên nước bốc hơi rất chậm.`,
          mathematicalProof: `Khi nhiệt độ đạt từ ${minSun}°C trở lên, các phân tử nước mặt biển nhận nhiệt năng chuyển thành hơi nước bay lên cao.`,
          encouragement:
            'Con hãy tăng độ ấm của Mặt Trời để quan sát hiện tượng nước bốc hơi mạnh hơn nhé!',
        };
      }

      if (wind < minWind || !hasAllStages) {
        return {
          isCorrect: false,
          diagnosticCode: 'INCOMPLETE_WATER_CYCLE',
          misconceptionDetected: 'Chu trình chưa đi qua đủ 3 giai đoạn: Bốc hơi → Ngưng tụ thành mây → Mưa.',
          mathematicalProof: `Cần đủ nhiệt độ (${sun}°C >= ${minSun}°C) và gió đưa hơi nước lên vùng khí quyển lạnh để ngưng tụ và tạo mưa.`,
          encouragement:
            'Con hãy điều chỉnh thêm sức gió và bấm cho hơi nước bay lên cao gặp lạnh ngưng tụ thành mưa nhé!',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'WATER_CYCLE_COMPLETE',
        mathematicalProof: `Ở ${sun}°C và mức gió ${wind}, nước bốc hơi (Evaporation) → lên cao gặp lạnh ngưng tụ thành hạt nước nhỏ tạo mây (Condensation) → hạt nước nặng rơi xuống thành mưa (Precipitation) → chảy về sông biển.`,
        encouragement:
          'Hoàn hảo! Con đã tự điều khiển các yếu tố tự nhiên để vận hành trọn vẹn vòng tuần hoàn của nước!',
      };
    }

    case 'geometry_rect': {
      const w = Number(submission.widthUnits ?? 0);
      const h = Number(submission.heightUnits ?? 0);
      const actualPerimeter = 2 * (w + h);
      const actualArea = w * h;

      const targetPerimeter = cfg.targetPerimeter !== undefined ? Number(cfg.targetPerimeter) : undefined;
      const targetArea = cfg.targetArea !== undefined ? Number(cfg.targetArea) : undefined;

      // Phát hiện nhầm lẫn kinh điển: Nhầm công thức chu vi và diện tích
      if (targetArea !== undefined && actualPerimeter === targetArea && actualArea !== targetArea) {
        return {
          isCorrect: false,
          diagnosticCode: 'CONFUSED_PERIMETER_WITH_AREA',
          misconceptionDetected: `Nhầm lẫn giữa Chu vi (độ dài đường bao quanh = ${actualPerimeter}) và Diện tích (số ô vuông bên trong = ${actualArea}).`,
          mathematicalProof: `Hình ${w} × ${h} có Chu vi P = (${w} + ${h}) × 2 = ${actualPerimeter} đơn vị dài, còn Diện tích S = ${w} × ${h} = ${actualArea} ô vuông.`,
          encouragement:
            'Con hãy đếm số ô vuông nằm BÊN TRONG hình để tìm diện tích, đừng nhầm với độ dài hàng rào bao quanh nhé!',
        };
      }

      if (targetArea !== undefined && actualArea !== targetArea) {
        return {
          isCorrect: false,
          diagnosticCode: 'AREA_MISMATCH',
          misconceptionDetected: `Diện tích hiện tại là ${w} × ${h} = ${actualArea} ô vuông, mục tiêu là ${targetArea} ô vuông.`,
          mathematicalProof: `S = chiều dài (${w}) × chiều rộng (${h}) = ${actualArea} (cần ${targetArea}).`,
          encouragement: `Con hãy kéo cạnh hình chữ nhật sao cho tổng số ô vuông bên trong đúng bằng ${targetArea} nhé!`,
        };
      }

      if (targetPerimeter !== undefined && actualPerimeter !== targetPerimeter) {
        return {
          isCorrect: false,
          diagnosticCode: 'PERIMETER_MISMATCH',
          misconceptionDetected: `Chu vi hiện tại là (${w} + ${h}) × 2 = ${actualPerimeter}, mục tiêu là ${targetPerimeter}.`,
          mathematicalProof: `P = (${w} + ${h}) × 2 = ${actualPerimeter} (cần ${targetPerimeter}).`,
          encouragement: `Con hãy điều chỉnh chiều dài và chiều rộng để tổng 4 cạnh bao quanh bằng ${targetPerimeter} nhé!`,
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'GEOMETRY_VERIFIED',
        mathematicalProof: `Hình chữ nhật kích thước ${w} × ${h} có Chu vi P = (${w} + ${h}) × 2 = ${actualPerimeter} và Diện tích S = ${w} × ${h} = ${actualArea} ô vuông đơn vị.`,
        encouragement:
          'Tuyệt vời! Con thấy đấy, có nhiều cách chọn chiều dài và chiều rộng khác nhau để thoả mãn bài toán!',
      };
    }

    case 'vietnamese_sentence': {
      const words = submission.selectedWords ?? [];
      const joined = words.join(' ').trim().toLowerCase();
      const validPatterns = (cfg.validPatterns as string[]) ?? [
        'chú mèo vàng đang nằm ngủ dưới gốc cây',
        'dưới gốc cây chú mèo vàng đang nằm ngủ',
        'chú mèo đang nằm ngủ dưới gốc cây xanh',
        'chú mèo vàng nằm ngủ dưới gốc cây xanh',
      ];

      const isMeaningful =
        validPatterns.some((p) => joined.includes(p.toLowerCase())) ||
        (words.length >= 3 &&
          joined.includes('mèo') &&
          (joined.includes('ngủ') || joined.includes('nằm') || joined.includes('sưởi nắng')) &&
          joined.includes('cây'));

      if (!isMeaningful) {
        return {
          isCorrect: false,
          diagnosticCode: 'SENTENCE_INCOMPLETE',
          misconceptionDetected: 'Câu ghép chưa đủ bộ phận Chủ ngữ (Ai/Con gì?) và Vị ngữ (Làm gì? Ở đâu?).',
          mathematicalProof: `Câu hiện tại: "${words.join(' ') || '(trống)'}". Một câu trọn vẹn cần nêu rõ đối tượng (chú mèo) và hoạt động/trạng thái (đang ngủ dưới gốc cây).`,
          encouragement:
            'Con hãy chọn các từ chỉ sự vật ("Chú mèo...") và từ chỉ hoạt động ("đang nằm ngủ...") để tạo thành câu có nghĩa nhé!',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'VALID_EXPRESSIVE_SENTENCE',
        mathematicalProof: `Câu "${words.join(' ')}" có đầy đủ Chủ ngữ và Vị ngữ, diễn tả đúng bức tranh minh họa.`,
        encouragement:
          'Câu văn của con rất sinh động và đúng ngữ pháp! Trong Tiếng Việt, con có thể diễn đạt theo nhiều cách miễn là rõ ý!',
      };
    }

    case 'plant_optimal': {
      const light = Number(submission.lightLevel ?? 0);
      const water = Number(submission.waterLevel ?? 0);
      const minLight = Number(cfg.minLight ?? 50);
      const maxLight = Number(cfg.maxLight ?? 85);
      const minWater = Number(cfg.minWater ?? 45);
      const maxWater = Number(cfg.maxWater ?? 80);

      if (light < minLight) {
        return {
          isCorrect: false,
          diagnosticCode: 'LIGHT_DEFICIT',
          misconceptionDetected: 'Thiếu ánh sáng nên lá cây vàng úa, không quang hợp đủ chất dinh dưỡng.',
          mathematicalProof: `Ánh sáng hiện tại ${light}% < mức tối ưu (${minLight}% - ${maxLight}%).`,
          encouragement: 'Con hãy tăng thêm ánh sáng Mặt Trời để lá cây quang hợp xanh tốt nhé!',
        };
      }
      if (water < minWater || water > maxWater) {
        return {
          isCorrect: false,
          diagnosticCode: water < minWater ? 'WATER_DEFICIT' : 'WATER_EXCESS',
          misconceptionDetected:
            water < minWater
              ? 'Thiếu nước khiến cây bị héo.'
              : 'Tưới quá nhiều nước làm ngập úng rễ cây.',
          mathematicalProof: `Độ ẩm hiện tại ${water}% nằm ngoài khoảng cân bằng (${minWater}% - ${maxWater}%).`,
          encouragement:
            water < minWater
              ? 'Cây đang khát nước! Con hãy tăng lượng nước tưới nhé.'
              : 'Nhiều nước quá làm rễ cây khó thở! Con giảm bớt lượng nước một chút nhé.',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'PLANT_THRIVING',
        mathematicalProof: `Với ánh sáng ${light}% và độ ẩm ${water}%, cây quang hợp mạnh mẽ, thân cao khỏe và ra hoa.`,
        encouragement: 'Xuất sắc! Con đã tìm ra sự cân bằng giữa ánh sáng và nước cho cây phát triển!',
      };
    }

    case 'english_situational': {
      const requiredItems = (cfg.requiredItems as string[]) ?? ['book', 'apple', 'clock'];
      const found = submission.foundObjectIds ?? [];
      const allFound = requiredItems.every((item) => found.includes(item));

      if (!allFound) {
        const missing = requiredItems.filter((item) => !found.includes(item));
        return {
          isCorrect: false,
          diagnosticCode: 'MISSING_VOCAB_OBJECTS',
          misconceptionDetected: `Con còn thiếu ${missing.length} đồ vật trong phòng chưa bấm khám phá.`,
          mathematicalProof: `Đã tìm thấy: ${found.length}/${requiredItems.length} đồ vật mục tiêu.`,
          encouragement:
            'Con hãy bấm vào các đồ vật trong căn phòng để nghe phát âm tiếng Anh và tìm đủ đồ vật theo yêu cầu nhé!',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'ENGLISH_SITUATIONAL_MASTERED',
        mathematicalProof: `Đã nhận diện và ghép câu chính xác với các từ vựng: ${requiredItems.join(', ')}.`,
        encouragement: 'Great job! Con đã kết nối từ vựng tiếng Anh với đồ vật thực tế rất tốt!',
      };
    }

    case 'vietnam_region_ethics': {
      const expectedRegion = String(cfg.expectedRegion ?? 'north');
      const expectedEthics = String(cfg.expectedEthics ?? 'safe_verify');
      const regionOk = !cfg.expectedRegion || submission.selectedRegionId === expectedRegion;
      const ethicsOk = !cfg.expectedEthics || submission.ethicsChoiceId === expectedEthics;

      if (!regionOk || !ethicsOk) {
        return {
          isCorrect: false,
          diagnosticCode: 'SOCIAL_CIVICS_MISMATCH',
          misconceptionDetected: !regionOk
            ? 'Vùng địa lý vừa chọn chưa đúng với đặc điểm trong câu hỏi.'
            : 'Cách ứng xử vừa chọn chưa đảm bảo an toàn trên môi trường mạng.',
          mathematicalProof: `Cần chọn đúng vùng lãnh thổ trên bản đồ Việt Nam và nguyên tắc an toàn thông tin cá nhân.`,
          encouragement:
            'Con hãy quan sát lại bản đồ chữ S của Việt Nam và suy nghĩ xem hành động nào giúp bảo vệ bản thân an toàn nhé!',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'SOCIAL_CIVICS_VERIFIED',
        mathematicalProof: 'Đã xác định đúng vị trí địa lý Việt Nam và lựa chọn hành vi văn minh, an toàn.',
        encouragement: 'Chính xác! Con vừa hiểu địa lý quê hương vừa biết tự bảo vệ mình trên Internet!',
      };
    }

    case 'tech_ai_classifier': {
      const minSamples = Number(cfg.minTrainedSamples ?? 4);
      const expectedCmd = String(cfg.expectedDebugCommand ?? 'TURN_RIGHT');
      const trained = Number(submission.aiTrainedCorrectCount ?? 0);
      const cmd = String(submission.debugFixedCommand ?? '');

      if (trained < minSamples) {
        return {
          isCorrect: false,
          diagnosticCode: 'AI_TRAINING_DATA_INCOMPLETE',
          misconceptionDetected: `Dữ liệu dạy cho AI mới đạt ${trained}/${minSamples} mẫu chuẩn nên AI vẫn còn phân loại nhầm.`,
          mathematicalProof: `Huấn luyện có giám sát cần đủ ${minSamples}/${minSamples} mẫu được gán nhãn đúng (Sinh vật biển vs Rác nhựa).`,
          encouragement:
            'Con hãy gán nhãn đúng cho cả 4 vật thể dưới biển để Robot AI học thật chính xác nhé!',
        };
      }

      if (cmd !== expectedCmd) {
        return {
          isCorrect: false,
          diagnosticCode: 'ALGORITHM_BUG_UNFIXED',
          misconceptionDetected: `Khối lệnh đang chọn là ${cmd || 'chưa chọn'}, tàu ngầm vẫn vướng đá ngầm.`,
          mathematicalProof: `Tại bước gặp đá ngầm bên trái, thuật toán cần lệnh ${expectedCmd} (Rẽ Phải tránh đá).`,
          encouragement:
            'Dữ liệu AI đã chuẩn rồi! Bây giờ con chọn khối lệnh "Rẽ Phải tránh đá (TURN_RIGHT)" để gỡ lỗi cho tàu ngầm nhé!',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'TECH_AI_AND_DEBUG_MASTERED',
        mathematicalProof: `AI đã học 100% (${trained}/${minSamples}) mẫu chuẩn và thuật toán điều hướng đã được gỡ lỗi bằng lệnh ${expectedCmd}.`,
        encouragement:
          'Tuyệt vời! Con đã huấn luyện AI thành công và gỡ lỗi thuật toán chuẩn xác như một Kỹ sư Nhí!',
      };
    }

    case 'art_symmetry_mix': {
      const minPairs = Number(cfg.minSymmetryPairs ?? 4);
      const pairs = Number(submission.symmetryCellsCount ?? 0);
      const color = String(submission.mixedColorCode ?? 'lavender');

      if (pairs < minPairs) {
        return {
          isCorrect: false,
          diagnosticCode: 'SYMMETRY_PAIRS_INSUFFICIENT',
          misconceptionDetected: `Bức vẽ mới có ${pairs} cặp ô đối xứng (cần ít nhất ${minPairs} cặp ô).`,
          mathematicalProof: `Đối xứng trục yêu cầu mỗi ô tại (x, y) bên trái có một ô phản chiếu tương ứng bên phải trục gương. Hiện có ${pairs}/${minPairs} cặp.`,
          encouragement:
            'Con hãy bấm tô thêm các ô trên đôi cánh bướm để tạo đủ ít nhất 4 cặp ô đối xứng rực rỡ nhé!',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'ART_SYMMETRY_CREATED',
        mathematicalProof: `Hoàn thành thiết kế đối xứng trục gương với ${pairs} cặp ô cân xứng và hòa sắc Pastel (${color}).`,
        encouragement:
          'Tác phẩm đẹp quá! Con đã kết hợp hài hòa lý thuyết pha màu Pastel và phép đối xứng hình học!',
      };
    }

    case 'finance_budget_balance': {
      const BUDGET_CATALOG: Record<string, { cost: number; type: 'need' | 'want' }> = {
        notebook: { cost: 25, type: 'need' },
        stationery: { cost: 20, type: 'need' },
        healthy_lunch: { cost: 25, type: 'need' },
        science_book: { cost: 30, type: 'need' },
        sticker_pack: { cost: 15, type: 'want' },
        plush_toy: { cost: 45, type: 'want' },
        candy_box: { cost: 20, type: 'want' },
      };

      const chosen = submission.selectedBudgetItems ?? [];
      let totalCost = 0;
      let needsCount = 0;
      for (const id of chosen) {
        const item = BUDGET_CATALOG[id];
        if (item) {
          totalCost += item.cost;
          if (item.type === 'need') needsCount += 1;
        }
      }
      const savedCoins = 100 - totalCost;
      const minNeeds = Number(cfg.minNeedsCount ?? 2);
      const minSaved = Number(cfg.minSavedCoins ?? 20);

      if (needsCount < minNeeds) {
        return {
          isCorrect: false,
          diagnosticCode: 'NEEDS_INSUFFICIENT',
          misconceptionDetected: `Giỏ hàng mới có ${needsCount} món Cần thiết (cần ít nhất ${minNeeds} món thiết yếu cho học tập/sức khỏe).`,
          mathematicalProof: `Đã chọn ${needsCount}/${minNeeds} món Cần thiết. Tổng chi: ${totalCost} xu, Còn lại: ${savedCoins} xu.`,
          encouragement:
            'Con nhớ ưu tiên chọn ít nhất 2 món đồ [CẦN THIẾT] trước khi mua đồ chơi hoặc kẹo nhé!',
        };
      }

      if (savedCoins < minSaved) {
        return {
          isCorrect: false,
          diagnosticCode: 'SAVINGS_BELOW_TARGET',
          misconceptionDetected: `Tổng chi tiêu là ${totalCost} xu nên Lọ Tiết Kiệm chỉ còn ${savedCoins} xu (cần tiết kiệm ít nhất ${minSaved} xu).`,
          mathematicalProof: `100 xu - ${totalCost} xu = ${savedCoins} xu < ${minSaved} xu mục tiêu tiết kiệm.`,
          encouragement:
            'Con đã tiêu hơi quá tay rồi! Hãy bớt đi 1 món chưa thật sự cần thiết để giữ lại ít nhất 20 xu trong Lọ Tiết Kiệm nhé!',
        };
      }

      return {
        isCorrect: true,
        diagnosticCode: 'SMART_BUDGET_VERIFIED',
        mathematicalProof: `Ngân sách 100 xu = Đã chi ${totalCost} xu (${needsCount} món Cần thiết) + Tiết kiệm ${savedCoins} xu (>= ${minSaved} xu).`,
        encouragement:
          'Tuyệt vời! Kế hoạch chi tiêu của con vừa đảm bảo đủ đồ dùng thiết yếu vừa có khoản tiết kiệm thông thái!',
      };
    }
  }
}

/**
 * Tính toán mức độ làm chủ kiến thức (Mastery Level)
 * Không chỉ dùng % đúng sai: Phân biệt rõ:
 * - Tự làm đúng (mastered_independently)
 * - Làm đúng nhờ gợi ý (mastered_with_hints)
 * - Có thể tự giải thích bản chất (can_explain)
 * - Cần luyện tập thêm (needs_practice)
 */
export function computeMasteryLevel(record: LessonProgressRecord, totalTasks: number): MasteryLevel {
  if (record.completedTaskIds.length === 0 && record.attemptsCount === 0) {
    return 'not_started';
  }
  const allCompleted = record.completedTaskIds.length >= totalTasks;
  if (!allCompleted) {
    return 'needs_practice';
  }
  if (record.canExplainVerified) {
    return 'can_explain';
  }
  if (record.hintsUsedCount === 0 && record.attemptsCount <= totalTasks + 1) {
    return 'mastered_independently';
  }
  return 'mastered_with_hints';
}

/**
 * Hệ thống cá nhân hóa đề xuất bài học tiếp theo dựa trên dữ liệu thực tế
 */
export function getPersonalizedRecommendations(
  profile: StudentProfile,
  allLessons: Lesson[]
): {
  lesson: Lesson;
  reason: string;
  priority: 'review_misconception' | 'continue_grade' | 'stretch_challenge';
}[] {
  const approvedLessons = allLessons.filter((l) => l.status === 'approved');
  const recommendations: {
    lesson: Lesson;
    reason: string;
    priority: 'review_misconception' | 'continue_grade' | 'stretch_challenge';
  }[] = [];

  // 1. Ưu tiên bài học đang cần luyện tập thêm hoặc còn lỗi thường gặp
  for (const lesson of approvedLessons) {
    const prog = profile.progressMap[lesson.id];
    if (prog && prog.mastery === 'needs_practice') {
      recommendations.push({
        lesson,
        reason: `Cần củng cố thêm (${prog.commonMistakes[0] || 'hoàn thành nốt các thử nghiệm tương tác'}).`,
        priority: 'review_misconception',
      });
    } else if (prog && prog.mastery === 'mastered_with_hints' && !prog.canExplainVerified) {
      recommendations.push({
        lesson,
        reason: 'Con đã làm được với gợi ý — hãy thử tự giải thích bản chất mà không cần trợ giúp nhé!',
        priority: 'review_misconception',
      });
    }
  }

  // 2. Bài học cùng khối lớp của học sinh chưa học
  for (const lesson of approvedLessons.filter((l) => l.grade === profile.currentGrade)) {
    const prog = profile.progressMap[lesson.id];
    if (!prog || prog.mastery === 'not_started') {
      recommendations.push({
        lesson,
        reason: `Bài học trọng tâm chương trình Lớp ${profile.currentGrade} phù hợp năng lực hiện tại.`,
        priority: 'continue_grade',
      });
    }
  }

  // 3. Mở rộng khám phá các lớp lân cận
  for (const lesson of approvedLessons.filter((l) => l.grade !== profile.currentGrade)) {
    const prog = profile.progressMap[lesson.id];
    if (!prog || prog.mastery === 'not_started') {
      recommendations.push({
        lesson,
        reason: `Khám phá mở rộng liên môn (${lesson.topicTitle} - Lớp ${lesson.grade}).`,
        priority: 'stretch_challenge',
      });
    }
  }

  return recommendations.slice(0, 6);
}
