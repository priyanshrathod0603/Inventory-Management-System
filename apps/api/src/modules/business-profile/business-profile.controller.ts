import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { BusinessProfileService } from './business-profile.service';
import { CreateOnboardingDto, UpdateBusinessProfileDto, SaveOnboardingDraftDto } from './dto';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Business Profile & Onboarding')
@ApiCookieAuth('sms_session')
@UseGuards(SessionAuthGuard)
@Controller('business-profile')
export class BusinessProfileController {
  constructor(private readonly businessProfileService: BusinessProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user business profile and onboarding status' })
  @ApiResponse({ status: 200, description: 'Business profile and onboarding state retrieved' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.businessProfileService.getProfile(userId);
  }

  @Post('onboarding')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete business onboarding setup' })
  @ApiResponse({ status: 200, description: 'Business onboarding completed and account activated' })
  async completeOnboarding(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOnboardingDto,
  ) {
    return this.businessProfileService.completeOnboarding(userId, dto);
  }

  @Post('draft')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save onboarding draft progress for resuming later' })
  @ApiResponse({ status: 200, description: 'Onboarding draft saved' })
  async saveDraft(
    @CurrentUser('id') userId: string,
    @Body() dto: SaveOnboardingDraftDto,
  ) {
    return this.businessProfileService.saveDraft(userId, dto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update business profile and configuration from Settings' })
  @ApiResponse({ status: 200, description: 'Business profile updated' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateBusinessProfileDto,
  ) {
    return this.businessProfileService.updateProfile(userId, dto);
  }
}
