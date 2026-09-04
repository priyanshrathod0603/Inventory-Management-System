import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationService } from './email-verification.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { MailService } from './mail.service';
import { BadRequestException } from '@nestjs/common';

describe('EmailVerificationService', () => {
  let service: EmailVerificationService;
  let prisma: PrismaService;
  let mailService: MailService;

  const mockPrisma = {
    emailVerificationToken: {
      updateMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    user: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  };

  const mockMailService = {
    sendVerificationEmail: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailVerificationService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<EmailVerificationService>(EmailVerificationService);
    prisma = module.get<PrismaService>(PrismaService);
    mailService = module.get<MailService>(MailService);
    jest.clearAllMocks();
  });

  it('should generate verification token and 6-digit OTP, and dispatch email', async () => {
    mockPrisma.emailVerificationToken.updateMany.mockResolvedValue({ count: 0 });
    mockPrisma.emailVerificationToken.create.mockResolvedValue({});

    const result = await service.createVerificationRequest('user-1', 'test@example.com');

    expect(result.token).toBeDefined();
    expect(result.token.length).toBe(96); // 48 bytes in hex
    expect(result.otpCode).toMatch(/^\d{6}$/);
    expect(mockPrisma.emailVerificationToken.create).toHaveBeenCalled();
    expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      token: result.token,
      otpCode: result.otpCode,
    });
  });

  it('should verify email successfully with valid token', async () => {
    const validRecord = {
      id: 'token-id-1',
      userId: 'user-1',
      email: 'test@example.com',
      token: 'valid-token',
      usedAt: null,
      expiresAt: new Date(Date.now() + 600000), // 10 min future
    };

    mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(validRecord);
    mockPrisma.emailVerificationToken.update.mockResolvedValue({});
    mockPrisma.user.update.mockResolvedValue({});

    const result = await service.verifyToken('valid-token');
    expect(result.success).toBe(true);
    expect(result.userId).toBe('user-1');
  });

  it('should throw BadRequestException for expired token', async () => {
    const expiredRecord = {
      id: 'token-id-1',
      userId: 'user-1',
      email: 'test@example.com',
      token: 'expired-token',
      usedAt: null,
      expiresAt: new Date(Date.now() - 600000), // in past
    };

    mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(expiredRecord);

    await expect(service.verifyToken('expired-token')).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for already used token', async () => {
    const usedRecord = {
      id: 'token-id-1',
      userId: 'user-1',
      email: 'test@example.com',
      token: 'used-token',
      usedAt: new Date(),
      expiresAt: new Date(Date.now() + 600000),
    };

    mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(usedRecord);

    await expect(service.verifyToken('used-token')).rejects.toThrow(BadRequestException);
  });

  it('should verify email successfully with valid 6-digit OTP', async () => {
    const validRecord = {
      id: 'token-id-1',
      userId: 'user-1',
      email: 'test@example.com',
      otpCode: '123456',
      usedAt: null,
      expiresAt: new Date(Date.now() + 600000),
    };

    mockPrisma.emailVerificationToken.findFirst.mockResolvedValue(validRecord);
    mockPrisma.emailVerificationToken.update.mockResolvedValue({});
    mockPrisma.user.update.mockResolvedValue({});

    const result = await service.verifyOtp('test@example.com', '123456');
    expect(result.success).toBe(true);
    expect(result.userId).toBe('user-1');
  });

  it('should reject invalid or nonexistent OTP', async () => {
    mockPrisma.emailVerificationToken.findFirst.mockResolvedValue(null);

    await expect(service.verifyOtp('test@example.com', '999999')).rejects.toThrow(
      BadRequestException,
    );
  });
});
