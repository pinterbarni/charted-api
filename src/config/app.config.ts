import { AppConfig } from './types/app.types';

/**
 * Validates env vars on startup.
 * Error if any required variable is missing. App cant start in misconfigured state thanks to this.
 * @param config Raw env variables from process.env
 * @throws {Error} If any required environment var missing
 * @returns Typed and validated AppConfig object
 */
export function validateConfig(config: Record<string, unknown>): AppConfig {
  const required = [
    'KEYCLOAK_URL',
    'KEYCLOAK_JWKS_URI',
    'MARTIN_URL',
    'MARTIN_API_KEY',
    'VALHALLA_URL',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
  ];

  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing req env var: ${key}`);
    }
  }

  return {
    PORT: Number(config.PORT) || 3000,
    DB_PORT: Number(config.DB_PORT) || 5432,

    NODE_ENV: (config.NODE_ENV as AppConfig['NODE_ENV']) ?? 'development',

    KEYCLOAK_URL: config.KEYCLOAK_URL as string,
    KEYCLOAK_JWKS_URI: config.KEYCLOAK_JWKS_URI as string,

    MARTIN_URL: config.MARTIN_URL as string,
    MARTIN_API_KEY: config.MARTIN_API_KEY as string,

    VALHALLA_URL: config.VALHALLA_URL as string,

    DB_NAME: config.DB_NAME as string,
    DB_USER: config.DB_USER as string,
    DB_PASSWORD: config.DB_PASSWORD as string,
    DB_HOST: config.DB_HOST as string,
  };
}
