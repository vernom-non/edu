import { useState } from 'react';
import type { KnowledgeCard, KnowledgeExample, KnowledgeRule } from '../../learning/knowledge/types.ts';
import { checkKnowledgeAnswer } from '../../learning/knowledge/notebook.ts';
import { speakText } from '../../utils/speechAndAudio.ts';

export const knowledgeButton = 'min-h-11 rounded-xl border border-[#D8CBF8] bg-[#F3EFFE] px-3 py-2 font-bold aria-pressed:bg-[#263238] aria-pressed:text-white disabled:opacity-45';
export const knowledgeInput = 'w-full rounded-xl border border-slate-400 bg-white p-3 text-[#263238]';

export function ConceptCard({ card }: { card: KnowledgeCard }) {
  return (
    <div className="space-y-4">
      <p className="text-xl font-bold">{card.concept}</p>
      <div>
        <h3 className="font-bold">Gặp ở đâu và dùng để làm gì?</h3>
        <p>{card.use}</p>
      </div>
      {card.audio && typeof window !== 'undefined' && 'speechSynthesis' in window && (
        <button className={knowledgeButton} onClick={() => speakText(card.audio!, 'en-US')}>
          🔊 Nghe phát âm
        </button>
      )}
    </div>
  );
}

export function FormulaCard({ rule, example }: { rule: KnowledgeRule; example: KnowledgeExample }) {
  return (
    <div className="space-y-4">
      <p className="font-bold">{rule.name}</p>
      <p className="rounded-2xl bg-[#F3EFFE] p-4 font-extrabold text-lg [overflow-wrap:anywhere]">{rule.expression}</p>
      <dl className="space-y-3">
        <div><dt className="font-bold">Ý nghĩa</dt><dd>{rule.parts}</dd></div>
        <div><dt className="font-bold">Khi nào dùng?</dt><dd>{rule.when}</dd></div>
        {rule.unit && <div><dt className="font-bold">Đơn vị</dt><dd>{rule.unit}</dd></div>}
        <div><dt className="font-bold">Ví dụ</dt><dd>{example.prompt} {example.steps.at(-1)}</dd></div>
        <div><dt className="font-bold">Lỗi cần tránh</dt><dd>{rule.mistake}</dd></div>
      </dl>
    </div>
  );
}

export function InteractiveExample({ card }: { card: KnowledgeCard }) {
  const [selected, setSelected] = useState(0);
  const scene = card.scenes[selected];
  return (
    <div className="space-y-4">
      <p>{card.why}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Thay đổi minh họa">
        {card.scenes.map(({ label }, index) => (
          <button key={label} aria-pressed={selected === index} className={knowledgeButton} onClick={() => setSelected(index)}>
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-[#EFFAF6] p-4" aria-live="polite">
        {scene.fractionBars ? (
          <div className="mx-auto mb-3 max-w-xs space-y-2">
            {scene.fractionBars.map(([shaded, parts]) => (
              <div key={`${shaded}/${parts}`} className="flex items-center gap-2">
                <span className="w-10 font-bold">{shaded}/{parts}</span>
                <div className="grid h-9 flex-1 overflow-hidden rounded-lg border border-slate-500 bg-white"
                  style={{ gridTemplateColumns: `repeat(${parts}, minmax(0, 1fr))` }} aria-hidden="true">
                  {Array.from({ length: parts }, (_, index) => (
                    <span key={index} className={`border-r border-slate-500 last:border-0 ${index < shaded ? 'bg-[#4278c7]' : ''}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div aria-hidden="true" className="my-1 whitespace-pre-wrap text-center font-mono text-lg font-bold [overflow-wrap:anywhere] sm:text-2xl">
            {scene.picture}
          </div>
        )}
        <p>{scene.explanation}</p>
      </div>
      {card.subject === 'science' && <p className="text-sm text-slate-700">Minh họa giản lược. Hình và khoảng cách chỉ giúp quan sát ý chính.</p>}
    </div>
  );
}

export function StepByStepExplanation({ example }: { example: KnowledgeExample }) {
  const [visible, setVisible] = useState(1);
  return (
    <div className="space-y-4">
      <p className="font-bold">{example.prompt}</p>
      <ol className="list-decimal space-y-2 pl-6" aria-live="polite">
        {example.steps.slice(0, visible).map((step, index) => <li key={index}>{step}</li>)}
      </ol>
      {visible < example.steps.length && (
        <button className={knowledgeButton} onClick={() => setVisible(visible + 1)}>Xem bước tiếp theo</button>
      )}
    </div>
  );
}

export function AnswerAndCompare({
  prompt, answer, accepted, hints, onReflect,
}: {
  prompt: string;
  answer: string;
  accepted?: readonly string[];
  hints?: readonly string[];
  onReflect: (needsReview: boolean) => void;
}) {
  const [shownHints, setShownHints] = useState(0);
  const [attempt, setAttempt] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<boolean>();
  const [review, setReview] = useState<boolean>();
  return (
    <div className="space-y-4">
      <p className="font-bold">{prompt}</p>
      <label className="block space-y-1">
        <span className="font-semibold">Cách làm của em</span>
        <textarea className={knowledgeInput} rows={2} value={attempt} onChange={(event) => {
          setAttempt(event.target.value);
          setChecked(undefined);
        }} />
      </label>
      {!!shownHints && <ol className="list-decimal space-y-2 rounded-xl bg-[#F3EFFE] py-3 pl-8 pr-3" aria-live="polite">
        {hints?.slice(0, shownHints).map((hint) => <li key={hint}>{hint}</li>)}
      </ol>}
      {checked !== undefined && <p role="status">{checked ? 'Đúng rồi!' : 'Câu trả lời chưa khớp. Em có thể thử lại hoặc xem lời giải.'}</p>}
      {!revealed && (
        <div className="flex flex-wrap gap-2">
          {hints && shownHints < hints.length && <button className={knowledgeButton} onClick={() => setShownHints(shownHints + 1)}>Xem gợi ý {shownHints + 1}</button>}
          {accepted && <button className={knowledgeButton} disabled={!attempt.trim()} onClick={() => {
            const correct = checkKnowledgeAnswer(attempt, accepted);
            setChecked(correct);
            onReflect(!correct);
            if (correct) setRevealed(true);
          }}>Kiểm tra</button>}
          <button className={knowledgeButton} onClick={() => setRevealed(true)}>Đối chiếu lời giải</button>
        </div>
      )}
      {revealed && (
        <div className="space-y-3 rounded-xl bg-[#EFFAF6] p-4">
          <p role="status">{answer}</p>
          <p>Em có giải thích được cách làm của mình không?</p>
          <div className="flex flex-wrap gap-2">
            {([false, true] as const).map((needed) => (
              <button key={String(needed)} className={knowledgeButton} aria-pressed={review === needed}
                onClick={() => {
                  setReview(needed);
                  onReflect(needed);
                }}>
                {needed ? 'Em cần ôn' : 'Em đã hiểu'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
