import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../../profile/entities/user.entity';
import { BlockEntity } from '../entities/block.entity';
import { FollowEntity } from '../entities/follow.entity';

/**
 * Usr (un)blocking, and block status checks. Exported from SocialModule and injected into other modules.
 */
@Injectable()
export class SocialBlockService {
  /**
   * Constructor method
   * @param userRepository repo for fetching blocked usr profiles
   * @param blockRepository repo for block relationship persistence
   * @param followRepository repo for removing follow relationships on block
   */
  constructor(
    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  // #region Public API

  /**
   * Blocks usr and removes any existing follow relationships in both directions.
   * Note: Block status is bidirectional - if usr blocks B, B also cannot see A.
   * @param blockedId of user being blocked
   * @param blockerId of usr initiating block
   * @returns created block entity
   * @throws {ConflictException} If blocking self or usr is already blocked
   */
  async blockUser(blockerId: string, blockedId: string): Promise<BlockEntity> {
    this.assertNotSelf(blockerId, blockedId);
    await this.assertNotAlreadyBlocked(blockerId, blockedId);

    await this.removeFollowRelationships(blockerId, blockedId);

    const block = this.blockRepository.create({ blockerId, blockedId });
    return this.blockRepository.save(block);
  }

  /**
   * Unblocks previously blocked user.
   * @param blockedId of usr being unblocked
   * @param blockerId of usr who initiated block
   * @returns void
   * @throws {NotFoundException} If no block relationship exists
   */
  async unblockUser(blockerId: string, blockedId: string): Promise<void> {
    const block = await this.findBlock(blockerId, blockedId);

    await this.blockRepository.remove(block);
  }

  /**
   * Checks whether block exists between two usrs in either direction. Used across modules to filter blocked usrs from responses.
   * @param viewerId of requesting usr
   * @param targetId of target usr
   * @returns True if block exists in either direction, false otherwise
   */
  async isBlocked(viewerId: string, targetId: string): Promise<boolean> {
    const block = await this.blockRepository.findOne({
      where: [
        { blockerId: viewerId, blockedId: targetId },
        { blockerId: targetId, blockedId: viewerId },
      ],
    });
    return !!block;
  }

  /**
   * Returns full usr profiles for all usrs blocked by viewer.
   * Only returns Users that viewer has blocked, not usr who have blocked viewer.
   * @param viewerId of requesting usr
   * @returns Array of UserEntity for each blocked user
   */
  async getBlockedUsers(viewerId: string): Promise<UserEntity[]> {
    const blocks = await this.blockRepository.find({
      where: { blockerId: viewerId },
    });

    if (blocks.length === 0) return [];

    const blockedIds = blocks.map((b) => b.blockedId);

    return this.userRepository.findBy({ id: In(blockedIds) });
  }

  // #endregion

  // #region Public helpers

  /**
   * Fetches all usr ids blocked by || blocking viewer.
   * @param viewerId of requesting usr
   * @returns Array of blocked/blocking usr ids
   */
  async getBlockedIds(viewerId: string): Promise<string[]> {
    const blocks = await this.blockRepository.find({
      where: [{ blockerId: viewerId }, { blockedId: viewerId }],
    });

    return blocks.map((b) => (b.blockerId === viewerId ? b.blockedId : b.blockerId));
  }

  // #endregion
  // #region Private assertions

  /**
   * Throws ConflictException if both Ids are same.
   * @param id1 first usr
   * @param id2 second usr
   * @throws {ConflictException} If id1 === id2
   */
  private assertNotSelf(id1: string, id2: string): void {
    if (id1 === id2) {
      throw new ConflictException('You cannot block yourself');
    }
  }

  /**
   * Throws ConflictException if block relationship exists.
   * @param blockedId of blocked usr
   * @param blockerId of blocker
   * @throws {ConflictException} If block exists
   */
  private async assertNotAlreadyBlocked(blockerId: string, blockedId: string): Promise<void> {
    const existing = await this.blockRepository.findOne({
      where: { blockerId, blockedId },
    });
    if (existing) {
      throw new ConflictException('Already blocked this user');
    }
  }

  /**
   * Finds one existing block relationship.
   * @param blockedId of blocked usr
   * @param blockerId of blocker
   * @returns block
   * @throws {NotFoundException} If block does not exist
   */
  private async findBlock(blockerId: string, blockedId: string): Promise<BlockEntity> {
    const block = await this.blockRepository.findOne({
      where: { blockerId, blockedId },
    });

    if (!block) {
      throw new NotFoundException('You haven"t blocked this usr');
    }
    return block;
  }

  // #endregion

  // #region Private helpers

  /**
   * Removes follow relationships between two usrs -- both -- directions, is called automatically when block created.
   * @param blockerId of blocker
   * @param blockedId of blocked usr
   */
  private async removeFollowRelationships(blockerId: string, blockedId: string): Promise<void> {
    await this.followRepository.delete({ followerId: blockerId, followingId: blockedId });
    // await this.followRepository.delete({ followerId: blockedId, followingId: blockerId });
    await this.followRepository.delete({ followerId: blockedId, followingId: blockerId });
  }

  // #endregion
}
