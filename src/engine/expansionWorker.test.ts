import assert from 'node:assert/strict';
import { test } from 'node:test';
import worker from '../../worker/index.ts';

test('worker serves filtered verified curriculum metadata and keeps SPA assets separate from API 404s', async () => {
  const assets = { fetch: async () => new Response('app') };
  const env = { ASSETS: assets };
  const request = (path: string) => new Request(`https://little-genius.test${path}`);
  const api = await worker.fetch(request('/api/learning-path?subject=math&grade=3'), env);
  assert.equal(api.status, 200);
  const { lessons } = await api.json();
  assert.equal(lessons.length, 4);
  assert.ok(lessons.every((lesson: Record<string, unknown>) =>
    lesson.subject === 'math' && lesson.grade === 3 && lesson.status === 'verified' && lesson.activityCount === 9));
  assert.equal('tasks' in lessons[0], false);
  assert.equal((await worker.fetch(request('/api/missing'), env)).status, 404);
  assert.equal(await (await worker.fetch(request('/learn'), env)).text(), 'app');
});
