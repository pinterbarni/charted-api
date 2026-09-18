import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrailsLikesService } from '../services/trails-likes.service';
import { TrailsService } from '../services/trails.service';

/**
 * public trail discovery endpoints, returns globally shared and most liked trails on all users.
 * These are public discovery feeds, no user scoping happens here! - by design
 */
@ApiTags('trails')
@ApiBearerAuth()
@Controller('trails')
export class TrailsSharedController {
  constructor(
    private readonly trailsService: TrailsService,
    private readonly likesService: TrailsLikesService
  ) {}

  /** Returns x most recently shared trails globally. */
  @ApiOperation({ summary: 'Get x most recently shared trails globally' })
  @ApiResponse({ status: 200, description: 'Recently shared trails arrived' })
  @Get('shared/recent')
  async getRecentSharedTrails() {
    return this.trailsService.getRecentSharedTrails();
  }

  /**
   * Returns x most liked trails globally.
   * todo: implement in v2.
   */
  @ApiOperation({ summary: 'Get x most liked trails globally' })
  @ApiResponse({ status: 200, description: 'Most liked trails arrived' })
  @Get('shared/popular')
  async getMostLikedTrails() {
    const ids = await this.likesService.getMostLikedTrailIds();

    return this.trailsService.getTrailsByIds(ids);
  }
}
