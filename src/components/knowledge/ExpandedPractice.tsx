import { useState } from 'react';
import { recommendedTask, type ExpandedLesson } from '../../learning/expansion/program.ts';
import { emptyResponse, gradeTask } from '../../learning/grader.ts';
import type { KnowledgeRecord } from '../../learning/knowledge/types.ts';
import type { GradeResult } from '../../learning/types.ts';
import { speakText } from '../../utils/speechAndAudio.ts';
import type { Activity } from '../../learning/expansion/activities.ts';
import { ActivityInputs } from './ActivityInputs.tsx';
import { InteractiveExample, knowledgeButton, StepByStepExplanation } from './KnowledgeCards.tsx';

type Report = (task: string, correct: boolean) => void;

export function ExpandedPractice({ lesson, record, challengeFirst, onResult }: {
  lesson: ExpandedLesson;
  record: KnowledgeRecord;
  challengeFirst: boolean;
  onResult: Report;
}) {
  const order = challengeFirst ? [2, 0, 1] : [0, 1, 2];
  const [position, setPosition] = useState(() => challengeFirst ? 0 : recommendedTask(lesson, record));
  const task = lesson.tasks[order[position]];
  const done = lesson.tasks.filter((item) => record.activityResults?.[item.id] === true).length;
  return <div className="space-y-4">
    <div className="flex flex-wrap justify-between gap-2">
      <p className="font-bold">{['Dễ', 'Vừa', 'Thử thách'][order[position]]}</p>
      <p aria-live="polite">Đã giải {done}/{lesson.tasks.length}</p>
    </div>
    <ActivityForm key={task.id} lesson={lesson} task={task} onResult={onResult} />
    <div className="flex flex-wrap gap-2">
      <button className={knowledgeButton} disabled={position === 0} onClick={() => setPosition(position - 1)}>Hoạt động trước</button>
      <button className={knowledgeButton} disabled={position === order.length - 1} onClick={() => setPosition(position + 1)}>Hoạt động sau</button>
    </div>
  </div>;
}

function ActivityForm({ lesson, task, onResult }: { lesson: ExpandedLesson; task: Activity; onResult: Report }) {
  const [response, setResponse] = useState(() => emptyResponse(task));
  const [feedback, setFeedback] = useState<GradeResult>();
  const [hints, setHints] = useState(0);
  const [prediction, setPrediction] = useState('');
  const [observing, setObserving] = useState(false);
  const [observed, setObserved] = useState<string[]>([]);
  const success = feedback?.status === 'correct' || feedback?.status === 'accepted';
  const audio = task.audio;
  const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return <form className="space-y-3" onSubmit={(event) => {
    event.preventDefault();
    if (task.kind === 'experiment' && (!prediction.trim() || response.kind !== 'experiment' || observed.length < Object.keys(task.outcomes).length)) {
      setFeedback({ status: 'incomplete', feedback: 'Ghi dự đoán và quan sát cả hai trường hợp trước nhé.' });
      return;
    }
    const result = gradeTask(task, response);
    setFeedback(result);
    if (result.status !== 'incomplete') {
      onResult(task.id, result.status !== 'incorrect');
      if (result.status === 'incorrect') setHints((count) => Math.max(count, 1));
    }
  }}>
    <p className="font-bold">{task.prompt}</p>
    {task.passage && <p className="rounded-xl bg-[#F3EFFE] p-3">{task.passage}</p>}
    {audio && (
      <div className="flex flex-wrap items-center gap-3">
        {hasSpeech && <button type="button" className={knowledgeButton} onClick={() => speakText(audio.text, audio.lang)}>🔊 Nghe</button>}
        <details open={!hasSpeech}><summary className="cursor-pointer font-semibold">Xem lời đọc</summary><p>{audio.text}</p></details>
      </div>
    )}
    {task.kind === 'experiment' && (observing ? (
      <p className="text-sm"><strong>Dự đoán của em</strong><br />{prediction}</p>
    ) : (
      <div className="space-y-2">
        <label className="block font-semibold">
          Em dự đoán điều gì?
          <input className="mt-1 w-full rounded-xl border border-slate-400 bg-white p-3"
            value={prediction} onChange={(event) => setPrediction(event.target.value)} />
        </label>
        <button type="button" className={knowledgeButton} disabled={!prediction.trim()} onClick={() => setObserving(true)}>
          Bắt đầu quan sát
        </button>
      </div>
    ))}
    {(task.kind !== 'experiment' || observing) && (
      <ActivityInputs task={task} response={response} update={(next) => { setResponse(next); setFeedback(undefined); }}
        observed={observed} onObserve={(key) => {
          setObserved((keys) => keys.includes(key) ? keys : [...keys, key]);
          setFeedback(undefined);
        }} />
    )}
    {feedback && <p role="status" className="rounded-xl bg-[#EFFAF6] p-3">{success ? task.explanation : feedback.feedback}</p>}
    {hints >= 1 && <div className="rounded-xl bg-[#F3EFFE] p-3" aria-live="polite">
      <p className="font-bold">Xem lại {lesson.card.title.toLocaleLowerCase('vi')}</p>
      <p>{task.hints[0]}</p>
      {hints >= 2 && <p className="mt-2">{lesson.card.rule.expression}</p>}
    </div>}
    {hints >= 3 && <StepByStepExplanation example={lesson.card.examples[0]} />}
    {hints >= 4 && <InteractiveExample card={lesson.card} />}
    <div className="flex flex-wrap gap-2">
      {(task.kind !== 'experiment' || observed.length === Object.keys(task.outcomes).length) && (
        <button className="lg-btn-primary disabled:opacity-60" type="submit" disabled={success}>Kiểm tra</button>
      )}
      {!success && hints < 4 && <button className={knowledgeButton} type="button" onClick={() => setHints(hints + 1)}>
        {['Gợi ý', 'Xem quy tắc', 'Xem ví dụ tương tự', 'Xem minh họa'][hints]}
      </button>}
    </div>
  </form>;
}
