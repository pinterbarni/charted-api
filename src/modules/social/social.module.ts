import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../profile/entities/user.entity';
import { SocialBlockController } from './controllers/social-block.controller';
import { SocialFollowController } from './controllers/social-follow.controller';
import { SocialProfileController } from './controllers/social-profile.controller';
import { BlockEntity } from './entities/block.entity';
import { FollowEntity } from './entities/follow.entity';
import { SocialBlockService } from './services/social-block.service';
import { SocialFollowService } from './services/social-follow.service';

@Module({
  imports: [TypeOrmModule.forFeature([FollowEntity, BlockEntity, UserEntity])],
  controllers: [SocialBlockController, SocialFollowController, SocialProfileController],
  providers: [SocialBlockService, SocialFollowService],
  exports: [SocialBlockService],
})
export class SocialModule {}
