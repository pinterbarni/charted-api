/** Global app config metadata */
export const APP_CONFIG = {
  /** Global API prefix !!! applied to all routes. */
  GLOBAL_PREFIX: 'api',
  /** Swagger UI path. */
  SWAGGER_PATH: 'api/docs',
  /** Default port  // if PORT env var is not set. */
  DEFAULT_PORT: 3000,
} as const;

/** Swagger UI docs data */
export const SWAGGER_CONFIG = {
  TITLE: 'Charted API',
  DESCRIPTION: 'Charted hiking app BFF',
  VERSION: '1.0',
} as const;

/** Application env names. */
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}
