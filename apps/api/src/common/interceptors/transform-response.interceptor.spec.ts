import { TransformResponseInterceptor } from './transform-response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformResponseInterceptor', () => {
  let interceptor: TransformResponseInterceptor<any>;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    interceptor = new TransformResponseInterceptor();
    mockExecutionContext = {} as ExecutionContext;
  });

  it('should wrap raw object data into success response envelope', (done) => {
    const rawData = { id: 'uuid-1', name: 'Product A' };
    const mockCallHandler: CallHandler = {
      handle: () => of(rawData),
    };

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          success: true,
          data: rawData,
          message: 'Operation completed successfully',
        });
        done();
      },
    });
  });

  it('should preserve paginated data and meta without double wrapping', (done) => {
    const paginatedData = {
      data: [{ id: '1' }, { id: '2' }],
      meta: { page: 1, limit: 25, total: 2, totalPages: 1 },
      message: 'Items retrieved',
    };
    const mockCallHandler: CallHandler = {
      handle: () => of(paginatedData),
    };

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual({
          success: true,
          data: [{ id: '1' }, { id: '2' }],
          meta: { page: 1, limit: 25, total: 2, totalPages: 1 },
          message: 'Items retrieved',
        });
        done();
      },
    });
  });

  it('should not alter already formatted response envelopes', (done) => {
    const alreadyFormatted = {
      success: true,
      data: { custom: 'value' },
      message: 'Custom message',
    };
    const mockCallHandler: CallHandler = {
      handle: () => of(alreadyFormatted),
    };

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: (result) => {
        expect(result).toEqual(alreadyFormatted);
        done();
      },
    });
  });
});
