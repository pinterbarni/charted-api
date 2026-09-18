import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from './entities/report.entity';
import { TargetType } from './types/report.types';

/**
 * Create and mgmt - of usr-submitted reports for trails and usrs. Provides basic admin response fn for MVP-level moderation.
 * TODO: Note: MVP Level only. V2.
 */
@Injectable()
export class ReportsService {
  /**
   * Creates ReportsService.
   * @param reportsRepository repository for ReportEntity
   */
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportsRepository: Repository<ReportEntity>
  ) {}

  // #region Public API

  /**
   * Creates new report for trail or usr. Prevents dupe reports from same reporter for same target.
   * @param reporterId of usr submitting report
   * @param data Report payload containing target type, target ID and reason
   *  @param data.reason human-readable reason for report\
   *  @param data.targetType - Whether report targets trail or usr
   *  @param data.targetId of reported trail or User
   * @returns created report entity
   * @throws {ConflictException} If reporter has already reported target
   */
  async createReport(
    reporterId: string,
    data: {
      targetType: TargetType;
      targetId: string;
      reason: string;
    }
  ): Promise<ReportEntity> {
    await this.assertNotAlreadyReported(reporterId, data.targetType, data.targetId);

    const report = this.reportsRepository.create({ reporterId, ...data });
    return this.reportsRepository.save(report);
  }

  /**
   * Adds admin note to existing report. Used for basic MVP-level moderation
   * TODO: Role check in v2.
   * @param adminResponse admin's response text
   * @param id of report to respond to
   * @returns updated report entity
   * @throws {NotFoundException} If report does not exist
   */
  async addAdminResponse(id: string, adminResponse: string): Promise<ReportEntity> {
    const report = await this.findReport(id); //implement role check
    report.adminResponse = adminResponse;
    return this.reportsRepository.save(report);
  }
  /**
   * Returns all reports ordered by creation date in desc. Intended for admin use only no pagination in v1.
   * TODO: V2 pagination!
   * @returns Array of all report entities
   */
  async getReports(): Promise<ReportEntity[]> {
    return this.reportsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // #endregion

  // #region Private assertions

  /**
   * Exception if reporter already reported target
   * @param reporterId  of reporting usr
   * @param targetType - Type of reported content
   * @param targetId  of reported content
   * @throws {ConflictException} If report already exists for combination
   */
  private async assertNotAlreadyReported(
    reporterId: string,
    targetType: TargetType,

    targetId: string
  ): Promise<void> {
    const existing = await this.reportsRepository.findOne({
      where: { reporterId, targetType, targetId },
    });
    if (existing) {
      throw new ConflictException('You have already reported this');
    }
  }

  // #endregion

  // #region Private helpers

  /**
   * Finds report by id. Exception if does not exist.
   * @param id  of report
   * @returns report entity
   * @throws {NotFoundException} If report does not exist
   */
  private async findReport(id: string): Promise<ReportEntity> {
    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report ${id} not found`);
    }
    return report;
  }

  // #endregion
}
