// ============================================================================
// Little Genius (EduExplore) – Supabase Client Singleton
// Kết nối Supabase PostgreSQL từ frontend (Vite + React)
// ============================================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY chưa được cấu hình. '
    'Hãy copy .env.example sang .env và điền thông tin từ Supabase Dashboard.',
  );
}

// Singleton client để tránh tạo nhiều instance trên React StrictMode
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
  }
  return supabaseClient;
}

export const supabase = getSupabaseClient();

// Helper: Kiểm tra kết nối Supabase
export async function checkSupabaseHealth(): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('system_config').select('key').limit(1);
    return { ok: !error, error: error?.message };
  } catch (err: unknown) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Supabase error',
    };
  }
}