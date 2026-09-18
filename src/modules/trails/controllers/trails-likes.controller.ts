import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { JwtUser } from 'src/common/decorators/types/decorator.types';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { TrailsLikesService } from '../services/trails-likes.service';

/**
 * Handles trail like/unlike (note: not dislike!) ops and like count retrieval, all endpoints are scoped to logged-in user via jwt.
 */
@ApiTags('trails')
@ApiBearerAuth()
@Controller('trails')
export class TrailsLikesController {
  constructor(private readonly likesService: TrailsLikesService) {}

  /** Likes trail as logged-in user. */
  @ApiOperation({ summary: 'Like trail' })
  @ApiParam({ name: 'id', description: 'Trail id' })
  @ApiResponse({ status: 201, description: 'Trail liked' })
  @ApiResponse({ status: 409, description: 'Already liked - error.' })
  @Post(':id/like')
  async likeTrail(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.likesService.likeTrail(user.sub, id);
  }

  /** Removes like from trail as logged-in user. */
  @ApiOperation({ summary: 'Unlike trail' })
  @ApiParam({ name: 'id', description: 'Trail id' })
  @ApiResponse({ status: 204, description: 'Trail unliked' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  @Delete(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlikeTrail(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    await this.likesService.unlikeTrail(user.sub, id);
  }

  /**
   * Returns total like count for trail.
   * todo: implement in v2 fe.
   */
  @ApiOperation({ summary: 'Get like count for oen trail' })
  @ApiParam({ name: 'id', description: 'Trail id' })
  @ApiResponse({ status: 200, description: 'Like count caught' })
  @Get(':id/likes')
  async getLikeCount(@Param('id') id: string) {
    return { count: await this.likesService.getLikeCount(id) };
  }
}
