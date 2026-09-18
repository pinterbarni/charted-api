import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Params } from 'nestjs-pino';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { NamingStrategyInterface } from 'typeorm';
import { Environment } from '../constants/app.constants';
import { DATABASE_CONFIG } from '../constants/database.constants';
import { THROTTLER_CONFIG } from '../constants/throttler.constants';
import { SnakeNamingStrategy } from '../database/strategies/snake-naming.strategy';
import { AppConfig } from './types/app.types';

/**
 * Returns TypeORM PostgreSQL connection configuration. Sync-ing and logging are env-aware.
 * @returns TypeORM module options
 * @param config NestJS ConfigService for reading env vars
 */
export const typeOrmConfig = (config: ConfigService<AppConfig>): TypeOrmModuleOptions => ({
  type: 'postgres',
  username: config.get('DB_USER', { infer: true }),
  password: config.get('DB_PASSWORD', { infer: true }),
  database: config.get('DB_NAME', { infer: true }),
  host: config.get('DB_HOST', { infer: true }),
  port: config.get('DB_PORT', { infer: true }),

  entities: [__dirname + '/../' + DATABASE_CONFIG.ENTITIES_GLOB],
  synchronize: process.env.NODE_ENV === Environment.DEVELOPMENT || process.env.DB_SYNCHRONIZE === 'true',
  namingStrategy: new SnakeNamingStrategy() as NamingStrategyInterface,

  retryAttempts: DATABASE_CONFIG.RETRY_ATTEMPTS,
  retryDelay: DATABASE_CONFIG.RETRY_DELAY_MS,

  logging: process.env.NODE_ENV !== Environment.PRODUCTION,
});

/**
 * Pino logger configuration. pino-pretty in development, raw JSON in staging prod.
 * @returns nestjs-pino LoggerModule params
 */
export const pinoConfig = (): Params => ({
  pinoHttp: {
    transport: process.env.NODE_ENV === Environment.DEVELOPMENT ? { target: 'pino-pretty' } : undefined,
    level: process.env.NODE_ENV === Environment.DEVELOPMENT ? 'debug' : 'info',
  },
});

/**
 * Returns throttler rate limiting config.
 * THROTTLER_CONFIG.LIMIT amount of requests per minute per ip-addr.
 * @returns Throttler options in array
 */
export const throttlerConfig = () => [
  {
    ttl: THROTTLER_CONFIG.TTL_MS,
    limit: THROTTLER_CONFIG.LIMIT,
  },
];

/**
 * Global JWT auth-guard provider, all routes - applied to automatically. @Public()-deco bypasses it.
 */
export const globalAuthGuard = {
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
};
