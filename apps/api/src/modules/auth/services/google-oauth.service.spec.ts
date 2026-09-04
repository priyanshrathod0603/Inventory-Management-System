import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOAuthService } from './google-oauth.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('GoogleOAuthService', () => {
  let service: GoogleOAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleOAuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleOAuthService>(GoogleOAuthService);
  });

  it('should verify test mock Google token in dev/test environment', async () => {
    const result = await service.verifyIdToken('mock-google-token-alice@example.com');
    expect(result).toBeDefined();
    expect(result.email).toBe('alice@example.com');
    expect(result.googleId).toBe('google-sub-alice@example.com');
    expect(result.emailVerified).toBe(true);
  });

  it('should throw UnauthorizedException on empty token', async () => {
    await expect(service.verifyIdToken('')).rejects.toThrow(UnauthorizedException);
  });
});
