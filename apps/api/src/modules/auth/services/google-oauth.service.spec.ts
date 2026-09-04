import { Test, TestingModule } from '@nestjs/testing';
import { GoogleOAuthService } from './google-oauth.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ServiceUnavailableException } from '@nestjs/common';

describe('GoogleOAuthService', () => {
  let service: GoogleOAuthService;
  let configService: ConfigService;

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
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should throw ServiceUnavailableException if GOOGLE_CLIENT_ID is not configured', async () => {
    jest.spyOn(configService, 'get').mockReturnValue(null);
    await expect(service.verifyIdToken('mock-google-token-alice@example.com')).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('should throw UnauthorizedException on empty token', async () => {
    await expect(service.verifyIdToken('')).rejects.toThrow(UnauthorizedException);
  });

  it('should reject mock tokens and fail verification when configured', async () => {
    jest.spyOn(configService, 'get').mockReturnValue('mock-client-id');
    
    // global.fetch is usually undefined in basic jest unless mocked or running on newer node
    // We expect it to try to fetch and fail, throwing UnauthorizedException
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
    });
    
    await expect(service.verifyIdToken('mock-google-token-alice@example.com')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
