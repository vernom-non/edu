// ============================================================================
// Little Genius – Focused Learning: Bộ kiểm định nội dung bài học
// Một bài chỉ được tính "hoàn chỉnh" khi vượt qua toàn bộ kiểm định này:
// đủ 8–12 nhiệm vụ, đủ 6 phần, 4 tầng gợi ý, đáp án tự kiểm chứng bằng thuật toán.
// ============================================================================

import {
  countSudokuSolutions,
  evalExpr,
  findCell,
  gradeTask,
  isValidSudoku4,
  solutionResponse,
  solveMaze,
} from './grader.ts';
import type { FocusLesson, FocusTask, FocusTopic, TaskResponse } from './types.ts';

function wrongResponse(task: FocusTask): TaskResponse | null {
  switch (task.kind) {
    case 'multiple_choice':
      return { kind: 'multiple_choice', choice: (task.answer + 1) % task.options.length };
    case 'number_input':
      return { kind: 'number_input', value: String(task.answer + 1) };
    case 'visual_counting':
      return { kind: 'visual_counting', value: String(task.answer + 1) };
    case 'order':
      return { kind: 'order', order: task.items.map((_, i) => i).reverse() };
    case 'evidence': {
      const wrong = task.sentences.findIndex((_, i) => !task.acceptable.includes(i));
      return wrong >= 0 ? { kind: 'evidence', selected: wrong } : null;
    }
    case 'pattern':
      return { kind: 'pattern', values: task.answers.map(() => '___sai___') };
    case 'position_scene': {
      const other = task.positions.find((p) => p !== task.answer);
      return other ? { kind: 'position_scene', position: other } : null;
    }
    case 'step_reasoning':
      return { kind: 'step_reasoning', values: task.steps.map((s) => String(s.answer + 1)) };
    default:
      return null;
  }
}

function checkExpr(errors: string[], where: string, expr: string | undefined, answer: number, required: boolean) {
  if (!expr) {
    if (required) errors.push(`${where}: môn Toán bắt buộc có "expr" để kiểm chứng đáp án`);
    return;
  }
  try {
    const v = evalExpr(expr);
    if (Math.abs(v - answer) > 1e-9) errors.push(`${where}: expr "${expr}" = ${v} khác đáp án ${answer}`);
  } catch (e) {
    errors.push(`${where}: expr lỗi – ${(e as Error).message}`);
  }
}

export function validateTask(task: FocusTask, subject: string, where: string): string[] {
  const errors: string[] = [];
  const w = `${where}/${task.id}`;
  if (!task.prompt?.trim()) errors.push(`${w}: thiếu prompt`);
  if (!task.explanation?.trim()) errors.push(`${w}: thiếu explanation`);
  if (!task.skill?.trim()) errors.push(`${w}: thiếu skill`);
  if (!Array.isArray(task.hints) || task.hints.length !== 4 || task.hints.some((h) => !h?.trim())) {
    errors.push(`${w}: cần đúng 4 gợi ý không rỗng`);
  } else if (new Set(task.hints).size !== 4) {
    errors.push(`${w}: 4 gợi ý phải khác nhau`);
  }
  const isMath = subject === 'math';

  switch (task.kind) {
    case 'multiple_choice':
      if (task.options.length < 2 || new Set(task.options).size !== task.options.length) errors.push(`${w}: lựa chọn phải ≥2 và không trùng`);
      if (task.answer < 0 || task.answer >= task.options.length) errors.push(`${w}: answer ngoài phạm vi`);
      break;
    case 'multiple_select':
      if (task.answers.length === 0 || task.answers.some((a) => a < 0 || a >= task.options.length)) errors.push(`${w}: answers không hợp lệ`);
      break;
    case 'fill_blank': {
      const n = (task.text.match(/___/g) ?? []).length;
      if (n !== task.blanks.length) errors.push(`${w}: số "___" (${n}) khác số blanks (${task.blanks.length})`);
      if (task.blanks.some((b) => b.length === 0)) errors.push(`${w}: blank rỗng`);
      break;
    }
    case 'number_input':
      checkExpr(errors, w, task.expr, task.answer, isMath);
      break;
    case 'visual_counting':
      checkExpr(errors, w, task.expr, task.answer, isMath);
      if (task.groups.length === 0) errors.push(`${w}: thiếu groups`);
      break;
    case 'matching':
      if (task.pairs.length < 3) errors.push(`${w}: cần ≥3 cặp`);
      if (new Set(task.pairs.map((p) => p[0])).size !== task.pairs.length) errors.push(`${w}: vế trái bị trùng`);
      if (new Set(task.pairs.map((p) => p[1])).size !== task.pairs.length) errors.push(`${w}: vế phải bị trùng`);
      break;
    case 'order':
      if (task.items.length < 3) errors.push(`${w}: cần ≥3 mục`);
      break;
    case 'drag_drop':
      if (task.bins.length < 2 || task.items.length < 4) errors.push(`${w}: cần ≥2 nhóm và ≥4 thẻ`);
      if (task.items.some((i) => i.bin < 0 || i.bin >= task.bins.length)) errors.push(`${w}: bin ngoài phạm vi`);
      break;
    case 'grouping':
      if (task.total <= 0 || task.perGroup < 2 || task.total > 60) errors.push(`${w}: total/perGroup không hợp lệ`);
      break;
    case 'geometry':
      break;
    case 'fraction':
      if (task.target.num <= 0 || task.target.num > task.target.den || task.target.den > 12) errors.push(`${w}: phân số mục tiêu không hợp lệ`);
      if (task.fixedParts && (task.target.num * task.fixedParts) % task.target.den !== 0) errors.push(`${w}: fixedParts không biểu diễn được phân số`);
      break;
    case 'find_mistake':
      if (task.wrongLine < 0 || task.wrongLine >= task.lines.length) errors.push(`${w}: wrongLine ngoài phạm vi`);
      break;
    case 'pattern': {
      const blanks = task.sequence.filter((s) => s === null).length;
      if (blanks !== task.answers.length || blanks === 0) errors.push(`${w}: số ô trống khác số answers`);
      break;
    }
    case 'logic_grid':
      if (!isValidSudoku4(task.solution, task.givens)) errors.push(`${w}: solution không hợp lệ hoặc mâu thuẫn givens`);
      else if (countSudokuSolutions(task) !== 1) errors.push(`${w}: sudoku phải có đúng 1 lời giải`);
      break;
    case 'maze': {
      try {
        findCell(task.grid, 'S');
        findCell(task.grid, 'E');
        const path = solveMaze(task);
        if (!path) errors.push(`${w}: mê cung không có lối ra`);
        else if (task.maxSteps !== undefined && path.length > task.maxSteps) errors.push(`${w}: maxSteps nhỏ hơn đường ngắn nhất (${path.length})`);
      } catch (e) {
        errors.push(`${w}: ${(e as Error).message}`);
      }
      break;
    }
    case 'experiment': {
      const combos = task.controls.reduce((n, c) => n * c.options.length, 1);
      if (Object.keys(task.outcomes).length !== combos) errors.push(`${w}: outcomes phải phủ đủ ${combos} tổ hợp`);
      const keyOk = (k: string) => {
        const parts = k.split('-').map(Number);
        return parts.length === task.controls.length && parts.every((p, i) => p >= 0 && p < task.controls[i].options.length);
      };
      Object.keys(task.outcomes).forEach((k) => {
        if (!keyOk(k)) errors.push(`${w}: khóa outcome lạ ${k}`);
      });
      task.targetKeys?.forEach((k) => {
        if (!task.outcomes[k]) errors.push(`${w}: targetKey ${k} không có outcome`);
      });
      if (!task.targetKeys && !task.question) errors.push(`${w}: experiment cần targetKeys hoặc question`);
      if (task.question && (task.question.answer < 0 || task.question.answer >= task.question.options.length)) errors.push(`${w}: question.answer ngoài phạm vi`);
      if (!task.modelNote?.trim()) errors.push(`${w}: thiếu modelNote (lưu ý mô hình đơn giản hóa)`);
      break;
    }
    case 'step_reasoning':
      if (task.steps.length < 2) errors.push(`${w}: cần ≥2 bước`);
      task.steps.forEach((s, i) => checkExpr(errors, `${w}#step${i + 1}`, s.expr, s.answer, isMath));
      break;
    case 'open_writing':
      if (task.rubric.length === 0 || task.minCriteria > task.rubric.length) errors.push(`${w}: rubric không hợp lệ`);
      break;
    case 'creative_construction':
      break;
    case 'letter_tiles':
      if (task.answers.length === 0) errors.push(`${w}: thiếu answers`);
      break;
    case 'evidence':
      if (task.acceptable.length === 0 || task.acceptable.some((a) => a < 0 || a >= task.sentences.length)) errors.push(`${w}: acceptable không hợp lệ`);
      if (task.acceptable.length === task.sentences.length) errors.push(`${w}: phải có câu không phải bằng chứng`);
      break;
    case 'position_scene':
      if (!task.positions.includes(task.answer) || task.positions.length < 2) errors.push(`${w}: positions/answer không hợp lệ`);
      break;
  }

  // Lời giải chuẩn phải được chấm đúng
  try {
    const sol = gradeTask(task, solutionResponse(task));
    if (sol.status !== 'correct' && sol.status !== 'accepted') {
      errors.push(`${w}: lời giải chuẩn bị chấm "${sol.status}" – ${sol.feedback}`);
    }
  } catch (e) {
    errors.push(`${w}: lỗi khi chấm lời giải – ${(e as Error).message}`);
  }
  // Câu trả lời sai rõ ràng phải bị chấm chưa đúng
  const wrong = wrongResponse(task);
  if (wrong) {
    const res = gradeTask(task, wrong);
    if (res.status === 'correct' || res.status === 'accepted') errors.push(`${w}: câu trả lời sai lại được chấm đúng`);
  }

  if (task.twin) {
    if (task.twin.id === task.id) errors.push(`${w}: twin trùng id`);
    errors.push(...validateTask(task.twin, subject, `${w}~twin`));
  }
  return errors;
}

export function validateLesson(lesson: FocusLesson): string[] {
  const errors: string[] = [];
  const w = lesson.id;
  if (!lesson.title?.trim()) errors.push(`${w}: thiếu tiêu đề`);
  if (!lesson.curiosity?.question?.trim()) errors.push(`${w}: thiếu phần Khơi gợi tò mò`);
  if (!lesson.discover?.points?.length || lesson.discover.points.length > 3) errors.push(`${w}: Khám phá kiến thức cần 1–3 ý ngắn`);
  if (lesson.discover?.points?.some((p) => p.length > 160)) errors.push(`${w}: ý giải thích quá dài (>160 ký tự)`);
  if (!lesson.discover?.visual?.trim()) errors.push(`${w}: thiếu hình minh họa`);
  if (lesson.tasks.length < 8 || lesson.tasks.length > 12) errors.push(`${w}: cần 8–12 nhiệm vụ (đang có ${lesson.tasks.length})`);

  const ids = new Set<string>();
  const collect = (t: FocusTask) => {
    if (ids.has(t.id)) errors.push(`${w}: trùng id nhiệm vụ ${t.id}`);
    ids.add(t.id);
    if (t.twin) collect(t.twin);
  };
  lesson.tasks.forEach(collect);

  const stages = new Set(lesson.tasks.map((t) => t.stage));
  if (!stages.has('practice') && !stages.has('warmup')) errors.push(`${w}: thiếu phần Thực hành`);
  for (const s of ['advanced', 'creative', 'review'] as const) {
    if (!stages.has(s)) errors.push(`${w}: thiếu giai đoạn ${s}`);
  }
  const kinds = new Set(lesson.tasks.map((t) => t.kind));
  if (kinds.size < 4) errors.push(`${w}: cần ít nhất 4 dạng bài khác nhau (đang có ${kinds.size})`);
  const mcShare = lesson.tasks.filter((t) => t.kind === 'multiple_choice').length / lesson.tasks.length;
  if (mcShare > 0.4) errors.push(`${w}: quá nhiều trắc nghiệm (${Math.round(mcShare * 100)}%) – không biến việc học thành chỉ bấm chọn`);

  const challenge = lesson.tasks.find((t) => t.id === lesson.challengeTaskId);
  if (!challenge) errors.push(`${w}: challengeTaskId không tồn tại`);
  else {
    if (challenge.stage !== 'advanced') errors.push(`${w}: thử thách trước phải thuộc giai đoạn advanced`);
    if (!challenge.twin) errors.push(`${w}: thử thách trước cần câu tương đương (twin)`);
  }
  lesson.tasks.forEach((t) => errors.push(...validateTask(t, lesson.subject, w)));
  return errors;
}

export function validateSubjectContent(subject: string, topics: FocusTopic[], lessons: FocusLesson[]): string[] {
  const errors: string[] = [];
  if (topics.length !== 8) errors.push(`${subject}: cần 8 chủ đề (đang có ${topics.length})`);
  const planIds = new Set<string>();
  topics.forEach((t, i) => {
    if (t.subject !== subject) errors.push(`${t.id}: sai môn`);
    if (t.order !== i + 1) errors.push(`${t.id}: order phải là ${i + 1}`);
    if (t.lessons.length !== 3) errors.push(`${t.id}: cần 3 bài`);
    t.lessons.forEach((p) => {
      if (planIds.has(p.id)) errors.push(`${p.id}: trùng id kế hoạch`);
      planIds.add(p.id);
      if (!p.title.trim() || !p.objective.trim()) errors.push(`${p.id}: thiếu tiêu đề/mục tiêu`);
    });
  });
  lessons.forEach((l) => {
    if (l.subject !== subject) errors.push(`${l.id}: sai môn`);
    if (!planIds.has(l.id)) errors.push(`${l.id}: không có trong bản đồ chủ đề`);
    const topic = topics.find((t) => t.id === l.topicId);
    if (!topic || !topic.lessons.some((p) => p.id === l.id)) errors.push(`${l.id}: topicId không khớp`);
    errors.push(...validateLesson(l));
  });
  return errors;
}
