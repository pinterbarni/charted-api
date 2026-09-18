import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/profile/entities/user.entity';
import { Repository } from 'typeorm';
import { TrailEntity } from '../entities/trail.entity';
import { CreateTrailData, UpdateTrailData } from '../types/trail.types';

/**
 * Handles trail creation, retrieval, updating and deletion.
 * Trails are scoped to user and users by design were able to access their own trails. This changed btw.
 * This service also automatically increments user's total distance on trail creation.
 */
@Injectable()
export class TrailsService {
  /**
   * Constructor for trails service.
   * @param trailsRepository TypeOrm repo for trail persistence.
   * @param userRepository TypeOrm repo for updating user total distance.
   */
  constructor(
    @InjectRepository(TrailEntity)
    private readonly trailsRepository: Repository<TrailEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  // #region Public API

  /**
   * Creates new trail for any user as an extra, automatically increments user's total distance if distanceM is provided.
   * @param userId of user creating trail
   * @param data creation payload for trail, see CreateTrailData
   * @returns created trail entity
   */
  async createTrail(userId: string, data: CreateTrailData): Promise<TrailEntity> {
    const trail = this.trailsRepository.create({ userId, ...data });
    await this.trailsRepository.save(trail);

    if (data.distanceM) {
      await this.incrementTotalDistance(userId, data.distanceM);
    }

    return trail;
  }

  /**
   * trails belonging to user, ordered by creation stamp descending.
   * @param userId of user
   * @returns Array, all trail entities for user
   */
  async getMyTrails(userId: string): Promise<TrailEntity[]> {
    return this.findTrails({ userId });
  }

  /**
   * Returns 5 most recently created trails for user.
   * Note: Limit will be made dynamically parameterable in v2.
   * @param userId of user
   * @returns Array, up to 5 most recent trail entities
   */
  async getRecentTrails(userId: string): Promise<TrailEntity[]> {
    return this.findTrails({ userId }, 5);
  }

  /**
   * Returns all publicly shared trails for given user.
   * @param userId  of user whose trails to fetch (shared trails)
   * @returns Array of shared trail entities
   */
  async getSharedTrails(userId: string): Promise<TrailEntity[]> {
    return this.findTrails({ userId, isShared: true });
  }

  /**
   * Returns trail by Id, From now on, including owner's username.
   * @param id of trail
   * @returns trail entity with ownerUsername appended
   * @throws {NotFoundException} If trail does not exist
   */
  async getTrail(id: string): Promise<TrailEntity & { ownerUsername: string }> {
    const trail = await this.assertTrailExists(id);
    const user = await this.userRepository.findOne({ where: { id: trail.userId } });

    return { ...trail, ownerUsername: user?.username ?? 'Unknown' } as TrailEntity & {
      ownerUsername: string;
    };
  }

  /**
   * Updates allowed fields of trail scoped to requesting user.
   * Note: Only isShared, title and description can be updated post-creation.
   * @param id of trail to update
   * @param userId of requesting user
   * @param data trail data containing fields to update // partial
   * @returns updated trail after update.
   * @throws {NotFoundException} If trail doesn't exist OR belongs to another user
   */
  async updateTrail(id: string, userId: string, data: UpdateTrailData): Promise<TrailEntity> {
    await this.trailsRepository.update({ id, userId }, data);

    return this.assertTrailExistsById(id, userId);
  }

  /**
   * Deletes trail scoped to usr making request.
   * Can only delete your own trails;
   * FEATURE: Total distance is never decremented on deletion.
   * @param id - id of trail to delete
   * @param userId - if of user requesting
   * @returns void
   * @throws {NotFoundException} If trail !exist OR belongs to another user
   */
  async deleteTrail(id: string, userId: string): Promise<void> {
    const trail = await this.assertTrailExistsById(id, userId);
    await this.trailsRepository.remove(trail);
  }

  /**
   * Returns 5 most recently shared trails globally on all usr base. Used for public trail discovery feed.
   * TODO: Limit will be made parameterable in v2.
   * @returns Array of up to 5 most recently shared trail entities
   */
  async getRecentSharedTrails(): Promise<TrailEntity[]> {
    return this.findTrails({ isShared: true }, 5);
  }

  /**
   * Fetches shared trail entities by id.
   * Note: Used in combination with getMostLikedTrailIds from TrailsLikesService to build popular trails discovery endpoint.
   * @param ids - Array of trail UUIDs
   * @returns Array of shared trail entities matching th IDs
   */
  async getTrailsByIds(ids: string[]): Promise<TrailEntity[]> {
    if (ids.length === 0) return [];

    return this.trailsRepository
      .createQueryBuilder('trail')
      .where('trail.id IN (:...ids)', { ids })
      .andWhere('trail.is_shared = true')
      .getMany();
  }

  // #endregion

  // #region Private assertions

  /**
   * Finds trail by ID
   * @param id uuid of trail
   * @param userId uuId of requesting user
   * @returns trail ent
   * @throws {NotFoundException} If trail doesn't exist
   */
  private async assertTrailExists(id: string /*, userId: string*/): Promise<TrailEntity> {
    const trail = await this.trailsRepository.findOne({ where: { id /*, userId */ } });
    if (!trail) {
      throw new NotFoundException(`Trail ${id} not found`);
    }
    return trail;
  }

  /**
   * Finds trail by ID scoped to requesting user.
   * Throws Exception if not found OR belongs to another usr.
   * @param id - UUID of trail
   * @param userId - UUID of requesting user
   * @returns trail entity
   * @throws {NotFoundException} If trail does not exist or belongs to another user
   */
  private async assertTrailExistsById(id: string, userId: string): Promise<TrailEntity> {
    const trail = await this.trailsRepository.findOne({ where: { id, userId } });
    if (!trail) {
      throw new NotFoundException(`Trail ${id} not found`);
    }
    return trail;
  }

  // #endregion

  // #region Private helpers

  /**
   * Shared finder for trail queries: with optional limit, & where conditions.
   * @param where where conditions TypORM
   * @param take  for number of results --optional
   * @returns Array of trails matching given conditions
   */
  private async findTrails(where: Partial<TrailEntity>, take?: number): Promise<TrailEntity[]> {
    return this.trailsRepository.find({
      where,
      order: { createdAt: 'DESC' },
      ...(take ? { take } : {}),
    });
  }

  /**
   * Increments user's total distance by given amount after trail is successfully saved.
   * FEATURE: Never decremented! deleting trail doesn't reduce value.
   * @param userId UUID of user
   * @param distanceM Distance in m-s to add
   */
  private async incrementTotalDistance(userId: string, distanceM: number): Promise<void> {
    await this.userRepository.increment({ id: userId }, 'totalDistanceM', distanceM);
  }

  // #endregion
}
