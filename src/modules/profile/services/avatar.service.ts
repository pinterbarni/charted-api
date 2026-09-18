import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserAvatarEntity } from '../entities/user-avatar.entity';
import { AvatarMap } from '../types/profile.types';

/**
 *User avatar upload, retrieval and deletion. Avatars are stored as base64 in separate table to keep usr queries lightweight.
 * TODO: Separated from ProfileService to allow easy migration to MinIO in v2.
 */
@Injectable()
export class AvatarService {
  /**
   * Constructor for avatar service.
   * @param avatarRepository - t.orm repo for avatar persistence
   */
  constructor(
    /** TypeORM repo for user avatar per. */
    @InjectRepository(UserAvatarEntity)
    private readonly avatarRepository: Repository<UserAvatarEntity>
  ) {}

  // #region Public API

  /**
   * Uploads or replaces user's avatar
   * @param userId of user uploading avatar
   * @param base64 - base64 encoded image which is
   * @returns created or updated avatar entity
   */
  async upsertAvatar(userId: string, base64: string): Promise<UserAvatarEntity> {
    const existing = await this.findAvatarOrNull(userId);

    if (existing) {
      existing.base64 = base64;
      return this.avatarRepository.save(existing);
    }

    const avatar = this.avatarRepository.create({ userId, base64 });
    return this.avatarRepository.save(avatar);
  }

  /**
   * Returns avatar for user.
   * @param userId of user
   * @returns avatar
   * @throws {NotFoundException} If no avatar exists
   */
  async getAvatar(userId: string): Promise<UserAvatarEntity> {
    return this.assertAvatarExists(userId);
  }

  /**
   * Returns avatars for users in 1 query. Used to batch load avatars for search results. Users without avatars are omitted from result! Feature!!!
   * @param userIds - Array of user UUIDs to fetch avatars for
   * @returns Map of userId to base64 string
   */
  async getAvatarsBulk(userIds: string[]): Promise<AvatarMap> {
    // if (userIds.length === 0 && ) {};
    if (userIds.length === 0) return {};

    const avatars = await this.avatarRepository.find({
      where: { userId: In(userIds) },
    });

    return this.buildAvatarMap(avatars);
  }

  /**
   * Deletes user's avatar.
   * @param userId of user
   * @returns void
   * @throws {NotFoundException} If no avatar exists for user
   */
  async deleteAvatar(userId: string): Promise<void> {
    const avatar = await this.assertAvatarExists(userId);

    await this.avatarRepository.remove(avatar);
  }

  // #endregion

  // #region Private assertions

  /**
   * Finds avatar or throws NotFoundException.
   * @param userId of user
   * @returns avatar entity
   * @throws {NotFoundException} If no avatar exists for user
   */
  private async assertAvatarExists(userId: string): Promise<UserAvatarEntity> {
    const avatar = await this.findAvatarOrNull(userId);
    if (!avatar) {
      throw new NotFoundException(`Avatar for user ${userId} not found`);
    }
    return avatar;
  }

  // #endregion
  // #region Private helpers

  /**
   * Finds avatar by userId else null.
   * @param userId of user
   * @returns avatar entity or null
   */
  private async findAvatarOrNull(userId: string): Promise<UserAvatarEntity | null> {
    return this.avatarRepository.findOne({ where: { userId } });
  }

  /**
   * Builds userId  to b64 map from array of avatar entities.
   * @param avatars array of avatars
   * @returns Map of userId to base64 string
   */
  private buildAvatarMap(avatars: UserAvatarEntity[]): AvatarMap {
    return avatars.reduce<AvatarMap>((acc, avatar) => {
      acc[avatar.userId] = avatar.base64;
      return acc;
    }, {});
  }

  // #endregion
}
