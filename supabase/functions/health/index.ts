// ============================================================================
// Little Genius (EduExplore) – Supabase Edge Function: /api/health
// Kiểm tra trạng thái hệ thống, phiên bản & kết nối Supabase
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("VITE_SUPABASE_ANON_KEY") ?? "";

    let dbConnected = false;
    let dbError = "";

    if (supabaseUrl && supabaseAnonKey) {
      const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase.from("system_config").select("key").limit(1);
      if (!error) {
        dbConnected = true;
      } else {
        dbError = error.message;
      }
    }

    return new Response(
      JSON.stringify({
        status: "healthy_24_7",
        project: "Little Genius – Thế giới khám phá của em (EduExplore Supabase)",
        environment: Deno.env.get("APP_ENV") || "production",
        deploymentVersion: Deno.env.get("DEPLOYMENT_VERSION") || "2.0.0-supabase",
        bindings: {
          supabaseDatabaseConnected: dbConnected,
        },
        dbError,
        metrics: {
          timestamp: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "unhealthy",
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});