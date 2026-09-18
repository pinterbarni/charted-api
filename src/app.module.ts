import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { validateConfig } from './config/app.config';
import { globalAuthGuard, pinoConfig, throttlerConfig, typeOrmConfig } from './config/module-configs';
import { Environment } from './constants/app.constants';
import { HealthModule } from './modules/health/health.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RoutesModule } from './modules/routes/routes.module';
import { RoutingModule } from './modules/routing/routing.module';
import { SocialModule } from './modules/social/social.module';
import { TilesModule } from './modules/tiles/tiles.module';
import { TrailsModule } from './modules/trails/trails.module';

/**
 * Root NestJS module. Registers all feature modules and global infrastructure.
 *
 * # Global:
 * - ConfigModule: loads & validates envvars (must be first)
 * - JwtModule: provides JWT sign/verify globally
 * - ThrottlerModule: rate limiting (f.ex.: 100 req/m per Ip addr)
 * - LoggerModule: json logging via Pino - structured
 * - TypeOrmModule: PostgreSQL connection with TypeORM
 * - APP_GUARD: applies JwtAuthGuard globally to all routes
 *
 * # Feature modules:
 * - HealthModule: public health check endpoint // entry level
 * - TilesModule: Martin tile server proxy
 * - RoutingModule: Valhalla routing proxy // check it
 * - RoutesModule: planned route mng.mnt
 * - ProfileModule: user profile and avatar management
 * - TrailsModule: trail tracking and discovery
 * - SocialModule: follow, block and social features
 * - ReportsModule: user and trail reporting
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? Environment.DEVELOPMENT}`,
      validate: validateConfig,
    }),
    JwtModule.register({ global: true }),
    ThrottlerModule.forRoot(throttlerConfig()),
    LoggerModule.forRoot(pinoConfig()),
    HealthModule,
    TilesModule,
    RoutingModule,
    RoutesModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ProfileModule,
    TrailsModule,
    SocialModule,
    ReportsModule,
  ],
  providers: [globalAuthGuard],
})
export class AppModule {}
