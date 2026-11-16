import type { Activity } from '../../learning/expansion/activities.ts';
import { canMove, seededShuffle, simulateMaze } from '../../learning/grader.ts';
import type { TaskResponse } from '../../learning/types.ts';
import { knowledgeButton, knowledgeInput } from './KnowledgeCards.tsx';

function Choices({ labels, selected, many, onChoose }: {
  labels: string[];
  selected: number[];
  many?: boolean;
  onChoose: (value: number) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">{many ? 'Chọn tất cả đáp án phù hợp' : 'Chọn một đáp án'}</legend>
      {labels.map((label, index) => (
        <label key={label} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-300 p-2">
          <input type={many ? 'checkbox' : 'radio'} name="activity-choice" checked={selected.includes(index)} onChange={() => onChoose(index)} />
          {label}
        </label>
      ))}
    </fieldset>
  );
}

function Fields({ labels, values, numeric, onEdit }: {
  labels: string[];
  values: string[];
  numeric?: boolean;
  onEdit: (values: string[]) => void;
}) {
  return <div className="space-y-2">{labels.map((label, index) => (
    <label key={index} className="block font-semibold">
      {label}
      <input className={knowledgeInput} inputMode={numeric ? 'numeric' : 'text'} value={values[index]} onChange={(event) => (
        onEdit(values.map((value, i) => i === index ? event.target.value : value))
      )} />
    </label>
  ))}</div>;
}

export function RectangleModel({ width, height, max, perimeter, onChange }: {
  width: number; height: number; max: number; perimeter: boolean;
  onChange: (width: number, height: number) => void;
}) {
  return <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <label className="min-w-0">Chiều dài {width}
        <input type="range" className="block h-10 w-full accent-[#6B47F5]" min={1} max={max} value={width} onChange={(event) => onChange(Number(event.target.value), height)} />
      </label>
      <label className="min-w-0">Chiều rộng {height}
        <input type="range" className="block h-10 w-full accent-[#6B47F5]" min={1} max={max} value={height} onChange={(event) => onChange(width, Number(event.target.value))} />
      </label>
    </div>
    <div className="grid w-fit border-solid" style={{
      gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
      borderWidth: 3,
      borderColor: perimeter ? '#7551cf #15856f #7551cf #15856f' : '#75a996',
    }} aria-hidden="true">
      {Array.from({ length: width * height }, (_, index) => <div key={index} className="h-6 w-6 border border-[#b9d8cd] bg-[#e8f7ef]" />)}
    </div>
  </div>;
}

export function ActivityInputs({ task, response, update, observed, onObserve }: {
  task: Activity; response: TaskResponse; update: (value: TaskResponse) => void;
  observed: readonly string[]; onObserve: (key: string) => void;
}) {
  if (task.kind === 'number_input' && response.kind === task.kind) {
    return <Fields labels={[task.unit ? `Đáp án (${task.unit})` : 'Đáp án']} values={[response.value]} numeric
      onEdit={([value]) => update({ kind: 'number_input', value })} />;
  }
  if (task.kind === 'fill_blank' && response.kind === task.kind) {
    return <div className="space-y-2"><p>{task.text}</p>
      <Fields labels={task.blanks.map((_, i) => `Chỗ trống ${i + 1}`)} values={response.values} onEdit={(values) => update({ kind: 'fill_blank', values })} />
    </div>;
  }
  if (task.kind === 'multiple_choice' && response.kind === task.kind) {
    return <Choices labels={task.options} selected={response.choice === null ? [] : [response.choice]} onChoose={(choice) => update({ kind: 'multiple_choice', choice })} />;
  }
  if (task.kind === 'multiple_select' && response.kind === task.kind) {
    return <Choices many labels={task.options} selected={response.choices} onChoose={(option) => update({
      kind: 'multiple_select', choices: response.choices.includes(option) ? response.choices.filter((i) => i !== option) : [...response.choices, option],
    })} />;
  }
  if (task.kind === 'matching' && response.kind === task.kind) {
    const choices = seededShuffle(task.pairs.map((_, i) => i), task.id);
    return <div className="space-y-2">{task.pairs.map(([left], i) => (
      <label key={left} className="block font-semibold">{left}
        <select className={knowledgeInput} value={response.map[i] ?? ''} onChange={(event) => {
          const map = { ...response.map };
          if (event.target.value === '') delete map[i];
          else map[i] = Number(event.target.value);
          update({ kind: 'matching', map });
        }}>
          <option value="">Chọn cặp</option>
          {choices.map((index) => <option key={index} value={index}>{task.pairs[index][1]}</option>)}
        </select>
      </label>
    ))}</div>;
  }
  if (task.kind === 'order' && response.kind === task.kind) {
    const shuffled = seededShuffle(task.items.map((_, i) => i), task.id);
    const positions = shuffled.every((item, i) => item === i) ? shuffled.slice().reverse() : shuffled;
    return <div className="space-y-3">
      <p>Chạm các thẻ theo thứ tự. Chạm một thẻ đã chọn để bỏ thẻ đó.</p>
      <div className="flex flex-wrap gap-2">{positions.filter((i) => !response.order.includes(i)).map((i) => (
        <button type="button" className={knowledgeButton} key={i} onClick={() => update({ kind: 'order', order: [...response.order, i] })}>{task.items[i]}</button>
      ))}</div>
      {response.order.length > 0 && <ol className="flex flex-wrap gap-2 rounded-xl bg-[#EFFAF6] p-2" aria-label="Thứ tự đã chọn">
        {response.order.map((item, index) => <li key={item}><button type="button" className={knowledgeButton}
          onClick={() => update({ kind: 'order', order: response.order.filter((i) => i !== item) })}>{index + 1}. {task.items[item]}</button></li>)}
      </ol>}
    </div>;
  }
  if (task.kind === 'drag_drop' && response.kind === task.kind) {
    const place = (item: number, bin: number) => update({ kind: 'drag_drop', placement: { ...response.placement, [item]: bin } });
    return <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {task.bins.map((bin, index) => <div key={bin} className="min-h-16 rounded-xl border border-dashed p-2"
          onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
            event.preventDefault();
            const value = event.dataTransfer.getData('application/x-little-genius-item');
            if (value && task.items[Number(value)]) place(Number(value), index);
          }}>
          <p className="font-bold">{bin}</p>
          <p>{task.items.filter((_, item) => response.placement[item] === index).map(({ label }) => label).join(' · ')}</p>
        </div>)}
      </div>
      {task.items.map(({ label }, index) => <label key={label} className="grid items-center gap-1 sm:grid-cols-2">
        <span draggable onDragStart={(event) => event.dataTransfer.setData('application/x-little-genius-item', String(index))}
          className="cursor-grab font-semibold">{label}</span>
        <select className={knowledgeInput} value={response.placement[index] ?? ''} onChange={(event) => {
          const value = event.target.value;
          if (value !== '') place(index, Number(value));
          else {
            const placement = { ...response.placement };
            delete placement[index];
            update({ kind: 'drag_drop', placement });
          }
        }}>
          <option value="">Chọn nhóm</option>
          {task.bins.map((bin, i) => <option key={bin} value={i}>{bin}</option>)}
        </select>
      </label>)}
    </div>;
  }
  if (task.kind === 'find_mistake' && response.kind === task.kind) {
    return <div className="space-y-3">
      <Choices labels={task.lines} selected={response.line === null ? [] : [response.line]} onChoose={(line) => update({ ...response, line })} />
      <Fields labels={['Viết cách sửa']} values={[response.fix]} onEdit={([fix]) => update({ ...response, fix })} />
    </div>;
  }
  if (task.kind === 'step_reasoning' && response.kind === task.kind) {
    return <Fields labels={task.steps.map((step, i) => `Bước ${i + 1}. ${step.label}`)} values={response.values} numeric
      onEdit={(values) => update({ kind: 'step_reasoning', values })} />;
  }
  if (task.kind === 'pattern' && response.kind === task.kind) {
    return <div className="space-y-2">
      <p className="text-lg font-bold">{task.sequence.map((value) => value ?? '□').join(' · ')}</p>
      <Fields labels={task.answers.map((_, i) => `Ô trống ${i + 1}`)} values={response.values} onEdit={(values) => update({ kind: 'pattern', values })} />
    </div>;
  }
  if (task.kind === 'evidence' && response.kind === task.kind) {
    return <Choices labels={task.sentences} selected={response.selected === null ? [] : [response.selected]} onChoose={(selected) => update({ kind: 'evidence', selected })} />;
  }
  if (task.kind === 'geometry' && response.kind === task.kind) {
    return <RectangleModel width={response.width} height={response.height} max={task.maxSide} perimeter={task.target.perimeter !== undefined}
      onChange={(width, height) => update({ kind: 'geometry', width, height })} />;
  }
  if (task.kind === 'fraction' && response.kind === task.kind) {
    return <div className="flex flex-wrap gap-1" aria-label="Chọn các phần của thanh" role="group">
      {Array.from({ length: response.parts }, (_, index) => <button type="button" key={index} className={knowledgeButton}
        aria-label={`Phần ${index + 1}`} aria-pressed={response.shaded.includes(index)} onClick={() => update({
          ...response, shaded: response.shaded.includes(index) ? response.shaded.filter((item) => item !== index) : [...response.shaded, index],
        })}>{index + 1}</button>)}
    </div>;
  }
  if (task.kind === 'logic_grid' && response.kind === task.kind) {
    return <div className="grid max-w-72 grid-cols-4 border-2 border-slate-600">
      {response.grid.map((row, r) => row.map((value, c) => <select key={`${r}-${c}`} className="h-12 min-w-0 border bg-white text-center disabled:bg-[#F3EFFE]"
        style={{ borderRightWidth: c === 1 ? 3 : 1, borderBottomWidth: r === 1 ? 3 : 1 }}
        aria-label={`Hàng ${r + 1}, cột ${c + 1}`} disabled={!!task.givens[r][c]} value={value}
        onChange={(event) => {
          const grid = response.grid.map((line) => [...line]);
          grid[r][c] = Number(event.target.value);
          update({ kind: 'logic_grid', grid });
        }}>
        <option value={0}>·</option>
        {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>))}
    </div>;
  }
  if (task.kind === 'maze' && response.kind === task.kind) {
    const [row, col] = simulateMaze(task.grid, response.moves);
    const directions = [['U', -1, 0, 'Lên'], ['L', 0, -1, 'Trái'], ['D', 1, 0, 'Xuống'], ['R', 0, 1, 'Phải']] as const;
    return <div className="space-y-2">
      <div className="grid w-fit gap-1" style={{ gridTemplateColumns: `repeat(${task.grid[0].length}, minmax(0, 1fr))` }} aria-hidden="true">
        {task.grid.flatMap((line, r) => [...line].map((cell, c) => <span key={`${r}-${c}`}
          className={`grid size-10 place-items-center rounded ${cell === '#' ? 'bg-slate-600' : 'bg-[#F3EFFE]'}`}>
          {r === row && c === col ? '🟣' : cell === '#' || cell === '.' ? '' : cell}
        </span>))}
      </div>
      <p role="status">Hàng {row + 1}, cột {col + 1} · {response.moves.length} bước</p>
      <div className="flex flex-wrap gap-2">
        {directions.map(([move, dy, dx, label]) => <button type="button" key={move} className={knowledgeButton}
          disabled={!canMove(task.grid, row + dy, col + dx)}
          onClick={() => update({ kind: 'maze', moves: [...response.moves, move] })}>{label}</button>)}
        <button type="button" className={knowledgeButton} disabled={!response.moves.length}
          onClick={() => update({ kind: 'maze', moves: [] })}>Đi lại</button>
      </div>
    </div>;
  }
  if (task.kind === 'experiment' && response.kind === task.kind) {
    const key = response.config.join('-');
    const scene = task.outcomes[key];
    return <div className="space-y-3">
      {task.controls.map((control, index) => <label className="block font-bold" key={control.id}>{control.label}
        <select className={knowledgeInput} value={response.config[index]} onChange={(event) => update({
          ...response, config: response.config.map((value, i) => i === index ? Number(event.target.value) : value),
        })}>{control.options.map((option, i) => <option key={option} value={i}>{option}</option>)}</select>
      </label>)}
      <button type="button" className={knowledgeButton} onClick={() => onObserve(key)}>Quan sát kết quả</button>
      {scene && observed.includes(key) && <p className="rounded-xl bg-[#EFFAF6] p-3" role="status">{scene.emoji} {scene.text}</p>}
      <p className="text-sm">{task.modelNote}</p>
      {task.question && observed.length === Object.keys(task.outcomes).length && <div className="space-y-2"><p className="font-bold">{task.question.prompt}</p>
        <Choices labels={task.question.options} selected={response.choice === null ? [] : [response.choice]}
          onChoose={(choice) => update({ ...response, choice })} />
      </div>}
    </div>;
  }
  if (task.kind === 'creative_construction' && response.kind === task.kind && response.numbers) {
    return <Fields labels={response.numbers.map((_, i) => `Số ${i + 1}`)} values={response.numbers} numeric
      onEdit={(numbers) => update({ kind: 'creative_construction', numbers })} />;
  }
  return null;
}
