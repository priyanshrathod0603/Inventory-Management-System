import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    googleLogin: jest.fn(),
    verifyEmailLink: jest.fn(),
    verifyEmailOtp: jest.fn(),
    resendVerification: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    logout: jest.fn(),
    getMe: jest.fn(),
  };

  const mockSessionService = {
    validateSession: jest.fn(),
    revokeSession: jest.fn(),
    clearSessionCookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('should call register with DTO', async () => {
    const dto = {
      fullName: 'Rahul Sharma',
      email: 'rahul@example.com',
      username: 'rahul_c',
      password: 'Password123!',
    };
    mockAuthService.register.mockResolvedValue({ message: 'OK', userId: 'u1' } as any);

    const result = await controller.register(dto);
    expect(result).toEqual({ message: 'OK', userId: 'u1' });
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });

  it('should call login with DTO and request/response objects', async () => {
    const dto = { identifier: 'rahul_c', password: 'Password123!' };
    const mockReq: any = { ip: '127.0.0.1', headers: {} };
    const mockRes: any = {};

    mockAuthService.login.mockResolvedValue({ user: {}, message: 'Login successful' } as any);

    const result = await controller.login(dto, mockReq, mockRes);
    expect(result.message).toBe('Login successful');
    expect(mockAuthService.login).toHaveBeenCalledWith(dto, mockReq, mockRes);
  });

  it('should call logout and clear session', async () => {
    const mockReq: any = { sessionId: 'sess-123' };
    const mockRes: any = {};
    mockAuthService.logout.mockResolvedValue({ message: 'Logged out successfully' } as any);

    const result = await controller.logout(mockReq, mockRes);
    expect(result.message).toBe('Logged out successfully');
    expect(mockAuthService.logout).toHaveBeenCalledWith('sess-123', mockRes);
  });

  it('should call getMe with current user ID', async () => {
    mockAuthService.getMe.mockResolvedValue({ id: 'u1', username: 'rahul' } as any);

    const result = await controller.getMe('u1');
    expect(result.username).toBe('rahul');
    expect(mockAuthService.getMe).toHaveBeenCalledWith('u1');
  });
});
