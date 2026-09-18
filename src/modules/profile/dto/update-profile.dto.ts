import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { EXAMPLES as EXAMPLE } from 'src/constants/swagger.constants';
import { VALIDATION } from 'src/constants/validation.constants';

/**
 * Dto For updating user profile.
 */
export class UpdateProfileDto {
  /**
   * User's chosen disp nm shown across app. Max chars set byMaxLength.
   */
  @ApiProperty({
    description: 'Display name shown across app',
    example: EXAMPLE.PROFILE.DISPLAY_NAME,
    required: false,
    maxLength: VALIDATION.PROFILE.MAX_LENGTH.DISPLAY_NAME,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.PROFILE.MAX_LENGTH.DISPLAY_NAME)
  displayName?: string;

  /**
   * Short biography shown on public profile. Max chars set byMaxLength.
   */
  @ApiProperty({
    description: 'Short bio shown on public profile',
    example: EXAMPLE.PROFILE.BIO,
    required: false,
    maxLength: VALIDATION.PROFILE.MAX_LENGTH.BIO,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.PROFILE.MAX_LENGTH.BIO)
  bio?: string;

  /**
   * URL pointing to user's avatar image. Must be valid URL enforced by IsUrl.
   * Optional:
   * TODO: Direct file upload via MinIO is planned for v2.
   */
  @ApiProperty({
    description: 'Valid URL pointing to user avatar img',
    example: EXAMPLE.PROFILE.AVATAR_URL,
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
