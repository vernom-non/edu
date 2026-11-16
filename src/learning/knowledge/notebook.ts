import type { KnowledgeCard, KnowledgeRecord } from './types.ts';

export type NotebookFilter = 'all' | 'favorite' | 'review';

export function recordReflection(record: KnowledgeRecord, item: string, review: boolean): KnowledgeRecord {
  const items = new Set(record.reviewItems);
  if (review) items.add(item);
  else items.delete(item);
  return { ...record, reviewItems: [...items] };
}

function fold(text: string) {
  return text.toLocaleLowerCase('vi').normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').trim();
}

export function matchesKnowledge(
  card: KnowledgeCard,
  record: KnowledgeRecord | undefined,
  query: string,
  filter: NotebookFilter,
  notebook: boolean,
) {
  if (notebook && !record?.learned && !record?.favorite && !record?.reviewItems?.length) return false;
  if (filter === 'favorite' && !record?.favorite) return false;
  if (filter === 'review' && !record?.reviewItems?.length) return false;
  const content = fold([card.title, card.topic, card.concept, card.rule.expression, card.rule.parts].join(' '));
  return fold(query).split(/\s+/).every((word) => content.includes(word));
}

export function checkKnowledgeAnswer(attempt: string, accepted: readonly string[]) {
  const compact = (value: string) => fold(value).replace(/[.!?]+$/g, '').replace(/\s+/g, '');
  return accepted.some((answer) => compact(attempt) === compact(answer));
}
