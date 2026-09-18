import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { JwtUser } from 'src/common/decorators/types/decorator.types';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CreateTrailDto } from '../dto/create-trail.dto';
import { UpdateTrailDto } from '../dto/update-trail.dto';
import { TrailsService } from '../services/trails.service';

/**
 * Trail CRUD operations on logged in usr, includes personal trail management and public trail discovery endpoints.
 * Likes and shared trail discovery are handled by separate controllers.
 */
@ApiTags('trails')
@ApiBearerAuth()
@Controller('trails')
export class TrailsController {
  constructor(private readonly trailsService: TrailsService) {}

  /** Creates new trail for logged in usr. */
  @ApiOperation({ summary: 'Create trail' })
  @ApiResponse({ status: 201, description: 'Trail created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async createTrail(@CurrentUser() user: JwtUser, @Body() dto: CreateTrailDto) {
    return this.trailsService.createTrail(user.sub, {
      ...dto,
      startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
      finishedAt: dto.finishedAt ? new Date(dto.finishedAt) : undefined,
    });
  }

  /** Returns all trails belonging to logged in Usr. */
  @ApiOperation({ summary: 'Get all trails / mine' })
  @ApiResponse({ status: 200, description: 'Trails returned' })
  @Get('me')
  async getMyTrails(@CurrentUser() user: JwtUser) {
    return this.trailsService.getMyTrails(user.sub);
  }

  @ApiOperation({ summary: 'Get shared trails of user' })
  @ApiParam({ name: 'userId', description: 'User id' })
  @ApiResponse({ status: 200, description: 'Shared trails returned' })
  @Get('user/:userId')
  async getUserTrails(@Param('userId') userId: string) {
    return this.trailsService.getSharedTrails(userId);
  }

  /** Returns single trail by ID scoped to logged in usr. */
  @ApiOperation({ summary: 'Get trail by iD' })
  @ApiParam({ name: 'id', description: 'Trail' })
  @ApiResponse({ status: 200, description: 'Trail returned ok' })
  @ApiResponse({ status: 404, description: 'Trail not found' })
  @Get(':id')
  async getTrail(/* @CurrentUser() user: JwtUser,*/ @Param('id') id: string) {
    return this.trailsService.getTrail(id /*, user.sub*/);
  }

  /** Updates allowed fields of trail scoped to logged in ussr. */
  @ApiOperation({ summary: 'Update trail' })
  @ApiParam({ name: 'id', description: 'Trail UUID' })
  @ApiResponse({ status: 200, description: 'Trail updated' })
  @ApiResponse({ status: 404, description: 'Trail not found' })
  @Patch(':id')
  async updateTrail(@CurrentUser() user: JwtUser, @Param('id') id: string, @Body() dto: UpdateTrailDto) {
    return this.trailsService.updateTrail(id, user.sub, dto);
  }

  /** Deletes trail scoped to logged in usr. */
  @ApiOperation({ summary: 'Delete trail' })
  @ApiParam({ name: 'id', description: 'Trail UUID' })
  @ApiResponse({ status: 204, description: 'Trail deleted' })
  @ApiResponse({ status: 404, description: 'Trail not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrail(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    await this.trailsService.deleteTrail(id, user.sub);
  }

  /** Returns 5 most recently created trails for logged in user. */
  @ApiOperation({ summary: 'Get 5 most recent trails' })
  @ApiResponse({ status: 200, description: 'Recent trails returned ok' })
  @Get('me/recent')
  async getRecentTrails(@CurrentUser() user: JwtUser) {
    return this.trailsService.getRecentTrails(user.sub);
  }
}
