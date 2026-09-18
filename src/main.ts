import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AppConfig } from './config/types/app.types';
import { APP_CONFIG, SWAGGER_CONFIG } from './constants/app.constants';

/**
 * Initializes NestJS application, configs global middleware, sets up Swagger docs and starts http server.
 * # Bootstrap order:
 * 1. Create NestJS app
 * 2. Configure Swagger UI
 * 3. Apply global logger
 * 4. Apply security middleware (helmet)
 * 5. Set global API prefix
 * 6. Enable CORS
 * 7. Start HTTP server
 */
async function bootstrap() {
  /** Create NestJS app with bufferLogs enabled for pino. */
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  /**
   * Configure Swagger UI docs, available at /api/docs in all envs.
   * Bearer auth is enabled, paste Keycloak access t. to authenticate.
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.TITLE)
    .setDescription(SWAGGER_CONFIG.DESCRIPTION)
    .setVersion(SWAGGER_CONFIG.VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(APP_CONFIG.SWAGGER_PATH, app, document);

  /** Replaced here default NestJS logger with structured Pino logger. */
  app.useLogger(app.get(Logger));

  /**
   * Apply Helmet security middleware! Was Easy to set up.
   */
  app.use(helmet());

  /** Prefix all routes with /api, e.g. /api/profile/me, /api/trails. ... */
  app.setGlobalPrefix(APP_CONFIG.GLOBAL_PREFIX);

  /**
   * Enable CORS for all origins.
   * todo: Restrict to specific origins in prod via environment config in v2.
   */
  app.enableCors();

  /** Read PORT from env, which falls back to set default if not set. */
  const configService = app.get(ConfigService<AppConfig>);

  const port = configService.get('PORT', { infer: true }) ?? APP_CONFIG.DEFAULT_PORT;

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
