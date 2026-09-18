import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * user avatar entity stores base64 images in separate table, this keeps user queries lightweight.
 * todo: Detachable by design, can be migrated to MinIO in v2 by replacing this entity with URL stored on UserEntity. Btw url is already implemented.
 */
@Entity('user_avatars')
export class UserAvatarEntity {
  /** Primary key */
  @PrimaryColumn('uuid') userId!: string;
  /** Base64 string */
  @Column({ type: 'text' }) base64!: string;
  /** Timestamp of most recent update of avatar. */
  @UpdateDateColumn() updatedAt!: Date;
}
