import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOAuthService } from './google-oauth.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ServiceUnavailableException } from '@nestjs/common';

// Mock the google-auth-library OAuth2Client
jest.mock('google-auth-library', () => {
  const mockVerifyIdToken = jest.fn();
  const mockGetToken = jest.fn();
  const mockGenerateAuthUrl = jest.fn();

  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
      getToken: mockGetToken,
      generateAuthUrl: mockGenerateAuthUrl,
    })),
    __mockVerifyIdToken: mockVerifyIdToken,
    __mockGetToken: mockGetToken,
    __mockGenerateAuthUrl: mockGenerateAuthUrl,
  };
});

const googleAuthLibrary = require('google-auth-library');

describe('GoogleOAuthService', () => {
  let service: GoogleOAuthService;
  let configService: ConfigService;

  const mockConfigValues: Record<string, any> = {
    GOOGLE_CLIENT_ID: null,
    GOOGLE_CLIENT_SECRET: null,
    GOOGLE_CALLBACK_URL: null,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleOAuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => mockConfigValues[key] ?? null),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleOAuthService>(GoogleOAuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('verifyIdToken', () => {
    it('should throw UnauthorizedException on empty token', async () => {
      await expect(service.verifyIdToken('')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ServiceUnavailableException if GOOGLE_CLIENT_ID is not configured', async () => {
      await expect(service.verifyIdToken('some-token')).rejects.toThrow(
        ServiceUnavailableException,
      );
    });

    it('should throw UnauthorizedException when verifyIdToken rejects (invalid token)', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('mock-client-id');
      googleAuthLibrary.__mockVerifyIdToken.mockRejectedValue(new Error('Token invalid'));

      await expect(service.verifyIdToken('invalid-google-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return verified user profile when token is valid', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('mock-client-id');

      const mockPayload = {
        sub: 'google-sub-123',
        email: 'user@gmail.com',
        name: 'Test User',
        picture: 'https://avatar.url/photo.jpg',
        email_verified: true,
        iss: 'https://accounts.google.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        aud: 'mock-client-id',
      };

      googleAuthLibrary.__mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockPayload,
      });

      const result = await service.verifyIdToken('valid-google-id-token');

      expect(result.googleId).toBe('google-sub-123');
      expect(result.email).toBe('user@gmail.com');
      expect(result.fullName).toBe('Test User');
      expect(result.emailVerified).toBe(true);
    });

    it('should reject token with invalid issuer', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('mock-client-id');

      const mockPayload = {
        sub: 'google-sub-123',
        email: 'user@gmail.com',
        name: 'Test User',
        email_verified: true,
        iss: 'https://evil.com', // Invalid issuer
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      googleAuthLibrary.__mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockPayload,
      });

      await expect(service.verifyIdToken('tampered-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('generateAuthUrl', () => {
    it('should throw ServiceUnavailableException if OAuth not fully configured', () => {
      expect(() => service.generateAuthUrl('random-state')).toThrow(
        ServiceUnavailableException,
      );
    });

    it('should return a Google auth URL when fully configured', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        const values: Record<string, string> = {
          GOOGLE_CLIENT_ID: 'client-id',
          GOOGLE_CLIENT_SECRET: 'client-secret',
          GOOGLE_CALLBACK_URL: 'http://localhost:3001/api/v1/auth/google/callback',
        };
        return values[key] ?? null;
      });

      googleAuthLibrary.__mockGenerateAuthUrl.mockReturnValue('https://accounts.google.com/o/oauth2/auth?...');

      const url = service.generateAuthUrl('test-state-value');
      expect(url).toContain('accounts.google.com');
      expect(googleAuthLibrary.__mockGenerateAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({ state: 'test-state-value' }),
      );
    });
  });

  describe('isConfigured', () => {
    it('should return false when configuration is missing', () => {
      expect(service.isConfigured()).toBe(false);
    });

    it('should return true when all Google env vars are set', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        const values: Record<string, string> = {
          GOOGLE_CLIENT_ID: 'client-id',
          GOOGLE_CLIENT_SECRET: 'client-secret',
          GOOGLE_CALLBACK_URL: 'http://localhost:3001/api/v1/auth/google/callback',
        };
        return values[key] ?? null;
      });
      expect(service.isConfigured()).toBe(true);
    });
  });
});
