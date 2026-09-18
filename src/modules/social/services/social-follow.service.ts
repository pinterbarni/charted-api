import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../profile/entities/user.entity';
import { BlockEntity } from '../entities/block.entity';
import { FollowEntity } from '../entities/follow.entity';
import { SocialBlockService } from './social-block.service';

/**
 * Social follow service handles follow/unfollow relationships and follower / following list retrieval with block -related- filtering.
 */
@Injectable()
export class SocialFollowService {
  /**
   * Constructor for social follow service.
   * @param followRepository - t.orm repo for follow relationship persistence
   * @param userRepository - t.orm repo for user queries
   * @param blockRepository - t.orm repo for block relationship queries
   * @param blockService - SocialBlockService for block status checks and blocked ID retrieval
   */
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>,
    private readonly blockService: SocialBlockService
  ) {}

  // #region Public API

  /**
   * Follows user.
   * Validates: follower is not following themselves,
   * - that no block exists between two users,
   * - that target user exists,
   * - that follow relationship does not  exist already.
   * @param followerId of user initiating follow
   * @param followingId of usr to be followed
   * @returns created follow relationship entity
   * @throws {ConflictException} If following self or already following
   * @throws {NotFoundException} If usr not found or blocked
   */
  async followUser(followerId: string, followingId: string): Promise<FollowEntity> {
    this.assertNotSelf(followerId, followingId, 'follow');
    await this.assertNotBlocked(followerId, followingId);
    await this.assertUserExists(followingId);
    await this.assertNotAlreadyFollowing(followerId, followingId);

    const follow = this.followRepository.create({ followerId, followingId });
    return this.followRepository.save(follow);
  }

  /**
   * Removes follow between two usrs.
   * @param followerId of usr who is following
   * @param followingId of usr being followed
   * @returns void
   * @throws {NotFoundException} If follow relationship does not exist
   */
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follow = await this.findFollow(followerId, followingId);
    await this.followRepository.remove(follow);
  }

  /**
   * Returns list of usrs following given usr, filtered by any block relationships involving viewer.
   * @param viewerId of requesting usr (used for block filtering)
   * @param userId of usr whose followers are being fetched
   * @returns Array of usr entities following given usr
   */
  async getFollowers(viewerId: string, userId: string): Promise<UserEntity[]> {
    const follows = await this.followRepository.find({ where: { followingId: userId } });
    const followerIds = follows.map((f) => f.followerId);
    return this.filterAndFetchUsers(viewerId, followerIds);
  }

  /**
   * Returns list of usrs that usr1 is following, filtered by block relationships involving viewer.
   * @param viewerId of requesting user (used for block filtering)
   * @param userId of user who's following list is being fetched
   * @returns Array of users given usr is following
   */
  async getFollowing(viewerId: string, userId: string): Promise<UserEntity[]> {
    const follows = await this.followRepository.find({ where: { followerId: userId } });
    const followingIds = follows.map((f) => f.followingId);
    return this.filterAndFetchUsers(viewerId, followingIds);
  }

  /**
   * Returns user's public profile including follow and block status!.
   * Doesn't throw if usr is blocked!, instead! returns profile with isBlocked: true.
   * This allows frontend to render degraded blocked user view.
   * @param viewerId of requesting usr
   * @param userId of usr whose profile is being fetched
   * @returns usr entity with isFollowing and isBlocked flags
   * @throws {NotFoundException} If usr does not exist
   */
  async getProfile(
    viewerId: string,
    userId: string
  ): Promise<UserEntity & { isFollowing: boolean; isBlocked: boolean }> {
    const user = await this.assertUserExists(userId);
    const isBlocked = await this.blockService.isBlocked(viewerId, userId);

    if (isBlocked) {
      return { ...user, isFollowing: false, isBlocked: true };
    }

    const isFollowing = await this.followRepository.exists({
      where: { followerId: viewerId, followingId: userId },
    });

    return { ...user, isFollowing, isBlocked: false };
  }

  // #endregion

  // #region Private assertions

  /**
   * Throws exc if both ids are equal.
   * @param id1 First user UUID
   * @param id2 second user UUID
   * @param action Action being performed (used in error message)
   * @throws {ConflictException} If id1 === id2
   */
  private assertNotSelf(id1: string, id2: string, action: string): void {
    if (id1 === id2) {
      throw new ConflictException(`You cannot ${action} yourself`);
    }
  }

  /**
   * Important: throws Exception if block exists between two users, uses plain "not found" message to avoid revealing block status. !! (Feature)
   * @param viewerId of requesting user
   * @param targetId of target user
   * @throws {NotFoundException} If block relationship happens to exists
   */
  private async assertNotBlocked(viewerId: string, targetId: string): Promise<void> {
    const blocked = await this.blockService.isBlocked(viewerId, targetId);
    if (blocked) {
      throw new NotFoundException(`User ${targetId} not found`);
    }
  }

  /**
   *  Returns user if found.
   * @param userId of user to check
   * @returns User, only if found
   * @throws {NotFoundException} If user does not exist
   */
  private async assertUserExists(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return user;
  }

  /**
   * Throws ConflictException if follow already exists.
   * @param followerId of follower
   * @param followingId of usr being followed
   * @throws {ConflictException} - means follow relationship already exists
   */
  private async assertNotAlreadyFollowing(followerId: string, followingId: string): Promise<void> {
    const existing = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    if (existing) {
      throw new ConflictException('Already following this user');
    }
  }

  /**
   * Finds existing follow relationship. exception if doesn't exist.
   * @param followerId of follower
   * @param followingId of usr being followed
   * @returns follow itself!
   * @throws {NotFoundException} If follow relationship doesn't exist
   */
  private async findFollow(followerId: string, followingId: string): Promise<FollowEntity> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    if (!follow) {
      throw new NotFoundException('You are not following this user');
    }
    return follow;
  }

  // #endregion

  // #region Private helpers

  /**
   * Filters blocked usrs from list of usrIDs then fetch and returns remaining usrs.
   * @param viewerId  of requesting usr (used for block filtering! feature!)
   * @param userIds of usr UUIDs to filter and fetch
   * @returns of non-blocked usrs
   */
  private async filterAndFetchUsers(viewerId: string, userIds: string[]): Promise<UserEntity[]> {
    if (userIds.length === 0) return [];

    const blockedIds = await this.blockService.getBlockedIds(viewerId);
    const filteredIds = userIds.filter((id) => !blockedIds.includes(id));

    if (filteredIds.length === 0) return [];

    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: filteredIds })
      .getMany();
  }

  // #endregion
}
