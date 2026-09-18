import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

/**
 * Directional block relationship between 2 users.
 * Blocks are bidirectional. if Feri blocks Claire, neither can see other's content, we don't care who initiated block.
 */
@Entity('blocks')
@Unique(['blockerId', 'blockedId'])
export class BlockEntity {
  /** PK */
  @PrimaryGeneratedColumn('uuid') id!: string;
  /** who initiated block. */
  @Column('uuid') blockerId!: string;
  /** Who was blocked. */
  @Column('uuid') blockedId!: string;
  /** Creation of block. */
  @CreateDateColumn() createdAt!: Date;
}
