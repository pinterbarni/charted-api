import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

/**
 * Directional follow relationship between two users. unique constraint  means no duplicate follows.
 * Follow relationships are auto removed when block is created between two users in any direction.
 * */
@Entity('follows')
@Unique(['followerId', 'followingId'])
export class FollowEntity {
  /** Primary key, auto-generated UUID. */
  @PrimaryGeneratedColumn('uuid') id!: string;

  /** Creation of relationship. Never updated, auto inserted. */
  @CreateDateColumn() createdAt!: Date;

  /** id of user who is following. */
  @Column('uuid') followerId!: string;

  /** id of user who is being followed/ */
  @Column('uuid') followingId!: string;
}
