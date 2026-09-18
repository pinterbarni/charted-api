import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

/** Handles MVP health-checks for BFF maintainers eg. docker */
@ApiTags('health')
@Controller('health')
export class HealthController {
  /** Health-check, public, addressable without auth-token. */
  @ApiOperation({ summary: 'Check API health' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  @Public()
  @Get()
  check() {
    return { status: 'healthy' };
  }
}
