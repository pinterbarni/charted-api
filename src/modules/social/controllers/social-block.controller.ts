import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { JwtUser } from 'src/common/decorators/types/decorator.types';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { SocialBlockService } from '../services/social-block.service';

/**
 * Handles **blocking** and **unblocking** users.
 * - **Blocking** removes all follow relationships between two users in both directions.
 * - **Blocked** users receive generic not found responses, block status is never revealed.
 */
@ApiTags('social')
@ApiBearerAuth()
@Controller('social')
export class SocialBlockController {
  constructor(private readonly blockService: SocialBlockService) {}

  /** Blocks user and removes all follow relationships in both directions. */
  @ApiOperation({ summary: 'Block user' })
  @ApiParam({ name: 'userId', description: 'User to block' })
  @ApiResponse({ status: 409, description: 'Already blocked' })
  @ApiResponse({ status: 201, description: 'User blocked' })
  @Post('block/:userId')
  async blockUser(@CurrentUser() user: JwtUser, @Param('userId') userId: string) {
    return this.blockService.blockUser(user.sub, userId);
  }

  /** Unblocks prev block d user. */
  @ApiOperation({ summary: 'Unblock user' })
  @ApiParam({ name: 'userId', description: 'User to unblock' })
  @ApiResponse({ status: 204, description: 'User unblocked' })
  @ApiResponse({ status: 404, description: 'User not blocked' })
  @Delete('block/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unblockUser(@CurrentUser() user: JwtUser, @Param('userId') userId: string) {
    await this.blockService.unblockUser(user.sub, userId);
  }

  /** Returns all users blocked by authenticated user. */
  @ApiOperation({ summary: 'Get blocked users' })
  @ApiResponse({ status: 200, description: 'Blocked users returned' })
  @Get('blocked')
  async getBlockedUsers(@CurrentUser() user: JwtUser) {
    return this.blockService.getBlockedUsers(user.sub);
  }
}
