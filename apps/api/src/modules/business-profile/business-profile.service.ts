import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOnboardingDto, UpdateBusinessProfileDto, SaveOnboardingDraftDto } from './dto';

@Injectable()
export class BusinessProfileService {
  private readonly logger = new Logger(BusinessProfileService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get the current user's business profile and onboarding status.
   */
  async getProfile(userId: string) {
    const profile = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return {
        isOnboardingCompleted: false,
        onboardingStep: 1,
        profile: null,
      };
    }

    return {
      isOnboardingCompleted: profile.isOnboardingCompleted,
      onboardingStep: profile.onboardingStep,
      profile,
    };
  }

  /**
   * Save onboarding progress draft (resumable onboarding).
   */
  async saveDraft(userId: string, dto: SaveOnboardingDraftDto) {
    const profile = await this.prisma.businessProfile.upsert({
      where: { userId },
      create: {
        userId,
        businessName: dto.businessName || 'My Business',
        businessType: dto.businessType || 'GENERAL_STORE',
        customBusinessType: dto.customBusinessType,
        ownerName: dto.ownerName,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        email: dto.email,
        website: dto.website,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country || 'India',
        postalCode: dto.postalCode,
        isGstRegistered: dto.isGstRegistered || false,
        gstin: dto.gstin,
        currency: dto.currency || 'INR',
        currencySymbol: dto.currencySymbol || '₹',
        isMultiWarehouse: dto.isMultiWarehouse || false,
        isOnboardingCompleted: false,
        onboardingStep: dto.onboardingStep || 1,
      },
      update: {
        businessName: dto.businessName,
        businessType: dto.businessType,
        customBusinessType: dto.customBusinessType,
        ownerName: dto.ownerName,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        email: dto.email,
        website: dto.website,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        postalCode: dto.postalCode,
        isGstRegistered: dto.isGstRegistered,
        gstin: dto.gstin,
        currency: dto.currency,
        currencySymbol: dto.currencySymbol,
        isMultiWarehouse: dto.isMultiWarehouse,
        onboardingStep: dto.onboardingStep,
      },
    });

    return {
      message: 'Onboarding draft saved successfully',
      isOnboardingCompleted: false,
      onboardingStep: profile.onboardingStep,
      profile,
    };
  }

  /**
   * Complete business onboarding and activate the account for full operational use.
   */
  async completeOnboarding(userId: string, dto: CreateOnboardingDto) {
    const profile = await this.prisma.$transaction(async (tx: any) => {
      // 1. Create or update BusinessProfile
      const savedProfile = await tx.businessProfile.upsert({
        where: { userId },
        create: {
          userId,
          businessName: dto.businessName.trim(),
          businessType: dto.businessType,
          customBusinessType: dto.customBusinessType?.trim() || null,
          ownerName: dto.ownerName?.trim() || null,
          phone: dto.phone?.trim() || null,
          whatsapp: dto.whatsapp?.trim() || null,
          email: dto.email?.trim() || null,
          website: dto.website?.trim() || null,
          address: dto.address?.trim() || null,
          city: dto.city?.trim() || null,
          state: dto.state?.trim() || null,
          country: dto.country?.trim() || 'India',
          postalCode: dto.postalCode?.trim() || null,
          isGstRegistered: Boolean(dto.isGstRegistered),
          gstin: dto.gstin?.trim() || null,
          currency: dto.currency?.trim() || 'INR',
          currencySymbol: dto.currencySymbol?.trim() || '₹',
          isMultiWarehouse: Boolean(dto.isMultiWarehouse),
          isOnboardingCompleted: true,
          onboardingStep: 4,
        },
        update: {
          businessName: dto.businessName.trim(),
          businessType: dto.businessType,
          customBusinessType: dto.customBusinessType?.trim() || null,
          ownerName: dto.ownerName?.trim() || null,
          phone: dto.phone?.trim() || null,
          whatsapp: dto.whatsapp?.trim() || null,
          email: dto.email?.trim() || null,
          website: dto.website?.trim() || null,
          address: dto.address?.trim() || null,
          city: dto.city?.trim() || null,
          state: dto.state?.trim() || null,
          country: dto.country?.trim() || 'India',
          postalCode: dto.postalCode?.trim() || null,
          isGstRegistered: Boolean(dto.isGstRegistered),
          gstin: dto.gstin?.trim() || null,
          currency: dto.currency?.trim() || 'INR',
          currencySymbol: dto.currencySymbol?.trim() || '₹',
          isMultiWarehouse: Boolean(dto.isMultiWarehouse),
          isOnboardingCompleted: true,
          onboardingStep: 4,
        },
      });

      // 2. Ensure at least one default warehouse exists for the business
      const existingWarehouse = await tx.warehouse.findFirst({
        where: { isActive: true },
      });

      if (!existingWarehouse) {
        await tx.warehouse.create({
          data: {
            name: `${dto.businessName.trim()} - Main Store`,
            code: 'WH-01',
            address: dto.address?.trim() || `${dto.city || 'Main'} Branch`,
            isDefault: true,
            isActive: true,
          },
        });
      }

      return savedProfile;
    });

    this.logger.log(`User ${userId} completed business onboarding for "${profile.businessName}" (${profile.businessType})`);

    return {
      message: 'Business onboarding completed successfully',
      isOnboardingCompleted: true,
      profile,
    };
  }

  /**
   * Update business profile and settings from the Settings page.
   */
  async updateProfile(userId: string, dto: UpdateBusinessProfileDto) {
    const existing = await this.prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Business profile not found. Please complete onboarding first.');
    }

    const updated = await this.prisma.businessProfile.update({
      where: { userId },
      data: {
        ...(dto.businessName !== undefined && { businessName: dto.businessName.trim() }),
        ...(dto.businessType !== undefined && { businessType: dto.businessType }),
        ...(dto.customBusinessType !== undefined && { customBusinessType: dto.customBusinessType?.trim() || null }),
        ...(dto.ownerName !== undefined && { ownerName: dto.ownerName?.trim() || null }),
        ...(dto.phone !== undefined && { phone: dto.phone?.trim() || null }),
        ...(dto.whatsapp !== undefined && { whatsapp: dto.whatsapp?.trim() || null }),
        ...(dto.email !== undefined && { email: dto.email?.trim() || null }),
        ...(dto.website !== undefined && { website: dto.website?.trim() || null }),
        ...(dto.address !== undefined && { address: dto.address?.trim() || null }),
        ...(dto.city !== undefined && { city: dto.city?.trim() || null }),
        ...(dto.state !== undefined && { state: dto.state?.trim() || null }),
        ...(dto.country !== undefined && { country: dto.country?.trim() || 'India' }),
        ...(dto.postalCode !== undefined && { postalCode: dto.postalCode?.trim() || null }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl?.trim() || null }),
        ...(dto.isGstRegistered !== undefined && { isGstRegistered: dto.isGstRegistered }),
        ...(dto.gstin !== undefined && { gstin: dto.gstin?.trim() || null }),
        ...(dto.taxNumber !== undefined && { taxNumber: dto.taxNumber?.trim() || null }),
        ...(dto.currency !== undefined && { currency: dto.currency?.trim() || 'INR' }),
        ...(dto.currencySymbol !== undefined && { currencySymbol: dto.currencySymbol?.trim() || '₹' }),
        ...(dto.isMultiWarehouse !== undefined && { isMultiWarehouse: dto.isMultiWarehouse }),
      },
    });

    return {
      message: 'Business profile updated successfully',
      profile: updated,
    };
  }
}
