import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { JwtUser } from 'src/common/decorators/types/decorator.types';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AvatarService } from '../services/avatar.service';

/**
 * avatar ctrlr handles profile image post get and del.
 * Images are stored in base64 in separate table. loaded independently from user data this way we keep responses lightweight.
 */
@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  /** Upload or replace avatar of mine */
  @ApiOperation({ summary: 'Upload OR replace my avatar' })
  @ApiResponse({ status: 201, description: 'Avatar uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('avatar')
  async upsertAvatar(@CurrentUser() user: JwtUser, @Body() body: { base64: string }) {
    return this.avatarService.upsertAvatar(user.sub, body.base64);
  }

  /** Get avatar for user */
  @ApiOperation({ summary: 'Get avatar for specific usr' })
  @ApiParam({ name: 'id', description: 'User uid' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  @ApiResponse({ status: 200, description: 'Avatar returned' })
  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string) {
    return this.avatarService.getAvatar(id);
  }

  /** Get avatars for multiple users // bulk */
  @ApiOperation({ summary: 'Get avatars for multiple users IN BULK' })
  @ApiQuery({ name: 'ids', description: 'Comma separated user Uuids' })
  @ApiResponse({ status: 200, description: 'Avatars Returned as userId:base64 map' })
  @Get('avatars')
  async getAvatarsBulk(@Query('ids') ids: string) {
    const userIds = ids.split(',').filter(Boolean);
    return this.avatarService.getAvatarsBulk(userIds);
  }

  /** Delete my avatar of mine */
  @ApiOperation({ summary: 'Delete my avatar' })
  @ApiResponse({ status: 404, description: 'Not found avatar' })
  @ApiResponse({ status: 204, description: 'Avatar deled' })
  @ApiOperation({ summary: 'Delete my avatar' })
  @Delete('avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvatar(@CurrentUser() user: JwtUser) {
    await this.avatarService.deleteAvatar(user.sub);
  }
}
