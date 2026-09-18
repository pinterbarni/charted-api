import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlannedRouteEntity } from '../entities/planned-route.entity';

/**
 * Planned route creation, retrieval deletion. Routes are scoped to logged in usr, usrs can only access their own routes. Full Valhalla responses are stored as jsonb for retrieval * without re-querying Valhalla.
 */
@Injectable()
export class RoutesService {
  /**
   * Constructor for routes service.
   * @param routesRepository TypeORM repository for planned route persistence
   */
  constructor(
    @InjectRepository(PlannedRouteEntity)
    private readonly routesRepository: Repository<PlannedRouteEntity>
  ) {}

  // #region Public API

  /**
   * Creates new planned route persists to database.
   * full Valhalla response is stored as jsonb so client can retrieve complete routing data without re-querying Valhalla.
   * @param valhallaResponse Full Valhalla routing response stored as jsonb
   * @param userId of usr creating route
   * @param title Optional human-readable title for route
   * @param pois Optional points of interest along route (e.g. water sources)
   * @param waypoints - Array of waypoint coordinates sent to Valhalla
   * @returns created planned route entity
   */
  async createRoute(
    userId: string,
    waypoints: object,
    valhallaResponse: object,
    title?: string,
    pois?: object[]
  ): Promise<PlannedRouteEntity> {
    const route = this.routesRepository.create({ userId, waypoints, valhallaResponse, title, pois });
    return this.routesRepository.save(route);
  }

  /**
   * Returns all planned routes belonging to usr, ordered by creation date descending.
   * @param userId of user
   * @returns Array of all planned route entities for usr
   */
  async getMyRoutes(userId: string): Promise<PlannedRouteEntity[]> {
    return this.routesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Returns 4 most recently updated planned routes for usr.
   * Note: Limit will be made parameterable in v2.
   * @param userId of sur
   * @returns Array of up to 4 most recently updated planned route entities
   */
  async getRecentRoutes(userId: string): Promise<PlannedRouteEntity[]> {
    return this.routesRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      take: 4,
    });
  }

  /**
   * Returns single planned route by iD, scoped to requesting usr usrs can only fetch their own routes via this method.
   * @param id of planned route
   * @param userId of requesting user
   * @returns planned route entity
   * @throws {NotFoundException} If route does not exist or belongs to another usr
   */
  async getRoute(id: string, userId: string): Promise<PlannedRouteEntity> {
    return this.assertRouteExists(id, userId);
  }

  /**
   * Deletes planned route scoped to requesting usr. Users can only delete their own routes.
   * @param id of planned route to delete
   * @param userId of requesting user
   * @returns void
   * @throws {NotFoundException} If route does not exist or belongs to another usr
   */
  async deleteRoute(id: string, userId: string): Promise<void> {
    const route = await this.assertRouteExists(id, userId);
    await this.routesRepository.remove(route);
  }

  // #endregion

  // #region Private assertions

  /**
   * Finds route by id scoped to requesting usr. Throws Exception if not found or belongs to another usr.
   * @param id of planned route
   * @param userId of requesting usr
   * @returns planned route entity
   * @throws {NotFoundException} If route does not exist or belongs to another usr
   */
  private async assertRouteExists(id: string, userId: string): Promise<PlannedRouteEntity> {
    const route = await this.routesRepository.findOne({ where: { id, userId } });
    if (!route) {
      throw new NotFoundException(`Route ${id} not found`);
    }
    return route;
  }

  // #endregion
}
