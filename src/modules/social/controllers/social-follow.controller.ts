import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { JwtUser } from 'src/common/decorators/types/decorator.types';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { SocialFollowService } from '../services/social-follow.service';

/**
 * Handles (un)follow ops and follower/ing list retrieval. All list endpoints filter out users blocked by  or (blocking) requester.
 */
@ApiTags('social')
@ApiBearerAuth()
@Controller('social')
export class SocialFollowController {
  constructor(private readonly followService: SocialFollowService) {}

  /** Follows user on behalf of authed user. */
  @ApiOperation({ summary: 'Follow user' })
  @ApiParam({ name: 'userId', description: 'User UUID to follow' })
  @ApiResponse({ status: 409, description: 'Already following' })
  @ApiResponse({ status: 404, description: 'User not found or blocked' })
  @ApiResponse({ status: 201, description: 'User followed' })
  @Post('follow/:userId')
  async followUser(@CurrentUser() user: JwtUser, @Param('userId') userId: string) {
    return this.followService.followUser(user.sub, userId);
  }

  /** Unfollows user on behalf of authed user. */
  @ApiOperation({ summary: 'Get followers of user' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Followers returned' })
  @Get(':userId/followers')
  async getFollowers(@CurrentUser() user: JwtUser, @Param('userId') userId: string) {
    return this.followService.getFollowers(user.sub, userId);
  }

  /** Unfollows user on behalf of authed user. */
  @ApiOperation({ summary: 'Unfollow user' })
  @ApiParam({ name: 'userId', description: 'User UUID to unfollow' })
  @ApiResponse({ status: 204, description: 'User unfollowed' })
  @ApiResponse({ status: 404, description: 'Not following this user' })
  @Delete('follow/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollowUser(@CurrentUser() user: JwtUser, @Param('userId') userId: string) {
    await this.followService.unfollowUser(user.sub, userId);
  }

  /** Returns all users that given user is following, filtered by block relationships. */
  @ApiOperation({ summary: 'Get users that user is following' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Following returned' })
  @Get(':userId/following')
  async getFollowing(@CurrentUser() user: JwtUser, @Param('userId') userId: string) {
    return this.followService.getFollowing(user.sub, userId);
  }
}
