import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is null or undefined
        if (data === null || data === undefined) {
          return {
            success: true,
            data: {} as T,
            message: 'Operation completed successfully',
          };
        }

        // If data is already an envelope (has success property)
        if (typeof data === 'object' && 'success' in data) {
          return data;
        }

        // If data is formatted with data and meta properties explicitly returned
        if (
          typeof data === 'object' &&
          'data' in data &&
          ('meta' in data || 'message' in data)
        ) {
          return {
            success: true,
            data: data.data,
            meta: data.meta,
            message: data.message || 'Operation completed successfully',
          };
        }

        return {
          success: true,
          data,
          message: 'Operation completed successfully',
        };
      }),
    );
  }
}
