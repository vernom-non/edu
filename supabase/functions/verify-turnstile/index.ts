// ============================================================================
// Little Genius (EduExplore) – Supabase Edge Function: /api/auth/verify-turnstile
// Xác thực Turnstile token từ Cloudflare (chống bot)
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface VerifyTurnstileRequest {
  token?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const turnstileSecretKey = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";

    const body: VerifyTurnstileRequest = await req.json();

    if (!turnstileSecretKey) {
      // Nếu chưa cấu hình Turnstile, cho phép pass (development mode)
      return new Response(
        JSON.stringify({
          success: true,
          message: "Turnstile not configured (development mode)",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.token) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing Turnstile token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Gọi Cloudflare Turnstile verify API
    const formData = new FormData();
    formData.append("secret", turnstileSecretKey);
    formData.append("response", body.token);

    const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const result = await verifyResponse.json();

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});