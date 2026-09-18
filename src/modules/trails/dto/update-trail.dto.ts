import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { EXAMPLES as EXAMPLE } from 'src/constants/swagger.constants';
import { VALIDATION } from 'src/constants/validation.constants';

/**
 * Updating existing trail.
 */
export class UpdateTrailDto {
  /**
   * Updated sharing status of trail. true to make trail publicly visible to others in app.
   */
  @ApiProperty({
    example: true,
    description: 'If trail should be publicly visible',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isShared?: boolean;

  /**
   * Updated title of trail. Max chars set by us.
   */
  @ApiProperty({
    example: EXAMPLE.TRAIL.TITLE,
    description: 'New title for trail',
    required: false,
    maxLength: VALIDATION.TRAIL.MAX_LENGTH.TITLE,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.TRAIL.MAX_LENGTH.TITLE)
  title?: string;
  /**
   * Updated description of trail.  M x chars set by us.
   */
  @ApiProperty({
    description: 'new description for trail',
    example: EXAMPLE.TRAIL.DESCRIPTION,
    maxLength: VALIDATION.TRAIL.MAX_LENGTH.DESCRIPTION,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.TRAIL.MAX_LENGTH.DESCRIPTION)
  description?: string;
}
