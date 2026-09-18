import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../profile/entities/user.entity';
import { SocialModule } from '../social/social.module';
import { TrailsLikesController } from './controllers/trails-likes.controller';
import { TrailsSharedController } from './controllers/trails-shared.controller';
import { TrailsController } from './controllers/trails.controller';
import { TrailLikeEntity } from './entities/trail-like.entity';
import { TrailEntity } from './entities/trail.entity';
import { TrailsLikesService } from './services/trails-likes.service';
import { TrailsService } from './services/trails.service';

/**
 *  manages all trail-related functionality, creation, sharing & likes.
 * Imports SocialModule to access SocialBlockService -- used for for filtering blocked users from shared trail discovery.
 */
@Module({
  imports: [TypeOrmModule.forFeature([TrailEntity, TrailLikeEntity, UserEntity]), SocialModule],
  controllers: [TrailsController, TrailsLikesController, TrailsSharedController],
  providers: [TrailsService, TrailsLikesService],
})
export class TrailsModule {}
