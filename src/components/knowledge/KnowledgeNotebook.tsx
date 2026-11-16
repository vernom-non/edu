import { useState } from 'react';
import { FOCUS_SUBJECTS } from '../../learning/catalog.ts';
import { KNOWLEDGE_CARDS } from '../../learning/knowledge/catalog.ts';
import { matchesKnowledge } from '../../learning/knowledge/notebook.ts';
import type { NotebookFilter } from '../../learning/knowledge/notebook.ts';
import type { KnowledgeCard, KnowledgeProgress } from '../../learning/knowledge/types.ts';
import type { FocusSubjectId } from '../../learning/types.ts';
import { knowledgeButton, knowledgeInput } from './KnowledgeCards.tsx';

export type LessonEntry = 'concept' | 'examples' | 'practice';

export function KnowledgeNotebook({ notebook, initialSubject, progress, onOpen, onToggleFavorite }: {
  notebook: boolean;
  initialSubject?: FocusSubjectId;
  progress: KnowledgeProgress;
  onOpen: (card: KnowledgeCard, entry: LessonEntry) => void;
  onToggleFavorite: (id: string) => void;
}) {
  const [subject, setSubject] = useState<FocusSubjectId | ''>(initialSubject ?? '');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<NotebookFilter>('all');
  const searchLabel = notebook ? 'Tìm trong sổ tay' : 'Tìm kiến thức';
  const visible = KNOWLEDGE_CARDS.filter((card) => (
    (!subject || card.subject === subject) && matchesKnowledge(card, progress[card.id], query, filter, notebook)
  ));
  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-extrabold sm:text-3xl">{notebook ? 'Sổ tay của em' : 'Thư viện kiến thức'}</h1>
      <div className="lg-card grid gap-3 p-4 sm:grid-cols-2">
        <label>
          <span className="block font-bold mb-1">{searchLabel}</span>
          <input type="search" className={knowledgeInput} value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <span className="block font-bold mb-1">Môn học</span>
          <select className={knowledgeInput} value={subject} onChange={(event) => setSubject(event.target.value as FocusSubjectId | '')}>
            <option value="">Tất cả môn</option>
            {FOCUS_SUBJECTS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        {notebook && (
          <div className="flex flex-wrap gap-2 sm:col-span-2" role="group" aria-label="Lọc sổ tay">
            {([['all', 'Tất cả'], ['favorite', 'Yêu thích'], ['review', 'Cần ôn']] as const).map(([id, label]) => (
              <button key={id} className={knowledgeButton} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>
        )}
      </div>
      {visible.length === 0 && (
        <p role="status">{notebook && !query && filter === 'all'
          ? 'Sổ tay sẽ có bài khi em lưu yêu thích, ghi nhớ hoặc đánh dấu cần ôn.'
          : 'Chưa có thẻ phù hợp.'}</p>
      )}
      {FOCUS_SUBJECTS.map((subjectMeta) => {
        const subjectCards = visible.filter((card) => card.subject === subjectMeta.id);
        if (!subjectCards.length) return null;
        const topics = new Set(subjectCards.map((card) => card.topic));
        return (
          <section key={subjectMeta.id} className="space-y-3">
            <h2 className="text-xl font-extrabold">{subjectMeta.icon} {subjectMeta.name}</h2>
            {[...topics].map((topic) => (
              <div key={topic}>
                <h3 className="mb-2 font-bold text-slate-700">{topic}</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {subjectCards.filter((card) => card.topic === topic).map((card) => {
                    const entry = progress[card.id];
                    return (
                      <li key={card.id} className="lg-card min-w-0 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button className="min-h-11 flex-1 text-left font-extrabold" onClick={() => onOpen(card, 'concept')}>{card.title}</button>
                          <button className="min-h-11 min-w-11 rounded-xl border border-slate-300" aria-label={`Yêu thích ${card.title}`} aria-pressed={!!entry?.favorite}
                            onClick={() => onToggleFavorite(card.id)}>{entry?.favorite ? '★' : '☆'}</button>
                        </div>
                        {notebook && (
                          <>
                            <p className="text-sm [overflow-wrap:anywhere]">{card.rule.expression}</p>
                            {!!entry?.reviewItems?.length && <p className="text-sm font-bold text-[#854d0e]">Cần ôn</p>}
                            <div className="flex flex-wrap gap-x-4">
                              <button className="min-h-11 font-semibold underline" onClick={() => onOpen(card, 'examples')}>Xem ví dụ</button>
                              <button className="min-h-11 font-semibold underline" onClick={() => onOpen(card, 'practice')}>Luyện lại</button>
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
        );
      })}
    </section>
  );
}
