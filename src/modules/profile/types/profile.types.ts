import { UserEntity } from '../entities/user.entity';

/** userId 2 base64 avatar string, used for bulk avatar responses. */
export type AvatarMap = Record<string, string>;

/** Profile response with extra: computed gamification level. */
export type ProfileWithLevel = UserEntity & { level: number };

/** Fields of UserEntity that are allowed to be updated by user. */
export type UpdatableProfileFields = 'displayName' | 'bio' | 'avatarUrl';

/** Update payload for user profile, partial AND all fields are optional. */
export type UpdateProfileData = Partial<Pick<UserEntity, UpdatableProfileFields>>;

/** Interface for validator consts */
export interface IUpdateProfileValidator {
  /**
   * max len limits
   * todo: could be equal on FE. Export /@types-BFF or something
   */
  MAX_LENGTH: {
    DISPLAY_NAME: number;
    BIO: number;
  };
}
