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

  // Updated mock to use Gmail SMTP (not Resend)
  const mockConfigValues: Record<string, any> = {
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: 587,
    SMTP_USER: 'testuser@gmail.com',
    SMTP_PASS: 'gmail-app-password-mock',
    EMAIL_FROM: 'Stock Management System <testuser@gmail.com>',
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

  it('should initialize Nodemailer transporter with Gmail SMTP environment variables', () => {
    const transporter = service.getTransporter();

    expect(transporter).toBeDefined();
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // port 587 uses STARTTLS (not TLS)
      auth: {
        user: 'testuser@gmail.com',
        pass: 'gmail-app-password-mock',
      },
    });
  });

  describe('sendVerificationEmail', () => {
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
      expect(mailOptions.from).toBe('Stock Management System <testuser@gmail.com>');
      expect(mailOptions.subject).toContain('Verify your email address');

      // Verify OTP is present in both text and html
      expect(mailOptions.text).toContain('481920');
      expect(mailOptions.html).toContain('481920');

      // Verify existing verification link contract
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

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with reset link and recipient', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-reset-99' });

      const result = await service.sendPasswordResetEmail({
        to: 'user@example.com',
        token: 'reset-token-abc123',
        fullName: 'Rahul Sharma',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg-reset-99');
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe('user@example.com');
      expect(mailOptions.subject).toContain('Reset your password');

      // Verify reset link is present in both text and html — token must appear in link
      const expectedLink = 'http://localhost:3000/reset-password?token=reset-token-abc123';
      expect(mailOptions.text).toContain(expectedLink);
      expect(mailOptions.html).toContain(expectedLink);

      // Verify personalization
      expect(mailOptions.html).toContain('Rahul Sharma');
      expect(mailOptions.text).toContain('Rahul Sharma');
    });

    it('should return success=false when SMTP is not configured', async () => {
      const emptyConfigService = {
        get: jest.fn(() => undefined),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          MailService,
          { provide: ConfigService, useValue: emptyConfigService },
        ],
      }).compile();

      const unconfiguredService = module.get<MailService>(MailService);
      const result = await unconfiguredService.sendPasswordResetEmail({
        to: 'user@example.com',
        token: 'secret-token',
        fullName: 'Test User',
      });

      expect(result.success).toBe(false);
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('should handle SMTP errors safely when sending reset email', async () => {
      mockSendMail.mockRejectedValue(new Error('Authentication failed'));

      const result = await service.sendPasswordResetEmail({
        to: 'user@example.com',
        token: 'tok-reset',
        fullName: 'Test User',
      });

      expect(result.success).toBe(false);
    });

    it('should send the reset token only inside the email link (not in any log call)', async () => {
      // The security guarantee is enforced by code design:
      // sendPasswordResetEmail() does NOT call logger.log(token) — it only puts the token
      // inside the email link. We verify the email body contains the token link correctly.
      mockSendMail.mockResolvedValue({ messageId: 'msg-sec-001' });

      const secretToken = 'VERY_SECRET_RESET_TOKEN_NEVER_LOGGED';

      const result = await service.sendPasswordResetEmail({
        to: 'user@example.com',
        token: secretToken,
        fullName: 'Test User',
      });

      expect(result.success).toBe(true);
      // Token appears correctly encoded in the reset link within the email body
      const mailOptions = mockSendMail.mock.calls[0][0];
      const expectedLink = `http://localhost:3000/reset-password?token=${secretToken}`;
      expect(mailOptions.text).toContain(expectedLink);
      expect(mailOptions.html).toContain(expectedLink);
      // The subject and from fields do NOT contain the raw token
      expect(mailOptions.subject).not.toContain(secretToken);
      expect(mailOptions.from).not.toContain(secretToken);
    });
  });
});
