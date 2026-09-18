/**
 *Interface for all env vars used by app.
 * Loaded and validated by ConfigModule on startup via validateConfig.
 * Also we can access values anywhere via ConfigService<AppConfig>.
 */
export interface AppConfig {
  /** App env controlling logging, sync and other env-aware behavior. */
  NODE_ENV: 'development' | 'staging' | 'production';

  /** HTTP port server listens on. Defaults to 3000. */
  PORT: number;
  /** PostgreSQL port. Has defaulting logic set */
  DB_PORT: number;

  /** Kc realm base URL. */
  KEYCLOAK_URL: string;
  /** Kc JWKS endpoint - fetches pub keys for JWT verification. */
  KEYCLOAK_JWKS_URI: string;

  /** Martin tile server base URL on Vesta. */
  MARTIN_URL: string;
  /** Martin tile server API key injected server-side which is never exposed to client. */
  MARTIN_API_KEY: string;

  /** Valhalla routing engine on prod env. */
  VALHALLA_URL: string;

  /** PostgreSQL host. */
  DB_HOST: string;
  /** PostgreSQL uname. */
  DB_USER: string;
  /** PostgreSQL pw. */
  DB_PASSWORD: string;
  /** PostgreSQL db name. */
  DB_NAME: string;
}
