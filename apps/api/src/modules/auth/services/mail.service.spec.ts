import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;

  const mockSendMail = jest.fn();
  const mockTransporter = {
    sendMail: mockSendMail,
  };

  const mockConfigValues: Record<string, any> = {
    SMTP_HOST: 'smtp.resend.com',
    SMTP_PORT: 587,
    SMTP_USER: 'resend',
    SMTP_PASS: 're_mock_test_key',
    EMAIL_FROM: 'Stock Management System <noreply@example.com>',
    FRONTEND_URL: 'http://localhost:3000',
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      return mockConfigValues[key] !== undefined ? mockConfigValues[key] : defaultValue;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should initialize Nodemailer transporter with environment variables', () => {
    const transporter = service.getTransporter();

    expect(transporter).toBeDefined();
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: 're_mock_test_key',
      },
    });
  });

  it('should send verification email with OTP, verification link, and correct recipient', async () => {
    mockSendMail.mockResolvedValue({ messageId: 'msg-12345' });

    const result = await service.sendVerificationEmail({
      to: 'rahul@example.com',
      token: 'abcd1234efgh5678',
      otpCode: '481920',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('msg-12345');
    expect(mockSendMail).toHaveBeenCalledTimes(1);

    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.to).toBe('rahul@example.com');
    expect(mailOptions.from).toBe('Stock Management System <noreply@example.com>');
    expect(mailOptions.subject).toContain('Verify your email address');

    // Verify OTP is present in both text and html
    expect(mailOptions.text).toContain('481920');
    expect(mailOptions.html).toContain('481920');

    // Verify existing verification link contract: /verify-email?token=<token>&email=<email>
    const expectedLink =
      'http://localhost:3000/verify-email?token=abcd1234efgh5678&email=rahul%40example.com';
    expect(mailOptions.text).toContain(expectedLink);
    expect(mailOptions.html).toContain(expectedLink);
  });

  it('should handle missing SMTP configuration gracefully without throwing', async () => {
    const emptyConfigService = {
      get: jest.fn(() => undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: emptyConfigService,
        },
      ],
    }).compile();

    const unconfiguredService = module.get<MailService>(MailService);
    const result = await unconfiguredService.sendVerificationEmail({
      to: 'test@example.com',
      token: 'tok-123',
      otpCode: '112233',
    });

    expect(result.success).toBe(false);
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it('should catch and log SMTP transport errors safely without crashing', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP Connection timeout'));

    const result = await service.sendVerificationEmail({
      to: 'user@example.com',
      token: 'tok-xyz',
      otpCode: '654321',
    });

    expect(result.success).toBe(false);
  });
});
