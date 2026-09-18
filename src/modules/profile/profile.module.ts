import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialModule } from '../social/social.module';
import { AvatarController } from './controllers/avatar.controller';
import { ProfileController } from './controllers/profile.controller';
import { UserAvatarEntity } from './entities/user-avatar.entity';
import { UserEntity } from './entities/user.entity';
import { AvatarService } from './services/avatar.service';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserAvatarEntity]), SocialModule],
  controllers: [ProfileController, AvatarController],
  providers: [ProfileService, AvatarService],
})
export class ProfileModule {}
