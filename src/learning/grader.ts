// ============================================================================
// Little Genius – Focused Learning: Bộ chấm bài xác định (Deterministic Grader)
// - Câu hỏi đóng: kiểm tra chính xác bằng thuật toán (không dùng AI)
// - Câu hỏi mở / sáng tạo: chấm theo rubric, chấp nhận nhiều câu trả lời hợp lý
// - solutionResponse(): sinh lời giải chuẩn để kiểm thử & "Xem lời giải"
// ============================================================================

import type {
  FocusTask,
  GradeResult,
  LogicGridTask,
  MazeTask,
  ScenePosition,
  TaskResponse,
} from './types.ts';

// ---------------------------------------------------------------------------
// Tiện ích chuẩn hóa & số học
// ---------------------------------------------------------------------------
export function normalizeText(s: string): string {
  return s
    .normalize('NFC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?,;:]+$/g, '')
    .trim();
}

/** Chuyển chuỗi trẻ nhập thành số: chấp nhận "2,5", "1.000" (dấu chấm phân cách nghìn), khoảng trắng */
export function parseKidNumber(raw: string): number | null {
  if (raw === undefined || raw === null) return null;
  let s = String(raw).trim().replace(/\s+/g, '');
  if (s === '') return null;
  if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  s = s.replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function sameNumber(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-9;
}

/** Bộ tính biểu thức an toàn: + - * / % ( ) và số (không dùng eval) */
export function evalExpr(expr: string): number {
  const tokens = expr.match(/\d+(\.\d+)?|[()+\-*/%]/g) ?? [];
  if (tokens.join('') !== expr.replace(/\s+/g, '')) {
    throw new Error(`Biểu thức không hợp lệ: ${expr}`);
  }
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  const parsePrimary = (): number => {
    const t = next();
    if (t === '(') {
      const v = parseAdd();
      if (next() !== ')') throw new Error('Thiếu dấu )');
      return v;
    }
    if (t === '-') return -parsePrimary();
    const n = Number(t);
    if (!Number.isFinite(n)) throw new Error(`Token lạ: ${t}`);
    return n;
  };
  const parseMul = (): number => {
    let v = parsePrimary();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = next();
      const r = parsePrimary();
      v = op === '*' ? v * r : op === '/' ? v / r : v % r;
    }
    return v;
  };
  const parseAdd = (): number => {
    let v = parseMul();
    while (peek() === '+' || peek() === '-') {
      const op = next();
      const r = parseMul();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  };
  const result = parseAdd();
  if (pos !== tokens.length) throw new Error(`Thừa ký tự trong biểu thức: ${expr}`);
  return result;
}

/** Xáo trộn có hạt giống (ổn định giữa các lần render) */
export function seededShuffle<T>(items: T[], seedText: string): T[] {
  let seed = 0;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Tránh trường hợp xáo trộn trùng thứ tự đúng
  if (arr.length > 1 && arr.every((v, i) => v === items[i])) {
    arr.push(arr.shift() as T);
  }
  return arr;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ---------------------------------------------------------------------------
// Mê cung & Sudoku
// ---------------------------------------------------------------------------
const DIRS: Record<'U' | 'D' | 'L' | 'R', [number, number]> = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

export function findCell(grid: string[], ch: string): [number, number] {
  for (let r = 0; r < grid.length; r++) {
    const c = grid[r].indexOf(ch);
    if (c >= 0) return [r, c];
  }
  throw new Error(`Không tìm thấy ô ${ch}`);
}

export function canMove(grid: string[], r: number, c: number): boolean {
  return r >= 0 && r < grid.length && c >= 0 && c < grid[r].length && grid[r][c] !== '#';
}

/** Mô phỏng các bước đi (bước đâm vào tường bị bỏ qua) */
export function simulateMaze(grid: string[], moves: ('U' | 'D' | 'L' | 'R')[]): [number, number] {
  let [r, c] = findCell(grid, 'S');
  for (const m of moves) {
    const [dr, dc] = DIRS[m];
    if (canMove(grid, r + dr, c + dc)) {
      r += dr;
      c += dc;
    }
  }
  return [r, c];
}

export function solveMaze(task: MazeTask): ('U' | 'D' | 'L' | 'R')[] | null {
  const grid = task.grid;
  const start = findCell(grid, 'S');
  const end = findCell(grid, 'E');
  const key = (r: number, c: number) => `${r},${c}`;
  const prev = new Map<string, { from: string; move: 'U' | 'D' | 'L' | 'R' }>();
  const queue: [number, number][] = [start];
  const seen = new Set([key(...start)]);
  while (queue.length) {
    const [r, c] = queue.shift() as [number, number];
    if (r === end[0] && c === end[1]) break;
    for (const m of ['U', 'D', 'L', 'R'] as const) {
      const [dr, dc] = DIRS[m];
      const nr = r + dr;
      const nc = c + dc;
      if (canMove(grid, nr, nc) && !seen.has(key(nr, nc))) {
        seen.add(key(nr, nc));
        prev.set(key(nr, nc), { from: key(r, c), move: m });
        queue.push([nr, nc]);
      }
    }
  }
  if (!seen.has(key(...end))) return null;
  const path: ('U' | 'D' | 'L' | 'R')[] = [];
  let cur = key(...end);
  while (cur !== key(...start)) {
    const p = prev.get(cur);
    if (!p) return null;
    path.unshift(p.move);
    cur = p.from;
  }
  return path;
}

export function isValidSudoku4(grid: number[][], givens: number[][]): boolean {
  if (grid.length !== 4) return false;
  const full = [1, 2, 3, 4].join(',');
  const sorted = (a: number[]) => [...a].sort((x, y) => x - y).join(',');
  for (let i = 0; i < 4; i++) {
    if (grid[i].length !== 4) return false;
    if (sorted(grid[i]) !== full) return false;
    if (sorted(grid.map((row) => row[i])) !== full) return false;
  }
  for (const br of [0, 2]) {
    for (const bc of [0, 2]) {
      const box = [grid[br][bc], grid[br][bc + 1], grid[br + 1][bc], grid[br + 1][bc + 1]];
      if (sorted(box) !== full) return false;
    }
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (givens[r][c] !== 0 && givens[r][c] !== grid[r][c]) return false;
    }
  }
  return true;
}

export function countSudokuSolutions(task: LogicGridTask, limit = 2): number {
  const grid = task.givens.map((r) => [...r]);
  let count = 0;
  const ok = (r: number, c: number, v: number) => {
    for (let i = 0; i < 4; i++) if (grid[r][i] === v || grid[i][c] === v) return false;
    const br = r - (r % 2);
    const bc = c - (c % 2);
    for (let i = br; i < br + 2; i++) for (let j = bc; j < bc + 2; j++) if (grid[i][j] === v) return false;
    return true;
  };
  const solve = (idx: number) => {
    if (count >= limit) return;
    if (idx === 16) {
      count++;
      return;
    }
    const r = Math.floor(idx / 4);
    const c = idx % 4;
    if (grid[r][c] !== 0) return solve(idx + 1);
    for (let v = 1; v <= 4; v++) {
      if (ok(r, c, v)) {
        grid[r][c] = v;
        solve(idx + 1);
        grid[r][c] = 0;
      }
    }
  };
  solve(0);
  return count;
}

// ---------------------------------------------------------------------------
// Phản hồi rỗng ban đầu cho giao diện
// ---------------------------------------------------------------------------
export function emptyResponse(task: FocusTask): TaskResponse {
  switch (task.kind) {
    case 'multiple_choice':
      return { kind: 'multiple_choice', choice: null };
    case 'multiple_select':
      return { kind: 'multiple_select', choices: [] };
    case 'fill_blank':
      return { kind: 'fill_blank', values: task.blanks.map(() => '') };
    case 'number_input':
      return { kind: 'number_input', value: '' };
    case 'visual_counting':
      return { kind: 'visual_counting', value: '' };
    case 'matching':
      return { kind: 'matching', map: {} };
    case 'order':
      return { kind: 'order', order: [] };
    case 'drag_drop':
      return { kind: 'drag_drop', placement: {} };
    case 'grouping':
      return { kind: 'grouping', groups: '', remainder: '', placed: 0 };
    case 'geometry':
      return { kind: 'geometry', width: 1, height: 1 };
    case 'fraction':
      return { kind: 'fraction', parts: task.fixedParts ?? 2, shaded: [] };
    case 'find_mistake':
      return { kind: 'find_mistake', line: null, fix: '' };
    case 'pattern':
      return { kind: 'pattern', values: task.answers.map(() => '') };
    case 'logic_grid':
      return { kind: 'logic_grid', grid: task.givens.map((r) => [...r]) };
    case 'maze':
      return { kind: 'maze', moves: [] };
    case 'experiment':
      return { kind: 'experiment', config: task.controls.map(() => 0), choice: null, trials: 0 };
    case 'step_reasoning':
      return { kind: 'step_reasoning', values: task.steps.map(() => '') };
    case 'open_writing':
      return { kind: 'open_writing', text: '' };
    case 'creative_construction':
      return task.spec.mode === 'sum_target'
        ? { kind: 'creative_construction', counts: task.spec.items.map(() => 0) }
        : { kind: 'creative_construction', numbers: Array.from({ length: task.spec.length }, () => '') };
    case 'letter_tiles':
      return { kind: 'letter_tiles', picked: [] };
    case 'evidence':
      return { kind: 'evidence', selected: null };
    case 'position_scene':
      return { kind: 'position_scene', position: null };
  }
}

// ---------------------------------------------------------------------------
// CHẤM BÀI
// ---------------------------------------------------------------------------
const OK = (feedback = 'Chính xác! Con làm rất tốt.'): GradeResult => ({ status: 'correct', feedback });
const NO = (feedback: string, mistake?: string): GradeResult => ({ status: 'incorrect', feedback, mistake });
const WAIT = (feedback: string): GradeResult => ({ status: 'incomplete', feedback });

function matchesAccepted(value: string, accepted: string[]): boolean {
  const v = normalizeText(value);
  if (v === '') return false;
  return accepted.some((a) => {
    const na = normalizeText(a);
    if (na === v) return true;
    const nv = parseKidNumber(v);
    const nn = parseKidNumber(na);
    return nv !== null && nn !== null && sameNumber(nv, nn);
  });
}

function sequenceCheck(nums: number[], rule: 'arithmetic' | 'geometric' | 'any_constant_step', minStep = 1): boolean {
  if (nums.length < 3) return false;
  const arithmetic = () => {
    const d = nums[1] - nums[0];
    if (Math.abs(d) < minStep) return false;
    return nums.every((n, i) => i === 0 || sameNumber(n - nums[i - 1], d));
  };
  const geometric = () => {
    if (nums.some((n) => n === 0)) return false;
    const q = nums[1] / nums[0];
    if (sameNumber(q, 1) || sameNumber(q, -1)) return false;
    return nums.every((n, i) => i === 0 || sameNumber(n / nums[i - 1], q));
  };
  if (rule === 'arithmetic') return arithmetic();
  if (rule === 'geometric') return geometric();
  return arithmetic() || geometric();
}

export function gradeTask(task: FocusTask, response: TaskResponse): GradeResult {
  if (response.kind !== task.kind) return WAIT('Con hãy thao tác trên bài trước nhé.');

  switch (task.kind) {
    case 'multiple_choice': {
      const r = response as Extract<TaskResponse, { kind: 'multiple_choice' }>;
      if (r.choice === null) return WAIT('Con hãy chọn một đáp án.');
      if (r.choice === task.answer) return OK();
      return NO(task.optionFeedback?.[r.choice] || 'Chưa đúng. Con đọc lại câu hỏi và thử lại nhé.', `mc:${task.id}:${r.choice}`);
    }
    case 'multiple_select': {
      const r = response as Extract<TaskResponse, { kind: 'multiple_select' }>;
      if (r.choices.length === 0) return WAIT('Con hãy chọn ít nhất một đáp án.');
      const want = [...task.answers].sort().join(',');
      const got = [...new Set(r.choices)].sort().join(',');
      if (want === got) return OK();
      const missing = task.answers.filter((a) => !r.choices.includes(a)).length;
      const extra = r.choices.filter((c) => !task.answers.includes(c)).length;
      return NO(
        extra > 0
          ? 'Có lựa chọn chưa đúng. Con kiểm tra lại từng ý nhé.'
          : `Con còn thiếu ${missing} ý đúng nữa.`,
        `ms:${task.id}`
      );
    }
    case 'fill_blank': {
      const r = response as Extract<TaskResponse, { kind: 'fill_blank' }>;
      if (r.values.some((v) => !v || !v.trim())) return WAIT('Con hãy điền đủ các chỗ trống.');
      const wrong = task.blanks.findIndex((acc, i) => !matchesAccepted(r.values[i], acc));
      if (wrong === -1) return OK();
      return NO(`Chỗ trống số ${wrong + 1} chưa đúng. Con thử lại nhé.`, `fb:${task.id}:${wrong}`);
    }
    case 'number_input':
    case 'visual_counting': {
      const r = response as { value: string };
      const n = parseKidNumber(r.value);
      if (n === null) return WAIT('Con hãy nhập một số.');
      if (sameNumber(n, task.answer)) return OK();
      return NO(
        n > task.answer ? 'Số của con lớn hơn đáp án. Con đếm/tính lại nhé.' : 'Số của con nhỏ hơn đáp án. Con đếm/tính lại nhé.',
        `num:${task.id}`
      );
    }
    case 'matching': {
      const r = response as Extract<TaskResponse, { kind: 'matching' }>;
      if (Object.keys(r.map).length < task.pairs.length) return WAIT('Con hãy nối hết các cặp.');
      const wrong = task.pairs.filter((p, i) => task.pairs[r.map[i]]?.[1] !== p[1]).length;
      if (wrong === 0) return OK();
      return NO(`Có ${wrong} cặp chưa đúng. Con xem lại nhé.`, `match:${task.id}`);
    }
    case 'order': {
      const r = response as Extract<TaskResponse, { kind: 'order' }>;
      if (r.order.length < task.items.length) return WAIT('Con hãy sắp xếp hết các mục.');
      const ok = r.order.every((idx, pos) => task.items[idx] === task.items[pos]);
      if (ok) return OK();
      const firstWrong = r.order.findIndex((idx, pos) => task.items[idx] !== task.items[pos]);
      return NO(`Thứ tự từ vị trí số ${firstWrong + 1} chưa đúng. Con thử lại nhé.`, `order:${task.id}`);
    }
    case 'drag_drop': {
      const r = response as Extract<TaskResponse, { kind: 'drag_drop' }>;
      if (Object.keys(r.placement).length < task.items.length) return WAIT('Con hãy xếp hết các thẻ vào nhóm.');
      const wrong = task.items.filter((it, i) => r.placement[i] !== it.bin).length;
      if (wrong === 0) return OK();
      return NO(`Có ${wrong} thẻ đặt chưa đúng nhóm.`, `dd:${task.id}`);
    }
    case 'grouping': {
      const r = response as Extract<TaskResponse, { kind: 'grouping' }>;
      const g = parseKidNumber(r.groups);
      if (g === null) return WAIT('Con hãy nhập số nhóm.');
      const expected = task.roundUp ? Math.ceil(task.total / task.perGroup) : Math.floor(task.total / task.perGroup);
      const rem = task.total % task.perGroup;
      if (!sameNumber(g, expected)) {
        if (task.roundUp && sameNumber(g, Math.floor(task.total / task.perGroup)) && rem > 0) {
          return NO(`Còn ${rem} ${task.emoji} chưa có chỗ! Cần thêm một ${task.groupLabel ?? 'nhóm'} nữa.`, 'division:forgot-remainder-group');
        }
        return NO('Số nhóm chưa đúng. Con thử xếp vào từng nhóm rồi đếm lại nhé.', 'division:groups');
      }
      if (task.askRemainder) {
        const rr = parseKidNumber(r.remainder);
        if (rr === null) return WAIT('Con hãy nhập số còn dư.');
        if (!sameNumber(rr, rem)) return NO('Số nhóm đúng rồi, nhưng số dư chưa đúng.', 'division:remainder');
      }
      return OK();
    }
    case 'geometry': {
      const r = response as Extract<TaskResponse, { kind: 'geometry' }>;
      const area = r.width * r.height;
      const per = 2 * (r.width + r.height);
      const { area: ta, perimeter: tp } = task.target;
      if (ta !== undefined && area !== ta) {
        return NO(`Diện tích hình của con là ${area} ô vuông, cần ${ta} ô vuông.`, per === ta ? 'geometry:perimeter-vs-area' : 'geometry:area');
      }
      if (tp !== undefined && per !== tp) {
        return NO(`Chu vi hình của con là ${per}, cần ${tp}.`, area === tp ? 'geometry:area-vs-perimeter' : 'geometry:perimeter');
      }
      return OK(`Đúng rồi! Hình ${r.width} × ${r.height}: diện tích ${area}, chu vi ${per}.`);
    }
    case 'fraction': {
      const r = response as Extract<TaskResponse, { kind: 'fraction' }>;
      const k = new Set(r.shaded).size;
      if (k === 0) return WAIT('Con hãy tô màu một số phần.');
      if (k * task.target.den === task.target.num * r.parts) {
        return OK(
          r.parts === task.target.den
            ? `Chính xác: ${k}/${r.parts}.`
            : `Tuyệt! ${k}/${r.parts} bằng ${task.target.num}/${task.target.den} – đó là phân số bằng nhau.`
        );
      }
      return NO(`Con đang tô ${k}/${r.parts}. Cần bằng ${task.target.num}/${task.target.den}.`, 'fraction:value');
    }
    case 'find_mistake': {
      const r = response as Extract<TaskResponse, { kind: 'find_mistake' }>;
      if (r.line === null) return WAIT('Con hãy chọn dòng có lỗi.');
      if (r.line !== task.wrongLine) return NO('Dòng này đúng rồi. Lỗi nằm ở chỗ khác.', `mistake:${task.id}`);
      if (task.fix && task.fix.length > 0) {
        if (!r.fix.trim()) return WAIT('Con tìm đúng dòng sai rồi! Giờ hãy viết cách sửa.');
        if (!matchesAccepted(r.fix, task.fix)) return NO('Đúng dòng sai rồi, nhưng cách sửa chưa đúng.', `mistake-fix:${task.id}`);
      }
      return OK();
    }
    case 'pattern': {
      const r = response as Extract<TaskResponse, { kind: 'pattern' }>;
      if (r.values.some((v) => !v || !v.trim())) return WAIT('Con hãy điền ô còn trống.');
      const wrong = task.answers.findIndex((acc, i) => !matchesAccepted(r.values[i], acc));
      if (wrong === -1) return OK();
      return NO('Chưa đúng quy luật. Con so sánh từng cặp liền nhau nhé.', `pattern:${task.id}`);
    }
    case 'logic_grid': {
      const r = response as Extract<TaskResponse, { kind: 'logic_grid' }>;
      if (r.grid.some((row) => row.some((v) => !v))) return WAIT('Con hãy điền hết các ô.');
      if (isValidSudoku4(r.grid, task.givens)) return OK();
      return NO('Có hàng, cột hoặc khối 2×2 bị trùng. Con kiểm tra lại nhé.', 'logic:sudoku');
    }
    case 'maze': {
      const r = response as Extract<TaskResponse, { kind: 'maze' }>;
      const [er, ec] = findCell(task.grid, 'E');
      const [r2, c2] = simulateMaze(task.grid, r.moves);
      if (r2 !== er || c2 !== ec) return WAIT('Con chưa tới đích. Tiếp tục đi nhé!');
      if (task.maxSteps !== undefined && r.moves.length > task.maxSteps) {
        return NO(`Con tới đích rồi! Nhưng đã đi ${r.moves.length} bước – thử tìm đường ngắn hơn (tối đa ${task.maxSteps} bước).`, 'maze:long-path');
      }
      return OK();
    }
    case 'experiment': {
      const r = response as Extract<TaskResponse, { kind: 'experiment' }>;
      const key = r.config.join('-');
      if (task.targetKeys && !task.targetKeys.includes(key)) {
        return NO('Kết quả chưa như mong muốn. Con thử thay đổi điều kiện khác nhé.', `experiment:${task.id}`);
      }
      if (task.question) {
        if (r.choice === null) return WAIT('Con hãy trả lời câu hỏi kết luận.');
        if (r.choice !== task.question.answer) return NO('Kết luận chưa khớp với thí nghiệm. Con quan sát lại kết quả nhé.', `experiment-q:${task.id}`);
      }
      return OK();
    }
    case 'step_reasoning': {
      const r = response as Extract<TaskResponse, { kind: 'step_reasoning' }>;
      for (let i = 0; i < task.steps.length; i++) {
        const n = parseKidNumber(r.values[i] ?? '');
        if (n === null) return WAIT(`Con hãy điền bước ${i + 1}.`);
        if (!sameNumber(n, task.steps[i].answer)) return NO(`Bước ${i + 1} chưa đúng. Các bước trước đó đều tốt!`, `step:${task.id}:${i}`);
      }
      return OK();
    }
    case 'open_writing': {
      const r = response as Extract<TaskResponse, { kind: 'open_writing' }>;
      const text = normalizeText(r.text);
      const words = countWords(r.text);
      const rubric = task.rubric.map((c) => ({
        label: c.label,
        met: !c.keywordsAny || c.keywordsAny.some((k) => text.includes(normalizeText(k))),
      }));
      const met = rubric.filter((c) => c.met).length;
      if (words < task.minWords) {
        return { status: 'incomplete', feedback: `Ý tưởng hay! Con viết thêm một chút nữa (ít nhất ${task.minWords} từ, con đang có ${words} từ).`, rubric };
      }
      if (met < task.minCriteria) {
        const missing = rubric.filter((c) => !c.met).map((c) => c.label);
        return { status: 'incomplete', feedback: `Bài viết đã có ý. Con thử bổ sung: ${missing.join('; ')}.`, rubric };
      }
      return { status: 'accepted', feedback: 'Bài viết của con rất có ý! Không có một đáp án duy nhất – cách viết của con hợp lý.', rubric };
    }
    case 'creative_construction': {
      const r = response as Extract<TaskResponse, { kind: 'creative_construction' }>;
      const spec = task.spec;
      if (spec.mode === 'sum_target') {
        const counts = r.counts ?? [];
        const total = spec.items.reduce((s, it, i) => s + it.value * (counts[i] ?? 0), 0);
        if (total === 0) return WAIT('Con hãy chọn món đầu tiên.');
        if (counts.some((c) => c > spec.maxEach)) return NO(`Mỗi món tối đa ${spec.maxEach}.`, 'construct:max');
        if (total === spec.target) return { status: 'accepted', feedback: `Tuyệt vời! Tổng đúng ${spec.target}${spec.unit ?? ''}. Còn nhiều cách khác nữa – con thử tìm thêm nhé!` };
        return NO(total > spec.target ? `Tổng là ${total}${spec.unit ?? ''} – nhiều hơn ${spec.target}${spec.unit ?? ''}.` : `Tổng là ${total}${spec.unit ?? ''} – còn thiếu ${spec.target - total}${spec.unit ?? ''}.`, 'construct:sum');
      }
      const nums = (r.numbers ?? []).map((v) => parseKidNumber(v));
      if (nums.length < spec.length || nums.some((n) => n === null)) return WAIT(`Con hãy điền đủ ${spec.length} số.`);
      if (sequenceCheck(nums as number[], spec.rule, spec.minStep ?? 1)) {
        return { status: 'accepted', feedback: 'Dãy số của con có quy luật rõ ràng. Rất sáng tạo!' };
      }
      return NO('Các bước nhảy trong dãy chưa đều nhau. Con kiểm tra hiệu (hoặc thương) giữa các số liền nhau nhé.', 'construct:sequence');
    }
    case 'letter_tiles': {
      const r = response as Extract<TaskResponse, { kind: 'letter_tiles' }>;
      if (r.picked.length === 0) return WAIT('Con hãy chọn các ô chữ.');
      const word = r.picked.map((i) => task.tiles[i]).join('');
      if (task.answers.some((a) => normalizeText(a).replace(/\s+/g, '') === normalizeText(word).replace(/\s+/g, ''))) return OK();
      return NO(`"${word}" chưa phải từ cần tìm. Con thử lại nhé.`, `tiles:${task.id}`);
    }
    case 'evidence': {
      const r = response as Extract<TaskResponse, { kind: 'evidence' }>;
      if (r.selected === null) return WAIT('Con hãy chọn một câu trong bài đọc.');
      if (task.acceptable.includes(r.selected)) return OK('Đúng rồi! Câu này là bằng chứng trong bài.');
      return NO('Câu này chưa chứng minh được ý đó. Con tìm câu khác nhé.', `evidence:${task.id}`);
    }
    case 'position_scene': {
      const r = response as Extract<TaskResponse, { kind: 'position_scene' }>;
      if (r.position === null) return WAIT(`Con hãy đặt ${task.subjectName} vào một vị trí.`);
      if (r.position === task.answer) return OK();
      return NO(`Đó là "${positionLabel(r.position)}". Con nghe lại và thử nhé.`, `position:${r.position}->${task.answer}`);
    }
  }
}

export function positionLabel(p: ScenePosition): string {
  return { on: 'on (ở trên)', in: 'in (ở trong)', under: 'under (ở dưới)', next_to: 'next to (bên cạnh)', behind: 'behind (phía sau)' }[p];
}

// ---------------------------------------------------------------------------
// LỜI GIẢI CHUẨN (dùng cho kiểm thử tự động & nút "Xem lời giải")
// ---------------------------------------------------------------------------
function buildFromTiles(tiles: string[], target: string): number[] | null {
  const goal = normalizeText(target).replace(/\s+/g, '');
  const used = new Set<number>();
  const path: number[] = [];
  const dfs = (built: string): boolean => {
    if (built === goal) return true;
    for (let i = 0; i < tiles.length; i++) {
      if (used.has(i)) continue;
      const t = normalizeText(tiles[i]).replace(/\s+/g, '');
      if (goal.startsWith(built + t)) {
        used.add(i);
        path.push(i);
        if (dfs(built + t)) return true;
        used.delete(i);
        path.pop();
      }
    }
    return false;
  };
  return dfs('') ? path : null;
}

function findSumCombo(values: number[], target: number, maxEach: number): number[] | null {
  const counts = values.map(() => 0);
  const dfs = (i: number, remaining: number): boolean => {
    if (remaining === 0) return counts.some((c) => c > 0);
    if (i >= values.length || remaining < 0) return false;
    for (let c = maxEach; c >= 0; c--) {
      counts[i] = c;
      if (dfs(i + 1, remaining - c * values[i])) return true;
    }
    counts[i] = 0;
    return false;
  };
  return dfs(0, target) ? counts : null;
}

export function solutionResponse(task: FocusTask): TaskResponse {
  switch (task.kind) {
    case 'multiple_choice':
      return { kind: 'multiple_choice', choice: task.answer };
    case 'multiple_select':
      return { kind: 'multiple_select', choices: [...task.answers] };
    case 'fill_blank':
      return { kind: 'fill_blank', values: task.blanks.map((b) => b[0]) };
    case 'number_input':
      return { kind: 'number_input', value: String(task.answer) };
    case 'visual_counting':
      return { kind: 'visual_counting', value: String(task.answer) };
    case 'matching':
      return { kind: 'matching', map: Object.fromEntries(task.pairs.map((_, i) => [i, i])) };
    case 'order':
      return { kind: 'order', order: task.items.map((_, i) => i) };
    case 'drag_drop':
      return { kind: 'drag_drop', placement: Object.fromEntries(task.items.map((it, i) => [i, it.bin])) };
    case 'grouping': {
      const g = task.roundUp ? Math.ceil(task.total / task.perGroup) : Math.floor(task.total / task.perGroup);
      return { kind: 'grouping', groups: String(g), remainder: String(task.total % task.perGroup), placed: task.total };
    }
    case 'geometry': {
      for (let w = 1; w <= task.maxSide; w++) {
        for (let h = 1; h <= task.maxSide; h++) {
          const okA = task.target.area === undefined || w * h === task.target.area;
          const okP = task.target.perimeter === undefined || 2 * (w + h) === task.target.perimeter;
          if (okA && okP) return { kind: 'geometry', width: w, height: h };
        }
      }
      return { kind: 'geometry', width: 0, height: 0 };
    }
    case 'fraction': {
      const parts = task.fixedParts ?? task.target.den;
      const k = (task.target.num * parts) / task.target.den;
      return { kind: 'fraction', parts, shaded: Array.from({ length: k }, (_, i) => i) };
    }
    case 'find_mistake':
      return { kind: 'find_mistake', line: task.wrongLine, fix: task.fix?.[0] ?? '' };
    case 'pattern':
      return { kind: 'pattern', values: task.answers.map((a) => a[0]) };
    case 'logic_grid':
      return { kind: 'logic_grid', grid: task.solution.map((r) => [...r]) };
    case 'maze':
      return { kind: 'maze', moves: solveMaze(task) ?? [] };
    case 'experiment': {
      const config = task.targetKeys ? task.targetKeys[0].split('-').map(Number) : task.controls.map(() => 0);
      return { kind: 'experiment', config, choice: task.question ? task.question.answer : null, trials: 3 };
    }
    case 'step_reasoning':
      return { kind: 'step_reasoning', values: task.steps.map((s) => String(s.answer)) };
    case 'open_writing':
      return { kind: 'open_writing', text: task.sampleAnswer };
    case 'creative_construction': {
      const spec = task.spec;
      if (spec.mode === 'sum_target') {
        return {
          kind: 'creative_construction',
          counts: findSumCombo(spec.items.map((i) => i.value), spec.target, spec.maxEach) ?? spec.items.map(() => 0),
        };
      }
      const step = Math.max(2, spec.minStep ?? 1);
      const nums =
        spec.rule === 'geometric'
          ? Array.from({ length: spec.length }, (_, i) => 2 ** i)
          : Array.from({ length: spec.length }, (_, i) => 1 + i * step);
      return { kind: 'creative_construction', numbers: nums.map(String) };
    }
    case 'letter_tiles':
      return { kind: 'letter_tiles', picked: buildFromTiles(task.tiles, task.answers[0]) ?? [] };
    case 'evidence':
      return { kind: 'evidence', selected: task.acceptable[0] };
    case 'position_scene':
      return { kind: 'position_scene', position: task.answer };
  }
}

/** Mô tả lời giải bằng chữ (hiển thị khi bé đã thử nhiều lần) */
export function describeSolution(task: FocusTask): string {
  switch (task.kind) {
    case 'multiple_choice':
      return `Đáp án: ${task.options[task.answer]}`;
    case 'multiple_select':
      return `Đáp án: ${task.answers.map((a) => task.options[a]).join('; ')}`;
    case 'fill_blank':
      return `Đáp án: ${task.blanks.map((b) => b[0]).join(' / ')}`;
    case 'number_input':
    case 'visual_counting':
      return `Đáp án: ${task.answer}${'unit' in task && task.unit ? ' ' + task.unit : ''}`;
    case 'matching':
      return task.pairs.map((p) => `${p[0]} → ${p[1]}`).join('; ');
    case 'order':
      return task.items.join(' → ');
    case 'drag_drop':
      return task.bins.map((b, bi) => `${b}: ${task.items.filter((i) => i.bin === bi).map((i) => i.label).join(', ')}`).join(' | ');
    case 'grouping': {
      const g = task.roundUp ? Math.ceil(task.total / task.perGroup) : Math.floor(task.total / task.perGroup);
      return `${task.total} : ${task.perGroup} = ${Math.floor(task.total / task.perGroup)}${task.total % task.perGroup ? ` (dư ${task.total % task.perGroup})` : ''} → ${g} ${task.groupLabel ?? 'nhóm'}`;
    }
    case 'geometry': {
      const s = solutionResponse(task) as Extract<TaskResponse, { kind: 'geometry' }>;
      return `Một cách làm: hình chữ nhật ${s.width} × ${s.height}`;
    }
    case 'fraction': {
      const s = solutionResponse(task) as Extract<TaskResponse, { kind: 'fraction' }>;
      return `Chia ${s.parts} phần, tô ${s.shaded.length} phần`;
    }
    case 'find_mistake':
      return `Dòng sai: "${task.lines[task.wrongLine]}"${task.fix ? ` → sửa thành ${task.fix[0]}` : ''}`;
    case 'pattern':
      return `Đáp án: ${task.answers.map((a) => a[0]).join(', ')}`;
    case 'logic_grid':
      return task.solution.map((r) => r.join(' ')).join(' / ');
    case 'maze':
      return `Đường đi ngắn nhất: ${(solveMaze(task) ?? []).map((m) => ({ U: '↑', D: '↓', L: '←', R: '→' })[m]).join(' ')}`;
    case 'experiment':
      return task.question ? `Kết luận: ${task.question.options[task.question.answer]}` : 'Thử các điều kiện khác nhau rồi so sánh.';
    case 'step_reasoning':
      return task.steps.map((s) => `${s.label} ${s.answer}${s.unit ? ' ' + s.unit : ''}`).join(' → ');
    case 'open_writing':
      return `Bài tham khảo: ${task.sampleAnswer}`;
    case 'creative_construction': {
      const s = solutionResponse(task) as Extract<TaskResponse, { kind: 'creative_construction' }>;
      if (task.spec.mode === 'sum_target') {
        const spec = task.spec;
        return `Một cách: ${spec.items.map((it, i) => (s.counts?.[i] ? `${s.counts[i]} × ${it.label}` : '')).filter(Boolean).join(' + ')}`;
      }
      return `Ví dụ: ${s.numbers?.join(', ')}`;
    }
    case 'letter_tiles':
      return `Từ cần ghép: ${task.answers[0]}`;
    case 'evidence':
      return `Bằng chứng: "${task.sentences[task.acceptable[0]]}"`;
    case 'position_scene':
      return `${task.subjectName} – ${positionLabel(task.answer)}`;
  }
}
