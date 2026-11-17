/// <reference types="vite/client" />
// ============================================================================
// Little Genius (EduExplore) – Supabase & Cloudflare 24/7 Cloud Sync Client
// Kết nối Supabase PostgreSQL (https://bdwzkdrxrwkulyaiadso.supabase.co)
// và Cloudflare Worker API (/api/sync, /api/health) với chế độ Offline-First
// ============================================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { StudentProfile } from '../types/education.ts';

export const DEFAULT_SUPABASE_URL = 'https://bdwzkdrxrwkulyaiadso.supabase.co';

const envObj =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : ({} as Record<string, string | undefined>);

const supabaseUrl = envObj.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = envObj.VITE_SUPABASE_ANON_KEY || '';

const isRealAnonKey =
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE' &&
  supabaseAnonKey !== 'bdwzkdrxrwkulyaiadso' &&
  supabaseAnonKey.length > 20;

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isRealAnonKey) {
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return supabaseClient;
}

export const supabase = getSupabaseClient();

/**
 * Kiểm tra trạng thái kết nối 24/7 tới Supabase và Cloudflare Worker
 */
export async function checkSupabaseHealth(): Promise<{
  ok: boolean;
  source: 'supabase_direct' | 'cloudflare_worker' | 'offline_local';
  error?: string;
}> {
  try {
    if (supabase) {
      const { error } = await supabase
        .from('system_config')
        .select('key')
        .limit(1);
      if (!error) {
        return { ok: true, source: 'supabase_direct' };
      }
    }

    if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
      const res = await fetch('/api/health');
      if (res.ok) {
        return { ok: true, source: 'cloudflare_worker' };
      }
    }

    return { ok: true, source: 'offline_local' };
  } catch (err: unknown) {
    return {
      ok: false,
      source: 'offline_local',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Đồng bộ hồ sơ & tiến độ học tập của bé lên Supabase + Cloudflare Worker 24/7
 * Không bao giờ làm gián đoạn trải nghiệm học tập nếu mất mạng tạm thời
 */
export async function syncStudentProfile24x7(
  profile: StudentProfile
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Đồng bộ qua Cloudflare Worker (/api/sync -> Supabase REST / D1)
    const workerRes = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: profile.id,
        authenticatedStudentId: profile.id,
        clientVersionVector: Object.keys(profile.progressMap || {}).length + 1,
        progressMap: profile.progressMap || {},
      }),
    }).catch(() => null);

    // 2. Nếu trình duyệt có cấu hình trực tiếp Supabase Anon Key, đồng bộ trực tiếp bảng student_progress & creative_projects
    if (supabase) {
      const progressEntries = Object.entries(profile.progressMap || {});
      if (progressEntries.length > 0) {
        const rows = progressEntries.map(([lessonId, rec]) => ({
          student_id: profile.id,
          lesson_id: lessonId,
          mastery_level: rec.mastery,
          completed_activities_json: JSON.stringify(rec.completedTaskIds || []),
          attempts_count: rec.attemptsCount || 1,
          hints_used_count: rec.hintsUsedCount || 0,
          can_explain: rec.canExplainVerified ? 1 : 0,
          version_vector: rec.versionVector ?? 1,
          last_updated_at: rec.lastUpdated || new Date().toISOString(),
        }));
        await supabase
          .from('student_progress')
          .upsert(rows, { onConflict: 'student_id,lesson_id' });
      }

      const projectEntries = Object.values(profile.creativeProjects || {});
      if (projectEntries.length > 0) {
        const projRows = projectEntries.map((proj) => ({
          id: `${profile.id}_${proj.projectCode}`,
          student_id: profile.id,
          project_code: proj.projectCode,
          title: proj.title,
          status: proj.status,
          artifact_data_json: JSON.stringify(proj.data || {}),
          reflection_journal: proj.journal || '',
          is_private: 1,
          updated_at: proj.updatedAt || new Date().toISOString(),
        }));
        await supabase
          .from('creative_projects')
          .upsert(projRows, { onConflict: 'student_id,project_code' });
      }
    }

    return Boolean(workerRes?.ok || supabase);
  } catch {
    return false;
  }
}
