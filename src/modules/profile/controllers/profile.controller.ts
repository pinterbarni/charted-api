import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { JwtUser } from 'src/common/decorators/types/decorator.types';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpsertProfileDto } from '../dto/upsert-profile.dto';
import { ProfileService } from '../services/profile.service';

/**
 * Handles user profile mgmt. Profile is auto created  on first login via upsert.
 * User search filters out blocked users from results. !
 */
@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /** Creates profile on first login or returns existing one. */
  @ApiOperation({ summary: 'Create or update profile on first login' })
  @ApiResponse({ status: 201, description: 'Profile upserted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('me')
  async upsertProfile(@CurrentUser() user: JwtUser, @Body() dto: UpsertProfileDto) {
    return this.profileService.upsertProfile(user.sub, dto.username);
  }

  /** Returns authed user's own profile including computed level which we don't use yet.
   *  todo  V2 - user profile's computed level
   * */
  @ApiOperation({ summary: 'Get my prof' })
  @ApiResponse({ status: 200, description: 'Profile returned success!' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('me')
  async getMyProfile(@CurrentUser() user: JwtUser) {
    return this.profileService.getProfile(user.sub);
  }

  /** Searches users by username, excluding blocked users from results. */
  @ApiOperation({ summary: 'Search users by usrname' })
  @ApiQuery({ name: 'q', description: 'Search query partial case-insensitive match' })
  @ApiResponse({ status: 200, description: 'Matching users returned' })
  @Get('search')
  async searchUsers(@CurrentUser() user: JwtUser, @Query('q') q: string) {
    return this.profileService.searchUsers(q, user.sub);
  }

  /** Updates allowed profile fields for authed user. */
  @ApiOperation({ summary: 'Update my profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @Patch('me')
  async updateProfile(@CurrentUser() user: JwtUser, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(user.sub, dto);
  }
}
