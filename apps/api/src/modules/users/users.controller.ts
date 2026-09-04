import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiCookieAuth('sms_session')
@UseGuards(SessionAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get profile of current authenticated user' })
  @ApiResponse({ status: 200, description: 'Profile returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMyProfile(@CurrentUser() user: any) {
    return this.usersService.getUserById(user.id, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by ID (Strict IDOR Protected)' })
  @ApiResponse({ status: 200, description: 'User profile returned.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot access other users without permission.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(
    @Param('id', ParseUUIDPipe) targetUserId: string,
    @CurrentUser() requestingUser: any,
  ) {
    return this.usersService.getUserById(targetUserId, requestingUser);
  }
}
