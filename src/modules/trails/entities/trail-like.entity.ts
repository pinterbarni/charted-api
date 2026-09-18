import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

/**
 * relationship between user and trail via like.
 * unique - no duplicates. count queries aggregate like counts.
 */
@Entity('trail_likes')
@Unique(['userId', 'trailId'])
export class TrailLikeEntity {
  /** Primary key: auto-generated. */
  @PrimaryGeneratedColumn('uuid') id!: string;
  /** user who liked trail.  -- users table. */
  @Column('uuid') userId!: string;
  /** liked trail. --  trails table. */
  @Column('uuid') trailId!: string;
  /** like was created here. Auto set by TypeORM on insert. */
  @CreateDateColumn() createdAt!: Date;
}
