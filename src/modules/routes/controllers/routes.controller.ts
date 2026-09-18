import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import type { JwtUser } from 'src/common/decorators/types/decorator.types';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AppConfig } from '../../../config/types/app.types';
import { PlanRouteDto } from '../dto/plan-route.dto';
import { RoutesService } from '../services/routes.service';

/**
 * Handles planned route mgmt. Calls Valhalla for route calculation and persists full response as JSONB.
 * Routes are scoped to authenticated user.
 */
@ApiTags('routes')
@ApiBearerAuth()
@Controller('routes')
export class RoutesController {
  /** Base URL of Valhalla routing engine on Vesta. */
  private readonly valhallaUrl: string;

  /**
   * @param routesService srv c for planned route persistence
   * @param configService nestJS config service for reading env vars
   */
  constructor(
    private readonly routesService: RoutesService,
    private readonly configService: ConfigService<AppConfig>
  ) {
    this.valhallaUrl = this.configService.get('VALHALLA_URL', { infer: true })!;
  }

  /** Plans route via Valhalla and saves full response for later retrieval. */
  @ApiOperation({ summary: 'Get all my planned routes' })
  @ApiResponse({ status: 200, description: 'Routes returned' })
  @Get('me')
  async getMyRoutes(@CurrentUser() user: JwtUser) {
    return this.routesService.getMyRoutes(user.sub);
  }

  /** Plans route via Valhalla and saves full response for later retrieval. */
  @ApiOperation({ summary: 'Plan new route via Valhalla and save it' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 201, description: 'Route planned and saved' })
  @Post('plan')
  async planRoute(@CurrentUser() user: JwtUser, @Body() dto: PlanRouteDto) {
    const response = await axios.post<unknown>(`${this.valhallaUrl}/route`, dto);

    return this.routesService.createRoute(
      user.sub,
      dto.locations,
      response.data as object,
      dto.title,
      dto.pois
    );
  }

  /** Returns single planned route by id scoped to authenticated user. */
  @ApiOperation({ summary: 'Get planned route by id' })
  @ApiParam({ name: 'id', description: 'Route uuid' })
  @ApiResponse({ status: 200, description: 'Route returned' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  @Get(':id')
  async getRoute(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.routesService.getRoute(id, user.sub);
  }

  /** Returns x most recently updated planned routes for authenticated user.
   * TODO Fixed, make parameterable
   */
  @ApiOperation({ summary: 'Get x most recent planned routes' })
  @ApiResponse({ status: 200, description: 'Recent routes returned' })
  @Get('me/recent')
  async getRecentRoutes(@CurrentUser() user: JwtUser) {
    return this.routesService.getRecentRoutes(user.sub);
  }

  /** Deletes planned route scoped to authenticated user. */
  @ApiOperation({ summary: 'Delete planned route' })
  @ApiParam({ name: 'id', description: 'Route id' })
  @ApiResponse({ status: 204, description: 'Route deleted' })
  @ApiResponse({ status: 404, description: 'Route not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoute(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    await this.routesService.deleteRoute(id, user.sub);
  }
}
