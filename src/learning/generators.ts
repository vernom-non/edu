// ============================================================================
// Little Genius – Focused Learning: Bộ sinh biến thể bài tập theo quy tắc
// Mỗi biến thể có đáp án được tính bằng thuật toán & kèm biểu thức kiểm chứng.
// Dùng cho nút "Luyện thêm" và làm câu tương đương sau khi bé nhận gợi ý.
// ============================================================================

import type { FocusTask } from './types.ts';

export type VariantFamily =
  | 'division_groups'
  | 'division_remainder'
  | 'multiplication_array'
  | 'add_carry'
  | 'sub_borrow'
  | 'place_value'
  | 'sequence_arithmetic'
  | 'sequence_geometric'
  | 'fraction_shade'
  | 'rect_area'
  | 'rect_perimeter';

/** Bộ sinh số giả ngẫu nhiên có hạt giống (Mulberry32) – cùng seed luôn cho cùng bài */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pickInt = (r: () => number, min: number, max: number) => min + Math.floor(r() * (max - min + 1));
const pick = <T,>(r: () => number, arr: T[]): T => arr[Math.floor(r() * arr.length)];

const ITEMS = [
  { emoji: '🧁', name: 'chiếc bánh', box: 'hộp' },
  { emoji: '🍎', name: 'quả táo', box: 'giỏ' },
  { emoji: '✏️', name: 'cây bút chì', box: 'hộp bút' },
  { emoji: '🌷', name: 'bông hoa', box: 'bình' },
  { emoji: '🥚', name: 'quả trứng', box: 'khay' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function generateVariant(family: VariantFamily, seed: number): FocusTask {
  const r = rng(seed * 7919 + family.length * 104729);
  const id = `gen-${family}-${seed}`;

  switch (family) {
    case 'division_groups': {
      const per = pickInt(r, 2, 9);
      const groups = pickInt(r, 2, 6);
      const it = pick(r, ITEMS);
      return {
        id,
        kind: 'grouping',
        stage: 'practice',
        skill: 'math.division.equal-groups',
        prompt: `Có ${per * groups} ${it.name}, mỗi ${it.box} ${per}. Cần mấy ${it.box}?`,
        emoji: it.emoji,
        total: per * groups,
        perGroup: per,
        groupLabel: it.box,
        hints: [
          `Mỗi ${it.box} chứa bao nhiêu ${it.name}?`,
          `Ví dụ: 10 ${it.name}, mỗi ${it.box} 5 → 2 ${it.box}.`,
          `Đặt lần lượt ${per} ${it.name} vào mỗi ${it.box} rồi đếm số ${it.box}.`,
          `${it.emoji.repeat(per)} | ${it.emoji.repeat(per)} | ...`,
        ],
        explanation: `${per * groups} : ${per} = ${groups} vì ${groups} × ${per} = ${per * groups}.`,
      };
    }
    case 'division_remainder': {
      const per = pickInt(r, 3, 8);
      const groups = pickInt(r, 2, 6);
      const rem = pickInt(r, 1, per - 1);
      const total = per * groups + rem;
      const it = pick(r, ITEMS);
      return {
        id,
        kind: 'grouping',
        stage: 'applied',
        skill: 'math.division.remainder',
        prompt: `Có ${total} ${it.name}, mỗi ${it.box} ${per}. Xếp được mấy ${it.box} đầy và còn dư mấy ${it.name}?`,
        emoji: it.emoji,
        total,
        perGroup: per,
        askRemainder: true,
        groupLabel: it.box,
        hints: [
          'Sau khi xếp đầy các nhóm, còn lại bao nhiêu?',
          'Ví dụ: 7 : 3 = 2 dư 1 vì 2 × 3 = 6, còn 1.',
          `Tìm số lớn nhất mà nhân ${per} không vượt quá ${total}, rồi lấy phần còn lại.`,
          `${it.emoji.repeat(per)} | ... | ${it.emoji.repeat(rem)} (dư)`,
        ],
        explanation: `${total} : ${per} = ${groups} dư ${rem}, vì ${groups} × ${per} = ${per * groups} và ${total} − ${per * groups} = ${rem} (< ${per}).`,
      };
    }
    case 'multiplication_array': {
      const rows = pickInt(r, 2, 6);
      const cols = pickInt(r, 2, 7);
      const emoji = pick(r, ['🍓', '⭐', '🌸', '🔵', '🍪']);
      return {
        id,
        kind: 'visual_counting',
        stage: 'practice',
        skill: 'math.multiplication.array',
        prompt: `Có ${rows} hàng, mỗi hàng ${cols} ${emoji}. Có tất cả bao nhiêu?`,
        groups: Array.from({ length: rows }, (_, i) => ({ emoji, count: cols, label: `Hàng ${i + 1}` })),
        answer: rows * cols,
        expr: `${rows} * ${cols}`,
        hints: [
          'Các hàng có số lượng bằng nhau không?',
          'Ví dụ: 3 hàng, mỗi hàng 4 → 4 + 4 + 4 = 3 × 4 = 12.',
          `Cộng ${cols} lặp lại ${rows} lần, hoặc tính ${rows} × ${cols}.`,
          Array.from({ length: Math.min(rows, 3) }, () => emoji.repeat(cols)).join(' / '),
        ],
        explanation: `${rows} × ${cols} = ${rows * cols}.`,
      };
    }
    case 'add_carry': {
      let a = 0;
      let b = 0;
      do {
        a = pickInt(r, 120, 4800);
        b = pickInt(r, 150, 4800);
      } while ((a % 10) + (b % 10) < 10 || a + b > 9999);
      return {
        id,
        kind: 'number_input',
        stage: 'practice',
        skill: 'math.addition.carry',
        prompt: `Tính: ${fmt(a)} + ${fmt(b)} = ?`,
        answer: a + b,
        expr: `${a} + ${b}`,
        hints: [
          'Hàng đơn vị cộng lại có vượt quá 9 không?',
          'Ví dụ: 28 + 15: 8 + 5 = 13, viết 3 nhớ 1; 2 + 1 + 1 = 4 → 43.',
          'Cộng từ phải sang trái: đơn vị → chục → trăm → nghìn, nhớ sang hàng bên trái.',
          `  ${a}\n+ ${b}\n------`,
        ],
        explanation: `${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}.`,
      };
    }
    case 'sub_borrow': {
      let a = 0;
      let b = 0;
      do {
        a = pickInt(r, 300, 9800);
        b = pickInt(r, 100, a - 1);
      } while (a % 10 >= b % 10);
      return {
        id,
        kind: 'number_input',
        stage: 'practice',
        skill: 'math.subtraction.borrow',
        prompt: `Tính: ${fmt(a)} − ${fmt(b)} = ?`,
        answer: a - b,
        expr: `${a} - ${b}`,
        hints: [
          'Chữ số hàng đơn vị ở trên có nhỏ hơn ở dưới không?',
          'Ví dụ: 52 − 17: 2 không trừ được 7, mượn 1 chục → 12 − 7 = 5; 4 − 1 = 3 → 35.',
          'Trừ từ phải sang trái; khi mượn, hàng bên trái bớt đi 1.',
          `  ${a}\n− ${b}\n------`,
        ],
        explanation: `${fmt(a)} − ${fmt(b)} = ${fmt(a - b)}. Kiểm tra: ${fmt(a - b)} + ${fmt(b)} = ${fmt(a)}.`,
      };
    }
    case 'place_value': {
      const n = pickInt(r, 1000, 9999);
      const digits = String(n).split('').map(Number);
      const pos = pickInt(r, 0, 3);
      const placeNames = ['nghìn', 'trăm', 'chục', 'đơn vị'];
      const mult = [1000, 100, 10, 1][pos];
      return {
        id,
        kind: 'number_input',
        stage: 'practice',
        skill: 'math.place-value',
        prompt: `Trong số ${fmt(n)}, chữ số ở hàng ${placeNames[pos]} có giá trị bằng bao nhiêu?`,
        answer: digits[pos] * mult,
        expr: `${digits[pos]} * ${mult}`,
        hints: [
          `Chữ số ở hàng ${placeNames[pos]} là chữ số nào?`,
          'Ví dụ: trong 3 527, chữ số 5 ở hàng trăm có giá trị 500.',
          `Lấy chữ số đó nhân với ${mult}.`,
          `${digits.join(' | ')}  ←  nghìn | trăm | chục | đơn vị`,
        ],
        explanation: `Chữ số ${digits[pos]} ở hàng ${placeNames[pos]} có giá trị ${fmt(digits[pos] * mult)}.`,
      };
    }
    case 'sequence_arithmetic': {
      const start = pickInt(r, 1, 30);
      const step = pickInt(r, 2, 9);
      const seq = Array.from({ length: 5 }, (_, i) => start + i * step);
      return {
        id,
        kind: 'pattern',
        stage: 'practice',
        skill: 'logic.sequence.arithmetic',
        prompt: `Tìm số tiếp theo: ${seq.slice(0, 4).join(', ')}, ?`,
        sequence: [...seq.slice(0, 4), null],
        answers: [[String(seq[4])]],
        hints: [
          'Số sau hơn số trước bao nhiêu?',
          'Ví dụ: 3, 6, 9, 12 → mỗi lần thêm 3 → 15.',
          `Tính ${seq[1]} − ${seq[0]}, rồi cộng thêm vào ${seq[3]}.`,
          seq.slice(0, 4).join(` ➜(+${step}) `) + ' ➜ ?',
        ],
        explanation: `Mỗi số hơn số trước ${step}: ${seq[3]} + ${step} = ${seq[4]}.`,
      };
    }
    case 'sequence_geometric': {
      const start = pickInt(r, 1, 4);
      const ratio = pickInt(r, 2, 3);
      const seq = Array.from({ length: 5 }, (_, i) => start * ratio ** i);
      return {
        id,
        kind: 'pattern',
        stage: 'applied',
        skill: 'logic.sequence.geometric',
        prompt: `Tìm số tiếp theo: ${seq.slice(0, 4).join(', ')}, ?`,
        sequence: [...seq.slice(0, 4), null],
        answers: [[String(seq[4])]],
        hints: [
          'Các bước nhảy có bằng nhau không? Thử phép nhân xem.',
          'Ví dụ: 1, 3, 9, 27 → mỗi số gấp 3 số trước → 81.',
          `Lấy ${seq[1]} : ${seq[0]} để tìm số lần gấp, rồi nhân ${seq[3]} với số đó.`,
          seq.slice(0, 4).join(` ➜(×${ratio}) `) + ' ➜ ?',
        ],
        explanation: `Mỗi số gấp ${ratio} lần số trước: ${seq[3]} × ${ratio} = ${seq[4]}.`,
      };
    }
    case 'fraction_shade': {
      const den = pick(r, [2, 3, 4, 5, 6, 8]);
      const num = pickInt(r, 1, den - 1);
      return {
        id,
        kind: 'fraction',
        stage: 'practice',
        skill: 'math.fraction.represent',
        prompt: `Tô màu ${num}/${den} chiếc bánh.`,
        target: { num, den },
        fixedParts: den,
        shape: 'circle',
        hints: [
          'Mẫu số cho biết điều gì? Tử số cho biết điều gì?',
          'Ví dụ: 3/4 → chia 4 phần bằng nhau, tô 3 phần.',
          `Bánh đã chia ${den} phần. Tô ${num} phần.`,
          `${'🟪'.repeat(num)}${'⬜'.repeat(den - num)}`,
        ],
        explanation: `${num}/${den}: chia ${den} phần bằng nhau, lấy ${num} phần.`,
      };
    }
    case 'rect_area': {
      const w = pickInt(r, 2, 7);
      const h = pickInt(r, 2, 6);
      return {
        id,
        kind: 'geometry',
        stage: 'practice',
        skill: 'math.geometry.area',
        prompt: `Vẽ một hình chữ nhật có diện tích ${w * h} ô vuông.`,
        target: { area: w * h },
        maxSide: 10,
        hints: [
          'Diện tích là số ô vuông bên trong hình. Hai số nào nhân với nhau ra kết quả đó?',
          'Ví dụ: diện tích 6 → 2 × 3 hoặc 1 × 6.',
          'Chọn chiều dài trước, rồi tìm chiều rộng sao cho dài × rộng đúng bằng diện tích.',
          '⬛⬛⬛\n⬛⬛⬛  (2 × 3 = 6)',
        ],
        explanation: `Mọi hình có dài × rộng = ${w * h} đều đúng, ví dụ ${w} × ${h}.`,
      };
    }
    case 'rect_perimeter': {
      const w = pickInt(r, 2, 7);
      const h = pickInt(r, 1, 5);
      const p = 2 * (w + h);
      return {
        id,
        kind: 'geometry',
        stage: 'applied',
        skill: 'math.geometry.perimeter',
        prompt: `Vẽ một hình chữ nhật có chu vi ${p}.`,
        target: { perimeter: p },
        maxSide: 10,
        hints: [
          'Chu vi là độ dài đường bao quanh hình. Dài + rộng bằng bao nhiêu?',
          'Ví dụ: chu vi 10 → dài + rộng = 5 → 3 và 2.',
          `Dài + rộng = ${p} : 2 = ${p / 2}. Chọn hai số có tổng ${p / 2}.`,
          '┌──┐ đi một vòng quanh hình',
        ],
        explanation: `Chu vi = (dài + rộng) × 2. Mọi cặp có dài + rộng = ${p / 2} đều đúng.`,
      };
    }
  }
}

/** Các họ biến thể phù hợp cho từng bài (dùng cho nút "Luyện thêm") */
export const LESSON_VARIANT_FAMILIES: Record<string, VariantFamily[]> = {
  'math-t1-l1': ['place_value'],
  'math-t2-l1': ['add_carry', 'sub_borrow'],
  'math-t3-l1': ['multiplication_array'],
  'math-t4-l1': ['division_groups', 'division_remainder'],
  'math-t7-l1': ['rect_area', 'rect_perimeter'],
  'math-t8-l1': ['fraction_shade'],
  'logic-t1-l1': ['sequence_arithmetic', 'sequence_geometric'],
};

export const ALL_VARIANT_FAMILIES: VariantFamily[] = [
  'division_groups',
  'division_remainder',
  'multiplication_array',
  'add_carry',
  'sub_borrow',
  'place_value',
  'sequence_arithmetic',
  'sequence_geometric',
  'fraction_shade',
  'rect_area',
  'rect_perimeter',
];
