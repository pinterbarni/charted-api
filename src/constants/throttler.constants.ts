/** Rate limiting conf.  applied globally per IPaddr. */
export const THROTTLER_CONFIG = {
  TTL_MS: 60_000,
  LIMIT: 100,
} as const;
