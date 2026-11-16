import { useRef, useState } from 'react';
import { getSubjectMeta } from '../../learning/catalog.ts';
import { PRACTICE_LEVELS } from '../../learning/knowledge/catalog.ts';
import type { KnowledgeCard, KnowledgeRecord } from '../../learning/knowledge/types.ts';
import {
  AnswerAndCompare, ConceptCard, FormulaCard, InteractiveExample, knowledgeButton, knowledgeInput, StepByStepExplanation,
} from './KnowledgeCards.tsx';
import { expandedLesson, type ExpandedLesson } from '../../learning/expansion/program.ts';
import { RectangleModel } from './ActivityInputs.tsx';
import { ExpandedPractice } from './ExpandedPractice.tsx';
import { LinkedPractice, linkedTasks } from './LinkedPractice.tsx';
import type { LessonEntry } from './KnowledgeNotebook.tsx';

const steps = ['Hiểu khái niệm', 'Xem minh họa', 'Học quy tắc', 'Xem ví dụ', 'Tự thực hành', 'Con cần nhớ'];
const startingStep = { concept: 0, examples: 3, practice: 4, review: 4, resume: 0 };

function initialStep(entry: LessonEntry, saved?: number) {
  return entry === 'resume' && saved !== undefined && Number.isInteger(saved) && saved >= 0 && saved < steps.length
    ? saved
    : startingStep[entry];
}

export function KnowledgeLesson({
  card, entry, record, onFavorite, onLearned, onReflect, onActivity, onStep, onLegacyPractice,
}: {
  card: KnowledgeCard;
  entry: LessonEntry;
  record: KnowledgeRecord;
  onFavorite: () => void;
  onLearned: () => void;
  onReflect: (item: string, review: boolean) => void;
  onActivity: (item: string, correct: boolean) => void;
  onStep: (step: number) => void;
  onLegacyPractice?: () => void;
}) {
  const [step, setStep] = useState(() => initialStep(entry, record.lastStep));
  const [example, setExample] = useState(0);
  const [quickPractice, setQuickPractice] = useState(entry === 'practice' || entry === 'review' || entry === 'resume');
  const [challengeFirst, setChallengeFirst] = useState(false);
  const expanded = expandedLesson(card.id);
  const heading = useRef<HTMLHeadingElement>(null);
  const subject = getSubjectMeta(card.subject);
  const go = (next: number) => {
    setStep(next);
    onStep(next);
    if (next === 5 && expanded?.tasks.every((task) => record.activityResults?.[task.id] === true)) onLearned();
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <header className="space-y-1">
        <p className="font-semibold text-slate-700">{subject.icon} {subject.name} · {card.topic}{expanded && ` · Lớp ${expanded.grade}`}</p>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{card.title}</h1>
      </header>
      <section className="lg-card space-y-4 p-4 sm:p-6" aria-labelledby="knowledge-step">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 ref={heading} tabIndex={-1} id="knowledge-step" className="text-xl font-extrabold">{steps[step]}</h2>
          <span aria-label={`Bước ${step + 1} trên ${steps.length}`} className="font-bold text-slate-700">{step + 1}/{steps.length}</span>
        </div>
        {step === 0 && <div className="space-y-3">
          {expanded && <p className="font-semibold text-slate-700">{expanded.objective}</p>}
          <ConceptCard card={card} />
        </div>}
        {step === 1 && (card.id === 'math-perimeter' ? <PerimeterExample /> : <InteractiveExample card={card} />)}
        {step === 2 && <FormulaCard rule={card.rule} example={card.examples[0]} />}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Chọn ví dụ">
              {['Ví dụ cơ bản', 'Ví dụ thực tế'].map((label, index) => (
                <button key={label} className={knowledgeButton} aria-pressed={example === index} onClick={() => setExample(index)}>{label}</button>
              ))}
            </div>
            <StepByStepExplanation key={example} example={card.examples[example]} />
          </div>
        )}
        {step === 4 && <Practice card={card} quick={quickPractice} expanded={expanded} record={record} review={entry === 'review' || entry === 'resume'}
          challengeFirst={challengeFirst} onChallengeChange={setChallengeFirst}
          onActivity={onActivity} onReflect={onReflect} onLegacyPractice={onLegacyPractice} />}
        {step === 5 && (
          <>
            <dl className="space-y-3">
              <div><dt className="font-bold">Khái niệm</dt><dd>{card.concept}</dd></div>
              <div><dt className="font-bold">Quy tắc</dt><dd>{card.rule.expression}</dd></div>
              <div><dt className="font-bold">Ví dụ ngắn</dt><dd>{card.examples[0].steps.at(-1)}</dd></div>
              <div><dt className="font-bold">Lỗi cần tránh</dt><dd>{card.rule.mistake}</dd></div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <button className="lg-btn-primary disabled:opacity-65" onClick={onLearned} disabled={!!record.learned}>
                {record.learned ? 'Đã lưu vào Sổ tay' : 'Lưu vào Sổ tay'}
              </button>
              <button className={knowledgeButton} aria-pressed={!!record.favorite} onClick={onFavorite}>★ Yêu thích</button>
            </div>
          </>
        )}
      </section>
      <nav className="flex flex-wrap gap-2" aria-label="Các bước bài kiến thức">
        {step > 0 && <button className={knowledgeButton} onClick={() => go(step - 1)}>Quay lại</button>}
        {step < 5 && <button className="lg-btn-primary" onClick={() => go(step + 1)}>Tiếp theo</button>}
        {step < 4 && <button className={knowledgeButton} onClick={() => { setQuickPractice(true); go(4); }}>Luyện nhanh</button>}
        {step === 0 && expanded && <button className={knowledgeButton} onClick={() => { setChallengeFirst(true); go(4); }}>Thử thách trước</button>}
      </nav>
    </section>
  );
}

function Practice({ card, quick, expanded, record, review, challengeFirst, onChallengeChange, onActivity, onReflect, onLegacyPractice }: {
  card: KnowledgeCard;
  quick: boolean;
  expanded?: ExpandedLesson;
  review: boolean;
  record: KnowledgeRecord;
  challengeFirst: boolean;
  onChallengeChange: (enabled: boolean) => void;
  onActivity: (item: string, correct: boolean) => void;
  onReflect: (item: string, review: boolean) => void;
  onLegacyPractice?: () => void;
}) {
  const [mode, setMode] = useState<'guided' | 'solo' | 'activity' | 'linked'>(() => {
    if (challengeFirst || (review && expanded
      && (record.reviewItems?.some((item) => expanded.tasks.some((task) => task.id === item)) || !record.reviewItems?.length))) return 'activity';
    if (review && record.reviewItems?.includes('guided')) return 'guided';
    return quick ? 'solo' : 'guided';
  });
  const [question, setQuestion] = useState(() => {
    const review = record.reviewItems?.find((item) => /^practice-[0-4]$/.test(item));
    return quick && review ? Number(review.at(-1)) : 0;
  });
  const focusId = card.focusLessonId;
  const hasLinked = focusId && linkedTasks(focusId).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Cách luyện tập">
        <button className={knowledgeButton} aria-pressed={mode === 'guided'} onClick={() => setMode('guided')}>Có hướng dẫn</button>
        <button className={knowledgeButton} aria-pressed={mode === 'solo'} onClick={() => setMode('solo')}>Tự luyện</button>
        {expanded && <button className={knowledgeButton} aria-pressed={mode === 'activity'} onClick={() => setMode('activity')}>Hoạt động</button>}
        {hasLinked && <button className={knowledgeButton} aria-pressed={mode === 'linked'} onClick={() => setMode('linked')}>Bài tập liên quan</button>}
      </div>
      {mode === 'guided' && (
        <AnswerAndCompare key="guided" {...card.guided} onReflect={(review) => onReflect('guided', review)} />
      )}
      {mode === 'solo' && (
        <div className="space-y-3">
          <label className="block space-y-1">
            <span className="font-semibold">Chọn mức luyện</span>
            <select className={knowledgeInput} value={question} onChange={(event) => setQuestion(Number(event.target.value))}>
              {PRACTICE_LEVELS.map((level, index) => <option key={level} value={index}>{level}</option>)}
            </select>
          </label>
          <AnswerAndCompare key={question} {...card.practice[question]} criteria={question === 4 ? expanded?.criteria : undefined} onReflect={(review) => onReflect(`practice-${question}`, review)} />
        </div>
      )}
      {mode === 'activity' && expanded && <>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Chế độ hoạt động">
          <button className={knowledgeButton} aria-pressed={!challengeFirst} onClick={() => onChallengeChange(false)}>Học từng bước</button>
          <button className={knowledgeButton} aria-pressed={challengeFirst} onClick={() => onChallengeChange(true)}>Thử thách trước</button>
        </div>
        <ExpandedPractice key={String(challengeFirst)} lesson={expanded} record={record} challengeFirst={challengeFirst} onResult={onActivity} />
      </>}
      {mode === 'linked' && focusId && <LinkedPractice lessonId={focusId} onReflect={onReflect} />}
      {onLegacyPractice && <button className={knowledgeButton} onClick={onLegacyPractice}>Mở phòng thực hành</button>}
    </div>
  );
}

function PerimeterExample() {
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  return <div className="space-y-3">
    <p>Thay đổi độ dài hai cạnh. Mỗi màu đánh dấu một cặp cạnh bằng nhau.</p>
    <RectangleModel width={width} height={height} max={8} perimeter onChange={(nextWidth, nextHeight) => {
      setWidth(nextWidth);
      setHeight(nextHeight);
    }} />
    <p className="font-bold" aria-live="polite">({width} + {height}) × 2 = {(width + height) * 2} đơn vị độ dài</p>
  </div>;
}
