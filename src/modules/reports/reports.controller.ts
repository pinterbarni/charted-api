import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { JwtUser } from 'src/common/decorators/types/decorator.types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminResponseDto, CreateReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';

/** Handles report related requests from users in application / authentic users. */
@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /** Creates report for trail or user. */
  @ApiOperation({ summary: 'Create report for one trail || user' })
  @ApiResponse({ status: 409, description: 'Already reported' })
  @ApiResponse({ status: 201, description: 'Report created' })
  @Post()
  async createReport(@CurrentUser() user: JwtUser, @Body() dto: CreateReportDto) {
    return this.reportsService.createReport(user.sub, dto);
  }

  /** Get all reports. No limits. */
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, description: 'Reports returned' })
  @Get()
  async getReports() {
    return await this.reportsService.getReports();
  }

  /** Add admin response to report. */
  @ApiOperation({ summary: 'Add admin response to report' })
  @ApiParam({ name: 'id', description: 'Report UUID' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @ApiResponse({ status: 200, description: 'Admin response done' })
  @Patch(':id')
  async addAdminResponse(@Param('id') id: string, @Body() dto: AdminResponseDto) {
    return this.reportsService.addAdminResponse(id, dto.adminResponse);
  }
}
