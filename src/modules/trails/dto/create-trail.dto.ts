import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EXAMPLES as EXAMPLE } from 'src/constants/swagger.constants';
import { VALIDATION } from 'src/constants/validation.constants';
import { DistanceUnit } from '../types/trail.types';

/**
 * DTO 4 creating new trail. title is required, all other are optional.
 * TODO: all other V2 can be provided immediately after hike or added via PATCH later.
 */
export class CreateTrailDto {
  /**
   * UI ready title of trail. Max chars enforced w maxLen. NOTE: Required: only mandatory field on trail creation.
   */
  @ApiProperty({
    example: EXAMPLE.TRAIL.TITLE,
    description: 'Title of trail',
    maxLength: VALIDATION.TRAIL.MAX_LENGTH.TITLE,
  })
  @IsString()
  @MaxLength(VALIDATION.TRAIL.MAX_LENGTH.TITLE)
  title!: string;

  /**
   * Optional description of trail. Max chars enforced w maxLen.
   */
  @ApiProperty({
    example: EXAMPLE.TRAIL.DESCRIPTION,
    description: 'Optional description of trail',
    required: false,
    maxLength: VALIDATION.TRAIL.MAX_LENGTH.DESCRIPTION,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.TRAIL.MAX_LENGTH.DESCRIPTION)
  description?: string;

  /**
   * Total dist of trail in m-s. (Calculated by mobile app after hike ends.)
   * NUMBER, BUT no range enforcement here.
   */
  @ApiProperty({
    example: EXAMPLE.TRAIL.DISTANCE_M,
    description: 'Total distance in meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  distanceM?: number;
  /**
   * Total duration of hike in seconds. (Calculated by mobile app after hike ends.)
   * NUMBER, BUT no range enforcement here.
   */
  @ApiProperty({
    example: EXAMPLE.TRAIL.DURATION_S,
    description: 'Total duration in seconds',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  durationS?: number;
  /**
   * Total elevation gain of trail in meters. (Calculated by mobile app after hike ends.)
   * NUMBER, BUT no range enforcement here.
   */
  @ApiProperty({
    example: EXAMPLE.TRAIL.ELEVATION_GAIN_M,
    description: 'Total elevation gain in meters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  elevationGainM?: number;

  /**
   * trail public visibility tag for other usrs. Defaults to false, By design: trails are private until shared.
   * Can also be toggled later (in real life already) via PATCH /trails/:id.
   */
  @ApiProperty({
    example: false,
    description: 'Whether trail is publicly visible: default is false',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isShared?: boolean;

  /**
   * GPS coord arr recorded during hiking. (Sent by mobile app after tracking.)
   * each point is free-form object: expected format: { lat, lon, ele, time }. Stored as JSONB for direct MapLibre rendering without parsing!
   */
  @ApiProperty({
    description: 'GPS track points recorded during hike',
    required: false,
    example: [
      {
        lat: EXAMPLE.MAP.LOCATION.LAT,
        lon: EXAMPLE.MAP.LOCATION.LON,
        ele: EXAMPLE.TRAIL.ELEVATION_GAIN_M,
        time: EXAMPLE._TIMESTAMP,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  trackPoints?: object[];

  /**
   * Points of interest set by usr during hike.
   * Each POI is free-form object: expected format: { lat, lon, title, note }. Stored as JSONB alongside  track points.
   */
  @ApiProperty({
    description: 'POIS set during hiking',
    required: false,
    example: [
      {
        lat: EXAMPLE.MAP.LOCATION.LAT,
        lon: EXAMPLE.MAP.LOCATION.LON,
        title: EXAMPLE.MAP.POI.TITLE,
        note: EXAMPLE.MAP.POI.NOTE,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  pois?: object[];

  /**
   * Timestamp of hike start. (Sent by mobile app when tracking begins.)
   * Converted to Date object in ctrlr before passing to service.
   */
  @ApiProperty({
    example: EXAMPLE._TIMESTAMP,
    description: 'Timestamp of hike start',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startedAt?: string;

  /**
   * Timestamp of when hike ends. (Sent by mobile app when tracking stops.)
   * Converted to Date object in ctrlr before passing to service.
   */
  @ApiProperty({
    example: EXAMPLE._TIMESTAMP,
    description: 'Timestamp of when hike ends',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  finishedAt?: string;

  /**
   * unit system used when recording this trail. (Sent by mobile app based on usr preference at time of recording.)
   */
  @ApiProperty({
    example: DistanceUnit.KM,
    description: 'Unit system used for distance measurement',
    required: false,
    enum: DistanceUnit,
  })
  @IsOptional()
  @IsEnum(DistanceUnit)
  distanceUnit?: DistanceUnit;

  /**
   * Recorded in  usr's preferred unit. (Sent alongside distanceUnit for accurate display without re-conversion.) (by default, FE sends m.)
   */
  @ApiProperty({
    example: EXAMPLE.TRAIL.DISTANCE_ORIGINAL,
    description: 'Distance value in unit specified by distanceUnit',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  distanceOriginal?: number;
}
