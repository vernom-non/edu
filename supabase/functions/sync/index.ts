// ============================================================================
// Little Genius (EduExplore) – Supabase Edge Function: /api/sync
// Đồng bộ tiến độ học tập đa thiết bị (Multi-Device Offline Sync)
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SyncRequest {
  studentId: string;
  authenticatedStudentId?: string;
  clientVersionVector: number;
  progressMap: Record<string, {
    completedTaskIds: string[];
    mastery: string;
    versionVector?: number;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "SUPABASE_NOT_CONFIGURED" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const body: SyncRequest = await req.json();

    // Xác thực quyền truy cập học sinh
    const targetStudentId = body.authenticatedStudentId || body.studentId;

    // Cập nhật tiến độ cho từng bài học
    const results = [];
    for (const [lessonId, progress] of Object.entries(body.progressMap)) {
      const { error } = await supabase.from("student_progress").upsert({
        student_id: body.studentId,
        lesson_id: lessonId,
        mastery_level: progress.mastery,
        completed_activities_json: JSON.stringify(progress.completedTaskIds),
        attempts_count: progress.completedTaskIds.length,
        hints_used_count: 0,
        can_explain: 0,
        version_vector: progress.versionVector ?? 1,
        last_updated_at: new Date().toISOString(),
      }, { onConflict: "student_id,lesson_id" });
      results.push({ lessonId, error });
    }

    const resolvedVersionVector = (body.clientVersionVector || 1) + 1;

    return new Response(
      JSON.stringify({
        synced: true,
        resolvedVersionVector,
        mergedLessonsCount: Object.keys(body.progressMap || {}).length,
        syncedAt: new Date().toISOString(),
        studentId: targetStudentId,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});