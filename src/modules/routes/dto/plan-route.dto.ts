import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { EXAMPLES as EXAMPLE } from 'src/constants/swagger.constants';
import { VALIDATION } from 'src/constants/validation.constants';
import { LocationDto } from './location.dto';

/**
 * Made for planning new route. Waypoints are validated as nested LocationDto objects.
 * full request is forwarded to Valhalla after validation, and response is stored as JSONB in planned_routes table.
 */
export class PlanRouteDto {
  /**
   * Optional human-readable title for planned route. Character count maximalized. Nullable, users may save route without naming.
   * NOTE: FE would not let if we had implemented there.
   */
  @ApiProperty({
    required: false,
    description: 'Optional title for planned route',
    example: EXAMPLE.MAP.ROUTE.TITLE,
    maxLength: VALIDATION.ROUTE.MAX_LENGTH.TITLE,
  })
  @IsOptional()
  @IsString()
  @MaxLength(VALIDATION.ROUTE.MAX_LENGTH.TITLE)
  title?: string;

  /**
   * Array of waypoints defining route. Must contain 2 locations least: start and one end. Each location is validated as nested LocationDto. Passed to Valhalla directly for routing calc.
   */
  @ApiProperty({
    type: [LocationDto],
    description: 'Array of waypoints: minimum 2 required (start and end)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  locations!: LocationDto[];

  /**
   * Valhalla costing model to use for routing. If you forgot time you read this: common values: 'pedestrian', 'bicycle', 'auto'! Charted uses 'pedestrian' for all hiking routes. (DUH!)
   */
  @ApiProperty({
    description: "Valhalla costing model: use 'pedestrian' -- built in option in Valhalla!",
    example: EXAMPLE.MAP.ROUTE.COSTING,
  })
  @IsString()
  costing!: string;

  /**
   * Optional pois along planned route. Used to share useful information such as water sources with other users. Each POI is free-form object.
   * Expected format: { lat, lon, title, note }.
   * TODO: Could be generalized between FE and BE
   */
  @ApiProperty({
    required: false,
    description: 'Optional POIs along route. For example water sources, viewpoints.',
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
}
