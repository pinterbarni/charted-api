import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesController } from './controllers/routes.controller';
import { PlannedRouteEntity } from './entities/planned-route.entity';
import { RoutesService } from './services/routes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlannedRouteEntity]), ConfigModule],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
