import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, MaxLength } from 'class-validator';
import { EXAMPLES as EXAMPLE } from 'src/constants/swagger.constants';
import { VALIDATION } from 'src/constants/validation.constants';
import { TargetType } from '../types/report.types';

/**
 * DTO for creating new report. same reporter cannot be submitting multiple reports for same target.
 */
export class CreateReportDto {
  /**
   * Type of content being reported. Enforced by IsEnum. is used together with targetId to identify reported content.
   */
  @ApiProperty({
    enum: TargetType,
    example: TargetType.TRAIL,
    description: 'Type of content being reported, trail || user',
  })
  @IsEnum(TargetType)
  targetType!: TargetType;

  /**
   * id of reported trail or user. Must be valid uuID v4.
   * Combined with targetType  to uniquely identify reported content!
   */
  @ApiProperty({
    example: EXAMPLE._UUID,
    description: 'id of reported trail or user',
  })
  @IsUUID()
  targetId!: string;

  /**
   * displayable reason for Report submitted by reporter. longer than 0 string, max constraint
   */
  @ApiProperty({
    example: EXAMPLE.REPORT.REASON,
    description: 'Reason for submitting report',
    maxLength: VALIDATION.REPORT.MAX_LENGTH.REPORT_REASON,
  })
  @IsString()
  @MaxLength(VALIDATION.REPORT.MAX_LENGTH.REPORT_REASON)
  reason!: string;
}

/**
 * DTO for adding an admin response to an existing report.
 * todo: No role check in v1, admin role protection is planned for v2. Need to set roles in KC though.
 */
export class AdminResponseDto {
  /**
   * Admin's response or resolution note for report. Must be non-empty string, character amount is limited.
   */
  @ApiProperty({
    example: EXAMPLE.REPORT.RESPONSE,
    description: 'Admin response or resolution note for report',
    maxLength: VALIDATION.REPORT.MAX_LENGTH.ADMIN_RESPONSE,
  })
  @IsString()
  @MaxLength(VALIDATION.REPORT.MAX_LENGTH.ADMIN_RESPONSE)
  adminResponse!: string;
}
