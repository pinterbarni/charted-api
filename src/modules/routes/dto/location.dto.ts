import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { EXAMPLES as EXAMPLE } from 'src/constants/swagger.constants';

/**
 * Single waypoint coordinate. Used as nested DTO within PlanRouteDto. Coordinates should be passed directly to Valhalla in lon/lat order.
 */
export class LocationDto {
  /**
   * Longitude coord of waypoint. must be valid int, no range enforcement at DTO level.
   */
  @ApiProperty({
    example: EXAMPLE.MAP.LOCATION.LON,
    description: 'Longitude coordinate of waypoint',
  })
  @IsNumber()
  lon!: number;

  /**
   * Lat of waypoint which must be valid num no range enforcement at DTO level.
   */
  @ApiProperty({
    example: EXAMPLE.MAP.LOCATION.LAT,
    description: 'Latitude coordinate of waypoint',
  })
  @IsNumber()
  lat!: number;
}
