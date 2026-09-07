import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let mockPrismaService: { $queryRaw: jest.Mock };

  beforeEach(async () => {
    mockPrismaService = {
      $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status ok', () => {
    const result = controller.check();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('ims-api');
    expect(result.timestamp).toBeDefined();
  });

  it('should return database ready when connection succeeds', async () => {
    const result = await controller.readiness();
    expect(result.status).toBe('ok');
    expect(result.database).toBe('connected');
    expect(result.timestamp).toBeDefined();
  });

  it('should return degraded status when database query fails', async () => {
    mockPrismaService.$queryRaw.mockRejectedValueOnce(
      new Error('Connection timeout'),
    );

    const result = await controller.readiness();
    expect(result.status).toBe('degraded');
    expect(result.database).toBe('disconnected');
    expect(result.error).toBe('Connection timeout');
  });
});
