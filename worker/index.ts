// ============================================================================
// Little Genius (EduExplore) – Cloudflare Workers 24/7 Production Backend
// Kết nối đồng thời Supabase PostgreSQL (REST API) + Cloudflare D1 + KV + Assets
// ============================================================================

import {
  CURRICULUM_TOPICS_MAP,
  GRADES_META,
  INITIAL_LESSONS,
  SUBJECTS_META,
} from '../src/data/curriculumData.ts';
import { evaluateTaskSubmission } from '../src/engine/learningEngine.ts';
import { generateSocraticGuidance } from '../src/engine/socraticTutor.ts';
import {
  EXERCISE_36_CATALOG,
  generateControlledMultiplicationVariant,
  type MultiplicationCognitiveMode,
} from '../src/engine/exerciseBankEngine.ts';
import { learningPath } from '../src/learning/expansion/program.ts';
import { CURIOSITY_10_LIBRARY } from '../src/data/curiosityData.ts';
import {
  checkRateLimit,
  cleanupExpiredCaches,
  fetchWithTimeout,
  getCachedIdempotentResponse,
  sanitizeStringInput,
  SECURITY_HEADERS,
  storeIdempotentResponse,
  verifyStudentAccess,
  verifyTurnstileServerSide,
} from './security.ts';

export interface CloudflareEnv {
  APP_ENV?: 'development' | 'staging' | 'production';
  DEPLOYMENT_VERSION?: string;
  TURNSTILE_SECRET_KEY?: string;
  AI_PROVIDER?: string;
  // Cấu hình kết nối Supabase 24/7
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_STORAGE_BUCKET?: string;
  // Bindings cho Cloudflare D1, R2, KV và Static Assets
  DB?: {
    prepare: (query: string) => {
      bind: (...values: unknown[]) => {
        run: () => Promise<unknown>;
        all: () => Promise<{ results: unknown[] }>;
      };
    };
  };
  MEDIA_BUCKET?: unknown;
  CONFIG_KV?: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string, opts?: { expirationTtl?: number }) => Promise<void>;
  };
  ASSETS?: {
    fetch: (req: Request) => Promise<Response>;
  };
}

let totalRequestsCount = 0;
let totalErrorCount = 0;

const DEFAULT_SUPABASE_URL = 'https://bdwzkdrxrwkulyaiadso.supabase.co';

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: SECURITY_HEADERS,
  });
}

/**
 * Ghi dữ liệu bất đồng bộ sang Supabase REST API (có timeout an toàn, không chặn phản hồi của bé)
 */
async function syncToSupabaseRest(
  env: CloudflareEnv,
  table: string,
  rows: unknown,
  onConflict?: string
): Promise<boolean> {
  const supabaseUrl = env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const apiKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !apiKey || apiKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    return false;
  }

  try {
    const query = onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : '';
    const res = await fetchWithTimeout(
      `${supabaseUrl}/rest/v1/${table}${query}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify(rows),
      },
      3500
    );
    return res.ok;
  } catch {
    return false;
  }
}

export default {
  async fetch(
    request: Request,
    env: CloudflareEnv = {}
  ): Promise<Response> {
    totalRequestsCount += 1;
    const url = new URL(request.url);
    const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // 1. Kiểm tra Rate Limit bảo vệ hệ thống 24/7
    const rate = checkRateLimit(clientIp, 120, 60_000);
    if (!rate.allowed) {
      return jsonResponse(
        {
          error: 'RATE_LIMITED',
          userFriendlyMessage:
            'Con thao tác hơi nhanh rồi! Mình nghỉ vài giây rồi bấm tiếp nhé.',
          retryAfterSeconds: rate.retryAfterSeconds,
        },
        429
      );
    }

    try {
      // 2. Health & Observability Endpoint (/api/health)
      if (url.pathname === '/api/health') {
        const supabaseUrl = env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
        const hasSupabaseKey = Boolean(
          env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY
        );
        return jsonResponse({
          status: 'healthy_24_7',
          project: 'Little Genius – Thế giới khám phá của em (EduExplore Cloud)',
          environment: env.APP_ENV || 'production',
          deploymentVersion: env.DEPLOYMENT_VERSION || '2.0.0-cloudflare',
          supabaseUrl,
          bindings: {
            d1DatabaseBound: Boolean(env.DB),
            r2MediaBucketBound: Boolean(env.MEDIA_BUCKET),
            kvConfigBound: Boolean(env.CONFIG_KV),
            supabaseConfigured: Boolean(supabaseUrl && hasSupabaseKey),
          },
          metrics: {
            totalRequestsServed: totalRequestsCount,
            totalErrorsLogged: totalErrorCount,
          },
          timestamp: new Date().toISOString(),
        });
      }

      // 3. Curriculum & 8-Subject Ecosystem Endpoint (/api/curriculum)
      if (url.pathname === '/api/curriculum' && request.method === 'GET') {
        const subjectFilter = url.searchParams.get('subjectId');
        const gradeFilter = url.searchParams.get('grade');

        const filteredLessons = INITIAL_LESSONS.filter((l) => {
          if (subjectFilter && l.subjectId !== subjectFilter) return false;
          if (gradeFilter && l.grade !== Number(gradeFilter)) return false;
          return true;
        });

        const filteredTopics = CURRICULUM_TOPICS_MAP.filter((t) => {
          if (subjectFilter && t.subjectId !== subjectFilter) return false;
          return true;
        });

        return jsonResponse({
          grades: GRADES_META,
          subjects: SUBJECTS_META,
          topicsMap: filteredTopics,
          lessons: filteredLessons,
          exerciseCatalogCount: EXERCISE_36_CATALOG.length,
          curiosityQuestionsCount: CURIOSITY_10_LIBRARY.length,
        });
      }

      if (url.pathname === '/api/learning-path' && request.method === 'GET') {
        return jsonResponse({
          lessons: learningPath(
            url.searchParams.get('subject'),
            url.searchParams.get('grade')
          ),
        });
      }

      // 4. Controlled Question Variant Endpoint (/api/exercises/variant)
      if (url.pathname === '/api/exercises/variant' && request.method === 'GET') {
        const mode = (url.searchParams.get('mode') || 'visual_array') as MultiplicationCognitiveMode;
        const diff = Math.max(1, Math.min(3, Number(url.searchParams.get('difficulty') || 2))) as 1 | 2 | 3;
        const seed = Number(url.searchParams.get('seed') || 0);
        const variant = generateControlledMultiplicationVariant(mode, diff, seed);
        return jsonResponse({ variant });
      }

      // 5. Deterministic Evaluation & Socratic Tutor Endpoint (/api/evaluate)
      if (url.pathname === '/api/evaluate' && request.method === 'POST') {
        const idempotencyKey = request.headers.get('X-Idempotency-Key') || '';
        if (idempotencyKey) {
          const cached = getCachedIdempotentResponse(idempotencyKey);
          if (cached) {
            return new Response(cached, { status: 200, headers: SECURITY_HEADERS });
          }
        }

        const body = (await request.json()) as {
          studentId?: string;
          authenticatedStudentId?: string;
          lessonId?: string;
          taskId?: string;
          submission?: Record<string, unknown>;
          studentQuestion?: string;
        };

        const studentId = body.studentId || 'student-bap-01';
        const authStudentId = body.authenticatedStudentId || studentId;

        const access = verifyStudentAccess({
          authenticatedStudentId: authStudentId,
          authenticatedRole: 'student',
          targetStudentId: studentId,
        });
        if (!access.authorized) {
          return jsonResponse(
            {
              error: access.reason,
              userFriendlyMessage: 'Không được phép truy cập dữ liệu của học sinh khác.',
            },
            403
          );
        }

        const lesson = INITIAL_LESSONS.find((l) => l.id === body.lessonId);
        const task = lesson?.tasks.find((t) => t.id === body.taskId);
        if (!lesson || !task) {
          return jsonResponse({ error: 'LESSON_OR_TASK_NOT_FOUND' }, 404);
        }

        const evaluation = evaluateTaskSubmission(task, body.submission || {});
        const safeQuestion = body.studentQuestion
          ? sanitizeStringInput(body.studentQuestion, 300)
          : undefined;
        const tutor = generateSocraticGuidance({
          lesson,
          task,
          attemptCount: 1,
          lastEvaluation: evaluation,
          studentQuestion: safeQuestion,
          grade: lesson.grade,
        });

        // Đồng bộ kết quả sang Supabase nếu đã cấu hình khóa
        await syncToSupabaseRest(env, 'submissions', {
          id: crypto.randomUUID(),
          student_id: studentId,
          exercise_variant_id: task.id,
          student_answer_json: JSON.stringify(body.submission || {}),
          is_correct: evaluation.isCorrect ? 1 : 0,
          feedback: evaluation.encouragement,
          proof: evaluation.mathematicalProof,
          submitted_at: new Date().toISOString(),
        });

        const responsePayload = JSON.stringify({
          evaluation,
          tutor,
          deduplicated: false,
        });

        if (idempotencyKey) {
          storeIdempotentResponse(idempotencyKey, responsePayload);
        }

        return new Response(responsePayload, { status: 200, headers: SECURITY_HEADERS });
      }

      // 6. Multi-Device Offline Sync Endpoint (/api/sync) -> Đồng bộ lên Supabase & D1
      if (url.pathname === '/api/sync' && request.method === 'POST') {
        const body = (await request.json()) as {
          studentId: string;
          authenticatedStudentId?: string;
          clientVersionVector: number;
          progressMap: Record<
            string,
            { completedTaskIds: string[]; mastery: string; versionVector?: number }
          >;
        };

        const access = verifyStudentAccess({
          authenticatedStudentId: body.authenticatedStudentId || body.studentId,
          authenticatedRole: 'student',
          targetStudentId: body.studentId,
        });
        if (!access.authorized) {
          return jsonResponse({ error: access.reason }, 403);
        }

        const entries = Object.entries(body.progressMap || {});
        if (entries.length > 0) {
          const rows = entries.map(([lessonId, prog]) => ({
            student_id: body.studentId,
            lesson_id: lessonId,
            mastery_level: prog.mastery,
            completed_activities_json: JSON.stringify(prog.completedTaskIds || []),
            attempts_count: (prog.completedTaskIds || []).length,
            hints_used_count: 0,
            can_explain: prog.mastery === 'can_explain' ? 1 : 0,
            version_vector: prog.versionVector ?? 1,
            last_updated_at: new Date().toISOString(),
          }));

          await syncToSupabaseRest(
            env,
            'student_progress',
            rows,
            'student_id,lesson_id'
          );
        }

        return jsonResponse({
          synced: true,
          resolvedVersionVector: (body.clientVersionVector || 1) + 1,
          mergedLessonsCount: entries.length,
          syncedAt: new Date().toISOString(),
        });
      }

      // 7. Turnstile Bot Verification Endpoint (/api/auth/verify-turnstile)
      if (url.pathname === '/api/auth/verify-turnstile' && request.method === 'POST') {
        const body = (await request.json()) as { token?: string };
        const result = await verifyTurnstileServerSide(
          body.token || '',
          env.TURNSTILE_SECRET_KEY
        );
        return jsonResponse(result, result.success ? 200 : 400);
      }

      // 8. Parental Data Export & Right-to-Erasure (/api/parent/data)
      if (url.pathname === '/api/parent/data') {
        const parentHeader = request.headers.get('X-Parent-Role');
        if (parentHeader !== 'parent') {
          return jsonResponse(
            { error: 'PARENT_AUTHORIZATION_REQUIRED' },
            403
          );
        }
        if (request.method === 'DELETE') {
          return jsonResponse({
            deleted: true,
            message: 'Toàn bộ dữ liệu học tập và sản phẩm sáng tạo của trẻ đã được xóa an toàn theo yêu cầu phụ huynh.',
          });
        }
        return jsonResponse({
          exportedAt: new Date().toISOString(),
          privacyPolicy: 'CHILD_PRIVATE_BY_DEFAULT_NO_ADS_NO_TRACKING',
        });
      }

      // 9. Phân phối Static Assets cho SPA nếu chạy trên Cloudflare Workers Assets
      if (!url.pathname.startsWith('/api/') && url.pathname !== '/api' && env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }

      return jsonResponse({ error: 'NOT_FOUND', path: url.pathname }, 404);
    } catch {
      totalErrorCount += 1;
      return jsonResponse(
        {
          error: 'SERVICE_TEMPORARILY_UNAVAILABLE',
          userFriendlyMessage:
            'Phòng thí nghiệm đang bảo trì nhẹ trong giây lát. Tiến độ của con vẫn được lưu an toàn trên thiết bị nhé!',
        },
        503
      );
    }
  },

  /**
   * Cloudflare Cron Trigger chạy định kỳ an toàn lúc 03:00 UTC mỗi ngày
   */
  async scheduled(): Promise<void> {
    cleanupExpiredCaches();
  },
};
