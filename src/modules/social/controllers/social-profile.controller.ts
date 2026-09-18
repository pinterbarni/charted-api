import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { JwtUser } from 'src/common/decorators/types/decorator.types';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { SocialFollowService } from '../services/social-follow.service';

/**
 * Public user profile retrieval. Returns NotFoundException for blocked users; block status is never revealed.
 */
@ApiTags('social')
@ApiBearerAuth()
@Controller('social')
export class SocialProfileController {
  constructor(private readonly followService: SocialFollowService) {}

  /** Returns user's public profile, or 404 if user is blocked. */
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({ name: 'userId', description: 'User id' })
  @ApiResponse({ status: 404, description: 'User not found OR blocked' })
  @ApiResponse({ status: 200, description: 'Profile returned' })
  @Get('profile/:userId')
  async getProfile(@CurrentUser() user: JwtUser, @Param('userId') userId: string) {
    return this.followService.getProfile(user.sub, userId);
  }
}
