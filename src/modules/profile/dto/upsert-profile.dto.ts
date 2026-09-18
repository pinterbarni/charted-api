import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Upsert = update OR Insert if non-updateable.
 * profile ID is taken from jwt, not from request body.
 * Uname is sourced from Keycloak preferred_username, and NEVER set manually by user.
 */
export class UpsertProfileDto {
  /**
   * Upsert = update OR Insert if non-updateable.
   * profile ID is taken from jwt, not from request body.
   */
  @ApiProperty({
    required: false,

    description: 'Keycloak preferred_username, sourced from Jwt on login',
    example: 'bpinter', // if u see this, you know my name already
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;
}
