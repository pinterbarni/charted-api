import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * user entity is Charted-bff-side user profile.
 * primary key is user's Keycloak ID, not generated one.
 */
@Entity('users')
export class UserEntity {
  /** Prim key: kc jwt sub claim (uuid format). */
  @PrimaryColumn('uuid') id!: string;
  /** Keycloak preferred_username, set on upsert. Used for search. */
  @Column({ nullable: true }) username!: string;
  /** User's chosen display name shown across app. */
  @Column({ nullable: true }) displayName!: string;
  /** Short user bio shown on public profile. */
  @Column({ nullable: true }) bio!: string;
  /** URL pointing to user's avatar img. */
  @Column({ nullable: true }) avatarUrl!: string;
  /** Accumulated total dist of all completed hikes in meters. */
  @Column({ type: 'float', default: 0 }) totalDistanceM!: number;
  /** Timestamp of when profile was first created. */
  @CreateDateColumn() createdAt!: Date;
  /** Timestamp of most recent profile update. */
  @UpdateDateColumn() updatedAt!: Date;
}
