import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { GRADES_META, INITIAL_LESSONS, SUBJECTS_META, CURRICULUM_TOPICS_MAP } from './src/data/curriculumData.ts';
import { evaluateTaskSubmission } from './src/engine/learningEngine.ts';
import { generateSocraticGuidance } from './src/engine/socraticTutor.ts';
import { EXERCISE_36_CATALOG, generateControlledMultiplicationVariant } from './src/engine/exerciseBankEngine.ts';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 650,
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'eduexplore-api-server',
      configureServer(server) {
        server.middlewares.use('/api/health', (_req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'ok',
              project: 'Little Genius – Thế giới khám phá của em (EduExplore)',
              environment: 'development',
              version: '2.0.0',
              aiMode: 'rule_based_socratic',
              subjectsCount: SUBJECTS_META.length,
              topicsCount: CURRICULUM_TOPICS_MAP.length,
              lessonsCount: INITIAL_LESSONS.length,
              exerciseTemplatesCount: EXERCISE_36_CATALOG.length,
            })
          );
        });

        server.middlewares.use('/api/curriculum', (_req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              grades: GRADES_META,
              subjects: SUBJECTS_META,
              topicsMap: CURRICULUM_TOPICS_MAP,
              lessons: INITIAL_LESSONS,
              exerciseCatalog: EXERCISE_36_CATALOG,
            })
          );
        });

        server.middlewares.use('/api/exercises/variant', (req, res) => {
          const url = new URL(req.url || '/', 'http://localhost');
          const seed = Number(url.searchParams.get('seed') ?? '7');
          const mode = (url.searchParams.get('mode') ?? 'visual_array') as
            | 'visual_array'
            | 'equal_groups'
            | 'shopping_math'
            | 'area_grid'
            | 'logic_riddle'
            | 'model_builder';
          const grade = (Number(url.searchParams.get('grade') ?? '3') || 3) as 1 | 2 | 3 | 4 | 5;
          const variant = generateControlledMultiplicationVariant(seed, mode, grade);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ variant }));
        });

        server.middlewares.use('/api/evaluate', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
          }
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { lessonId, taskId, submission } = JSON.parse(body);
              const lesson = INITIAL_LESSONS.find((l) => l.id === lessonId);
              const task = lesson?.tasks.find((t) => t.id === taskId);
              if (!lesson || !task) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Lesson or task not found' }));
                return;
              }
              const result = evaluateTaskSubmission(task, submission);
              const tutor = generateSocraticGuidance({
                lesson,
                task,
                attemptCount: 1,
                lastEvaluation: result,
                grade: lesson.grade,
              });
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ evaluation: result, tutor }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid request payload' }));
            }
          });
        });
      },
    },
  ],
});
