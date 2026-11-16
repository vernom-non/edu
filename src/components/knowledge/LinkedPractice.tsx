import { useState } from 'react';
import { getFocusLesson } from '../../learning/catalog.ts';
import { emptyResponse, gradeTask } from '../../learning/grader.ts';
import type { FocusTask, GradeResult } from '../../learning/types.ts';
import { speakText } from '../../utils/speechAndAudio.ts';
import { knowledgeButton, knowledgeInput } from './KnowledgeCards.tsx';

type SupportedTask = Extract<FocusTask, { kind: 'multiple_choice' | 'number_input' | 'fill_blank' | 'visual_counting' }>;

function isSupported(task: FocusTask): task is SupportedTask {
  return task.kind === 'multiple_choice' || task.kind === 'number_input'
    || task.kind === 'fill_blank' || task.kind === 'visual_counting';
}

export function linkedTasks(lessonId: string) {
  return getFocusLesson(lessonId)?.tasks.filter(isSupported) ?? [];
}

export function LinkedPractice({ lessonId, onReflect }: { lessonId: string; onReflect: (item: string, review: boolean) => void }) {
  const [index, setIndex] = useState(0);
  const tasks = linkedTasks(lessonId);
  const task = tasks[index];
  if (!task) return null;
  return (
    <div className="space-y-3">
      <p className="font-semibold">{getFocusLesson(lessonId)?.title} · {index + 1}/{tasks.length}</p>
      <ExistingQuestion key={task.id} task={task} onReflect={(review) => onReflect(task.id, review)} />
      <div className="flex gap-2">
        <button className={knowledgeButton} disabled={index === 0} onClick={() => setIndex(index - 1)}>Câu trước</button>
        <button className={knowledgeButton} disabled={index === tasks.length - 1} onClick={() => setIndex(index + 1)}>Câu sau</button>
      </div>
    </div>
  );
}

function ExistingQuestion({ task, onReflect }: { task: SupportedTask; onReflect: (review: boolean) => void }) {
  const [response, setResponse] = useState(() => emptyResponse(task));
  const [result, setResult] = useState<GradeResult>();
  const [hints, setHints] = useState(0);
  const correct = result?.status === 'correct';
  const { audio } = task;
  return (
    <form className="space-y-3" onChange={() => setResult(undefined)} onSubmit={(event) => {
      event.preventDefault();
      const feedback = gradeTask(task, response);
      setResult(feedback);
      if (feedback.status === 'correct' || feedback.status === 'incorrect') onReflect(feedback.status === 'incorrect');
    }}>
      {task.passage && <p className="whitespace-pre-wrap rounded-xl bg-[#F3EFFE] p-3">{task.passage}</p>}
      {audio && <p><button type="button" className={knowledgeButton} onClick={() => speakText(audio.text, audio.lang)}>🔊 Nghe</button> <span>{audio.text}</span></p>}
      <p className="font-bold">{task.prompt}</p>
      {task.visual && <p className="whitespace-pre-wrap">{task.visual}</p>}
      {task.kind === 'visual_counting' && task.groups.map((group, index) => (
        <p key={index}>{group.label} {group.emoji.repeat(group.count)}</p>
      ))}
      {task.kind === 'multiple_choice' && response.kind === 'multiple_choice' && (
        <fieldset className="space-y-2">
          <legend className="sr-only">Chọn đáp án</legend>
          {task.options.map((option, index) => (
            <label key={option} className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-300 p-2">
              <input type="radio" name="answer" checked={response.choice === index} onChange={() => setResponse({ kind: 'multiple_choice', choice: index })} />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      )}
      {task.kind === 'fill_blank' && response.kind === 'fill_blank' && (
        <div className="space-y-2">
          <p>{task.text}</p>
          {task.wordBank && <p>Từ gợi ý — {task.wordBank.join(' · ')}</p>}
          {response.values.map((value, index) => (
            <input key={index} className={knowledgeInput} aria-label={`Chỗ trống ${index + 1}`} value={value} onChange={(event) => {
              setResponse({ kind: 'fill_blank', values: response.values.map((old, i) => i === index ? event.target.value : old) });
            }} />
          ))}
        </div>
      )}
      {(response.kind === 'number_input' || response.kind === 'visual_counting') && (
        <input className={knowledgeInput} aria-label="Đáp án bằng số" inputMode="decimal" value={response.value}
          onChange={(event) => setResponse({ kind: response.kind, value: event.target.value })} />
      )}
      {!!hints && <ol className="list-decimal pl-6" aria-live="polite">{task.hints.slice(0, hints).map((hint) => <li key={hint}>{hint}</li>)}</ol>}
      {result && <p className="rounded-xl bg-[#EFFAF6] p-3" role="status">{correct ? task.explanation : result.feedback}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={knowledgeButton}>Kiểm tra</button>
        <button type="button" className={knowledgeButton} disabled={hints === task.hints.length} onClick={() => setHints(hints + 1)}>Gợi ý</button>
      </div>
    </form>
  );
}
