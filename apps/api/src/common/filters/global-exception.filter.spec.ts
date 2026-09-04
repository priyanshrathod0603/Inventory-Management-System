import { GlobalExceptionFilter } from './global-exception.filter';
import { HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockGetResponse: jest.Mock;
  let mockGetRequest: jest.Mock;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    mockGetRequest = jest.fn().mockReturnValue({
      method: 'GET',
      url: '/api/v1/test',
    });

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: mockGetRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should catch HttpException and return standard error envelope', () => {
    const exception = new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Forbidden resource',
      },
    });
  });

  it('should format validation errors from BadRequestException', () => {
    const exception = new BadRequestException({
      message: ['name should not be empty', 'sku must be a string'],
      error: 'Bad Request',
      statusCode: 400,
    });

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: [
          { message: 'name should not be empty' },
          { message: 'sku must be a string' },
        ],
      },
    });
  });

  it('should format Prisma P2002 unique constraint error as 409 Conflict', () => {
    const prismaError = {
      code: 'P2002',
      meta: { target: ['sku'] },
    };

    filter.catch(prismaError, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        message: 'A record with this sku already exists',
        details: { fields: ['sku'] },
      },
    });
  });

  it('should format unexpected errors as 500 without leaking stack traces', () => {
    const error = new Error('Database disk corrupted');
    filter.catch(error, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal server error occurred',
      },
    });
  });
});
