/**
 * TypeORM bd connection conf const, applied when db temporarily unavailable on startup, (happened before ) - BFF and PostgreSQL starts simultaneously in Docker Compose.
 */
export const DATABASE_CONFIG = {
  /** no of retry attempts before giving up. */
  RETRY_ATTEMPTS: 5,
  /** Delay bw  retry attempts in ms. */
  RETRY_DELAY_MS: 3_000,
  /** entity glob pattern picks up all entity files in project. */
  ENTITIES_GLOB: '/**/*.entity{.ts,.js}',
} as const;
