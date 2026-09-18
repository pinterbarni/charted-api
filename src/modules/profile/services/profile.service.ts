import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LEVEL_THRESHOLDS_M } from '../../../constants/levels.constants';
import { SocialBlockService } from '../../social/services/social-block.service';
import { UserEntity } from '../entities/user.entity';
import { ProfileWithLevel, UpdateProfileData } from '../types/profile.types';

/**
 * Usr profile mgmt and search. Profiles use  KC Jwt as PK.
 * Gamification (gmf) level is computed on fly. Never stored in  db.
 */
@Injectable()
export class ProfileService {
  /**
   * Constructor
   * @param userRepository TypeORM repo for usr profile persistence
   * @param blockService - SocialBlockService for filtering blocked users from search
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly blockService: SocialBlockService
  ) {}

  // #region Public API

  /**
   * Regular upsert fn.
   * Called every login. Returns profile with computed gmf lvl.
   * @param id is KC user (sub claim from JWT)
   * @param username Kc preferred_username
   * @returns existing or newly created usr w computed level
   */
  async upsertProfile(id: string, username?: string): Promise<ProfileWithLevel> {
    const existing = await this.findUserOrNull(id);

    if (existing) {
      if (username && existing.username !== username) {
        await this.userRepository.update(id, { username });
        existing.username = username;
      }
      return this.withLevel(existing);
    }

    const user = this.userRepository.create({ id, username });
    await this.userRepository.save(user);
    return this.withLevel(user);
  }

  /**
   * Returns usr profile by ID with computed gmf lvl.
   * @param id - of user to fetch
   * @returns user entity with computed lvl
   * @throws {NotFoundException} If no profile exists for given ID
   */
  async getProfile(id: string): Promise<ProfileWithLevel> {
    const user = await this.assertUserExists(id);
    return this.withLevel(user);
  }

  /**
   * Updates user's profile fields.
   * All fields are optional. Returns full updated profile with computed lvl.
   * @param id - of user to update
   * @param data - Partial profile data containing fields to update
   * @returns updated user entity with computed lvl
   * @throws {NotFoundException} If no profile exists for given ID
   */
  async updateProfile(id: string, data: UpdateProfileData): Promise<ProfileWithLevel> {
    await this.userRepository.update(id, data);
    return this.getProfile(id);
  }

  /**
   * Searches for users by uname, excludes requester
   * and any users who have blocked or been blocked by requester.
   * @param query - Search string to match against unames
   * @param requesterId - of requesting user
   * @returns Array of matching non-blocked user entities
   */
  async searchUsers(query: string, requesterId: string): Promise<UserEntity[]> {
    const blockedIds = await this.blockService.getBlockedIds(requesterId);
    return this.buildSearchQuery(requesterId, query, blockedIds);
  }

  // #endregion

  // #region Private assertions

  /**
   * Finds user by ID or throws NotFoundException.
   * @param id - of user
   * @returns user entity
   * @throws {NotFoundException} If user does not exist
   */
  private async assertUserExists(id: string): Promise<UserEntity> {
    const user = await this.findUserOrNull(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  // #endregion

  // #region Private helpers

  /**
   * Finds usr by ID or get null as response.
   * @param id - of user
   * @returns user or null
   */
  private async findUserOrNull(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Attaches computed gmf lvl to user .
   * @param user - user
   * @returns user  with computed lvl
   */
  private withLevel(user: UserEntity): ProfileWithLevel {
    return { ...user, level: this.computeLevel(user.totalDistanceM) };
  }

  /**
   * Computes gmf lvl from total accumulated distance by usr.
   * Lvl is never stored, always computed from totalDistanceM directly.
   * @param totalDistanceM Total accumulated distance in meters
   * @returns Current lvl, where 0 means no lvl reached yet
   */
  private computeLevel(totalDistanceM: number): number {
    for (let i = LEVEL_THRESHOLDS_M.length - 1; i >= 0; i--) {
      if (totalDistanceM >= LEVEL_THRESHOLDS_M[i]) return i + 1;
    }
    return 0;
  }

  /**
   * Builds and executes usr search query by usrname with block filtering.
   * @param query Search string for ILIKE match against usrname
   * @param requesterId of requesting usr to exclude from results
   * @param blockedIds - Array of blocked users to exclude from results
   * @returns Array of matching usr entities
   */
  private async buildSearchQuery(
    requesterId: string,
    query: string,
    blockedIds: string[]
  ): Promise<UserEntity[]> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :query', { query: `%${query}%` })
      .andWhere('user.id != :requesterId', { requesterId });

    if (blockedIds.length > 0) {
      qb.andWhere('user.id NOT IN (:...blockedIds)', { blockedIds });
    }

    return qb.getMany();
  }

  // #endregion
}
