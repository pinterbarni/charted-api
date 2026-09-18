import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrailLikeEntity } from '../entities/trail-like.entity';
import { TrailEntity } from '../entities/trail.entity';

/**
 * trails likes service handles un/liking, and like count retrieval for trails. Provides ranked trail discovery based on global like counts as an extra.
 */
@Injectable()
export class TrailsLikesService {
  /**
   * Constructor for trails likes service.
   * @param likesRepository - TypeORM repository for trail like persistence
   * @param trailsRepository - TypeORM repository for trail existence checks
   */
  constructor(
    @InjectRepository(TrailLikeEntity)
    private readonly likesRepository: Repository<TrailLikeEntity>,
    @InjectRepository(TrailEntity)
    private readonly trailsRepository: Repository<TrailEntity>
  ) {}

  // #region Public API

  /**
   * Likes, validates: likes trail on behalf of usr and validates that trail exists and has not already been liked by this usr.
   * @param userId of user liking trail
   * @param trailId of trail to like
   * @returns created like entity
   * @throws {NotFoundException} Trail does not exist
   * @throws {ConflictException} Usr has already liked hte trail
   */
  async likeTrail(userId: string, trailId: string): Promise<TrailLikeEntity> {
    await this.assertTrailExists(trailId);
    await this.assertNotAlreadyLiked(userId, trailId);

    const like = this.likesRepository.create({ userId, trailId });
    return this.likesRepository.save(like);
  }

  /**
   * Removes like from trail on behalf of user.
   * @param trailId of trail to unlike
   * @param userId of usr unliking trail
   * @returns void
   * @throws {NotFoundException} like does not exist
   */
  async unlikeTrail(userId: string, trailId: string): Promise<void> {
    const like = await this.findLike(userId, trailId);
    await this.likesRepository.remove(like);
  }

  /**
   * Returns total number of likes for given trail.
   * @param trailId of trail
   * @returns Total like count
   */
  async getLikeCount(trailId: string): Promise<number> {
    return this.likesRepository.count({ where: { trailId } });
  }

  /**
   * Returns UUIDs of 4 most liked trails globally, ordered by like count descending.
   * @returns Array of up to 4 trail UUIDs ordered by popularity
   */
  async getMostLikedTrailIds(): Promise<string[]> {
    const result = await this.likesRepository
      .createQueryBuilder('like')
      .select('like.trail_id', 'trailId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('like.trail_id')
      .orderBy('count', 'DESC')
      .limit(4)
      .getRawMany<{ trailId: string; count: string }>();

    return result.map((r) => r.trailId);
  }

  // #endregion

  // #region Private assertions

  /**
   * Throws error if trail does not exist.
   * @param trailId of trail to check
   * @throws {NotFoundException} If trail does not exist
   */
  private async assertTrailExists(trailId: string): Promise<void> {
    const trail = await this.trailsRepository.findOne({ where: { id: trailId } });
    if (!trail) {
      throw new NotFoundException(`Trail ${trailId} not found`);
    }
  }

  /**
   * exception if user has already liked trail.
   * @param trailId of trail
   * @param userId of usr
   * @throws {ConflictException} If like already exists
   */
  private async assertNotAlreadyLiked(userId: string, trailId: string): Promise<void> {
    const existing = await this.likesRepository.findOne({
      where: { userId, trailId },
    });
    if (existing) {
      throw new ConflictException('Already liked this trail');
    }
  }

  /**
   * Finds existing like relationship. Throws Exception if does not exist.
   * @param userId of usr
   * @param trailId of trail
   * @returns like entity
   * @throws {NotFoundException} If like does not exist
   */
  private async findLike(userId: string, trailId: string): Promise<TrailLikeEntity> {
    const like = await this.likesRepository.findOne({
      where: { userId, trailId },
    });
    if (!like) {
      throw new NotFoundException('You have not liked this trail');
    }
    return like;
  }

  // #endregion
}
