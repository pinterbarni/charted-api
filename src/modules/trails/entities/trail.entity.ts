import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DistanceUnit } from '../types/trail.types';

/**
 * Completed hiking trail recorded by user which Stores GPS track data, Metadata and sharing status.
 */
@Entity('trails')
export class TrailEntity {
  /** Primary key: auto-generated uuid. */
  @PrimaryGeneratedColumn('uuid') id!: string;
  /** user who recorded this trail. Refs users table. */
  @Column('uuid') userId!: string;

  /** Title for display in app. Required! Max 100 chars --  DTO level enforced. */
  @Column() title!: string;
  /** Optional description. Max 500 chars enforced at DTO level. */
  @Column({ nullable: true }) description!: string;
  /** Total distance in meters. Stored in meters regardless of display unit! this is Feature. */
  @Column({ type: 'int', nullable: true }) distanceM!: number;
  /** Distance value as originally recorded in user's preferred unit. This is also meter, FE track in meters! */
  @Column({ type: 'float', nullable: true }) distanceOriginal!: number;
  /** Total duration in secs. Calculated by mobile app when hike ends. */
  @Column({ type: 'int', nullable: true }) durationS!: number;
  /** Hike start timestamp. Set by mobile app when tracking begins. */
  @Column({ nullable: true }) startedAt!: Date;
  /** Total elevation gain in meters. Calculated by mobile app after hike ends. */
  @Column({ type: 'int', nullable: true }) elevationGainM!: number;
  /** Whether trail is publicly visible. Defaults to false by design, but baked in to true in FE.
   * todo: Implement share logic on Fe in v2 to use by design BFF business logic.
   */
  @Column({ default: false }) isShared!: boolean;
  /** gps coord arr. Format is: [{ lat, lon, ele, time }] */
  @Column({ type: 'jsonb', nullable: true }) trackPoints!: object;
  /** Points of interest. Format: [{ lat, lon, title, note }] */
  @Column({ type: 'jsonb', nullable: true }) pois!: object;
  /** Unit system used when recording: either 'km' or 'mi'. */
  @Column({ nullable: true }) distanceUnit!: DistanceUnit;

  /** Hike end timestamp set by mob app when tracking stops. */
  @Column({ nullable: true }) finishedAt!: Date;

  /** timestamp of creation of trail. */
  @CreateDateColumn() createdAt!: Date;
  /** Record update timestamp. Updated automatically by TypeORM on save. */
  @UpdateDateColumn() updatedAt!: Date;
}
