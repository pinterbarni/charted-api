import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { EXAMPLES as EXAMPLE } from 'src/constants/swagger.constants';

/**
 * DTO of route parameters that contain user UUID. target user ID is passed as URL parameter in endpoints where we will use this.
 */
export class UserIdParamDto {
  /**
   * target user id - Must be valid UUID v4 pushed by class-validator.
   */
  @ApiProperty({
    description: 'UUID of target user',
    example: EXAMPLE._UUID,
  })
  @IsUUID()
  userId!: string;
}
