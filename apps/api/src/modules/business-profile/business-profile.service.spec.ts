import { Test, TestingModule } from '@nestjs/testing';
import { BusinessProfileService } from './business-profile.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('BusinessProfileService', () => {
  let service: BusinessProfileService;
  let prisma: PrismaService;

  const mockPrismaService: any = {
    businessProfile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    warehouse: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn((callback: (tx: any) => any) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessProfileService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BusinessProfileService>(BusinessProfileService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return default incomplete state if no profile exists', async () => {
      mockPrismaService.businessProfile.findUnique.mockResolvedValue(null);

      const result = await service.getProfile('user-1');

      expect(result.isOnboardingCompleted).toBe(false);
      expect(result.onboardingStep).toBe(1);
      expect(result.profile).toBeNull();
    });

    it('should return profile with completion state if exists', async () => {
      mockPrismaService.businessProfile.findUnique.mockResolvedValue({
        id: 'bp-1',
        userId: 'user-1',
        businessName: 'Sharma Grocery',
        businessType: 'GROCERY',
        isOnboardingCompleted: true,
        onboardingStep: 4,
      });

      const result = await service.getProfile('user-1');

      expect(result.isOnboardingCompleted).toBe(true);
      expect(result.profile?.businessName).toBe('Sharma Grocery');
    });
  });

  describe('completeOnboarding', () => {
    it('should upsert profile, create default warehouse if missing, and return completion state', async () => {
      const mockSavedProfile = {
        id: 'bp-1',
        userId: 'user-1',
        businessName: 'Royal Footwear',
        businessType: 'FOOTWEAR',
        isOnboardingCompleted: true,
        onboardingStep: 4,
      };

      mockPrismaService.businessProfile.upsert.mockResolvedValue(mockSavedProfile);
      mockPrismaService.warehouse.findFirst.mockResolvedValue(null);
      mockPrismaService.warehouse.create.mockResolvedValue({ id: 'wh-1', code: 'WH-01' });

      const result = await service.completeOnboarding('user-1', {
        businessName: 'Royal Footwear',
        businessType: 'FOOTWEAR',
        phone: '9876543210',
        isGstRegistered: false,
      });

      expect(result.isOnboardingCompleted).toBe(true);
      expect(result.profile.businessName).toBe('Royal Footwear');
      expect(mockPrismaService.warehouse.create).toHaveBeenCalled();
    });

    it('should support multiple selected business types joined as comma-separated string', async () => {
      const multiType = 'GROCERY,FOOTWEAR,CLOTHING';
      const mockSavedProfile = {
        id: 'bp-2',
        userId: 'user-2',
        businessName: 'Metro MegaMart',
        businessType: multiType,
        isOnboardingCompleted: true,
        onboardingStep: 4,
      };

      mockPrismaService.businessProfile.upsert.mockResolvedValue(mockSavedProfile);
      mockPrismaService.warehouse.findFirst.mockResolvedValue({ id: 'wh-1' });

      const result = await service.completeOnboarding('user-2', {
        businessName: 'Metro MegaMart',
        businessType: multiType,
        isGstRegistered: false,
      });

      expect(result.isOnboardingCompleted).toBe(true);
      expect(result.profile.businessType).toBe('GROCERY,FOOTWEAR,CLOTHING');
    });
  });

  describe('saveDraft', () => {
    it('should save draft progress without marking onboarding completed', async () => {
      mockPrismaService.businessProfile.upsert.mockResolvedValue({
        id: 'bp-1',
        userId: 'user-1',
        businessName: 'Urban Furniture',
        businessType: 'FURNITURE',
        isOnboardingCompleted: false,
        onboardingStep: 2,
      });

      const result = await service.saveDraft('user-1', {
        businessName: 'Urban Furniture',
        businessType: 'FURNITURE',
        onboardingStep: 2,
      });

      expect(result.isOnboardingCompleted).toBe(false);
      expect(result.onboardingStep).toBe(2);
    });
  });
});
