import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { TargetType } from '../types/report.types';

/**
 * User-submitted report against trail or user.
 * Unique constraint prevents duplicate reports from same reporter. It's Feature!
 */
@Entity('reports')
@Unique(['reporterId', 'targetType', 'targetId'])
export class ReportEntity {
  /** Auto-generated uuID prim-key. */
  @PrimaryGeneratedColumn('uuid') id!: string;
  /** uuid of submitter usr. */
  @Column('uuid') reporterId!: string;
  /** Type of reported content: trail / user. */
  @Column() reason!: string;
  /** Optional admin response; via PATCH /reports/:id. */
  @CreateDateColumn() createdAt!: Date;
  /** Most recent update. */
  @UpdateDateColumn() updatedAt!: Date;
  /** UUID of reported trail or user. */
  @Column('uuid') targetId!: string;
  @Column({ nullable: true }) adminResponse!: string;
  /** Timestamp of report submission. */
  @Column({ type: 'enum', enum: TargetType }) targetType!: TargetType;
  /** Human-readable reason for report, for report handlers in BO. */
}
