type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitState = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitState>();

export function rateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: existing.resetAt - now };
  }

  existing.count += 1;
  store.set(key, existing);
  return { allowed: true, remaining: limit - existing.count };
}
