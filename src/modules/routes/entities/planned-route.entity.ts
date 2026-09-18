import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * Hiking route planned before hike. full Valhalla response gets stored as JSONB. client can retrieve complete routing data without re-querying Valhalla.
 * POIs can be attached to share useful information such as water sources and so on, stored in fe now. no validation on BE yet.
 * todo: maybe poi validation on BE in later releases.
 */
@Entity('planned_routes')
export class PlannedRouteEntity {
  /** PK - autogen-d */
  @PrimaryGeneratedColumn('uuid') id!: string;
  /** Full valhalla routing response stored as JSONB. */
  @Column({ type: 'jsonb' }) valhallaResponse!: object;

  /**
   * Optional display title for planned route.
   * */
  @Column({ nullable: true }) title!: string;

  /** Array of waypoints sent to valhalla to generate route. */
  @Column({ type: 'jsonb' }) waypoints!: object;
  /** User who planned this route. */
  @Column('uuid') userId!: string;
  /** Optional points of interest for planned route. */
  @Column({ type: 'jsonb', nullable: true }) pois!: object;
  /** Planned route created at this timestamp. */
  @CreateDateColumn() createdAt!: Date;
  /** Most recent route update. */
  @UpdateDateColumn() updatedAt!: Date;
}
