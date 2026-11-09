// ============================================================================
// Little Genius (EduExplore) – Server-Side Child Security, Rate Limiting,
// Idempotency, Turnstile Verification & Resilient Retry Utilities
// Tương thích 100% với Cloudflare Workers Runtime (Web Standard APIs)
// ============================================================================

const rateLimitWindowMap = new Map<string, { count: number; resetAt: number }>();
const idempotencyMemoryCache = new Map<string, { status: number; responseJson: string; expiresAt: number }>();

export const SECURITY_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), geolocation=(), payment=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none';",
};

/**
 * Rate Limiting chống lạm dụng API / bot (mặc định 60 requests / phút / client)
 */
export function checkRateLimit(
  clientKey: string,
  maxRequests = 60,
  windowMs = 60_000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const current = rateLimitWindowMap.get(clientKey);

  if (!current || now >= current.resetAt) {
    rateLimitWindowMap.set(clientKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Kiểm tra quyền truy cập dữ liệu theo từng học sinh (Chống IDOR - Insecure Direct Object Reference)
 * Trẻ hoặc phụ huynh chỉ được phép đọc/ghi đúng hồ sơ studentId đã được cấp trong phiên
 */
export function verifyStudentAccess(params: {
  authenticatedStudentId: string;
  authenticatedRole: 'student' | 'parent' | 'teacher' | 'admin';
  targetStudentId: string;
}): { authorized: boolean; reason?: string } {
  const { authenticatedStudentId, authenticatedRole, targetStudentId } = params;

  if (!authenticatedStudentId || !targetStudentId) {
    return { authorized: false, reason: 'MISSING_STUDENT_IDENTITY' };
  }

  if (authenticatedRole === 'admin') {
    return { authorized: true };
  }

  if (authenticatedStudentId !== targetStudentId) {
    return {
      authorized: false,
      reason: 'CROSS_STUDENT_ACCESS_FORBIDDEN',
    };
  }

  return { authorized: true };
}

/**
 * Làm sạch chuỗi đầu vào chống XSS và loại bỏ thẻ script/HTML nguy hiểm
 */
export function sanitizeStringInput(input: string, maxLength = 500): string {
  return input
    .slice(0, maxLength)
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/[<>]/g, (ch) => (ch === '<' ? '&lt;' : '&gt;'))
    .trim();
}

/**
 * Chống ghi trùng dữ liệu (Idempotency Key Deduplication)
 */
export function getCachedIdempotentResponse(key: string): string | null {
  const entry = idempotencyMemoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    idempotencyMemoryCache.delete(key);
    return null;
  }
  return entry.responseJson;
}

export function storeIdempotentResponse(
  key: string,
  responseJson: string,
  ttlMs = 300_000
): void {
  idempotencyMemoryCache.set(key, {
    status: 200,
    responseJson,
    expiresAt: Date.now() + ttlMs,
  });
}

export function cleanupExpiredCaches(): { clearedRateKeys: number; clearedIdempotencyKeys: number } {
  const now = Date.now();
  let clearedRateKeys = 0;
  let clearedIdempotencyKeys = 0;

  for (const [k, v] of rateLimitWindowMap.entries()) {
    if (now >= v.resetAt) {
      rateLimitWindowMap.delete(k);
      clearedRateKeys += 1;
    }
  }
  for (const [k, v] of idempotencyMemoryCache.entries()) {
    if (now >= v.expiresAt) {
      idempotencyMemoryCache.delete(k);
      clearedIdempotencyKeys += 1;
    }
  }
  return { clearedRateKeys, clearedIdempotencyKeys };
}

/**
 * Giới hạn thời gian (Timeout) cho các lời gọi API bên ngoài để không treo Worker
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 4000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Retry với Exponential Backoff chỉ dành cho các tác vụ an toàn để thử lại (Idempotent)
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 2,
  baseDelayMs = 80
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
      attempt += 1;
    }
  }
}

/**
 * Xác minh Cloudflare Turnstile phía Server ở các điểm đăng nhập / gửi form quan trọng
 */
export async function verifyTurnstileServerSide(
  token: string,
  secretKey?: string
): Promise<{ success: boolean; mode: 'verified_remote' | 'dev_fallback' }> {
  if (!token || token === 'invalid_bot_token') {
    return { success: false, mode: 'dev_fallback' };
  }
  if (!secretKey) {
    return { success: true, mode: 'dev_fallback' };
  }
  const res = await fetchWithTimeout(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secretKey, response: token }),
    },
    3500
  );
  const data = (await res.json()) as { success?: boolean };
  return { success: Boolean(data.success), mode: 'verified_remote' };
}
