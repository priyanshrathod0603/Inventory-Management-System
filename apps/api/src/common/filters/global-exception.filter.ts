import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected internal server error occurred';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        code = this.getErrorCodeFromStatus(status);
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resObj = exceptionResponse as Record<string, any>;
        message = resObj.message || exception.message;
        code = resObj.code || this.getErrorCodeFromStatus(status);

        // Handle class-validator validation error arrays
        if (Array.isArray(resObj.message)) {
          code = 'VALIDATION_ERROR';
          message = 'Validation failed';
          details = resObj.message.map((msg: string) => ({
            message: msg,
          }));
        } else if (resObj.details) {
          details = resObj.details;
        }
      }
    } else if (this.isPrismaError(exception)) {
      const prismaResult = this.handlePrismaError(exception);
      status = prismaResult.status;
      code = prismaResult.code;
      message = prismaResult.message;
      details = prismaResult.details;
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled Exception on [${request.method}] ${request.url}: ${exception.message}`,
        exception.stack,
      );
    }

    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    };

    response.status(status).json(errorPayload);
  }

  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }

  private isPrismaError(exception: any): boolean {
    return (
      exception &&
      typeof exception === 'object' &&
      (exception.constructor?.name?.startsWith('PrismaClient') ||
        typeof exception.code === 'string')
    );
  }

  private handlePrismaError(error: any): {
    status: number;
    code: string;
    message: string;
    details?: any;
  } {
    switch (error.code) {
      case 'P2002': {
        const target = error.meta?.target;
        return {
          status: HttpStatus.CONFLICT,
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          message: `A record with this ${Array.isArray(target) ? target.join(', ') : 'unique identifier'} already exists`,
          details: { fields: target },
        };
      }
      case 'P2025': {
        return {
          status: HttpStatus.NOT_FOUND,
          code: 'RECORD_NOT_FOUND',
          message: error.meta?.cause || 'The requested resource was not found',
        };
      }
      case 'P2003': {
        return {
          status: HttpStatus.BAD_REQUEST,
          code: 'FOREIGN_KEY_VIOLATION',
          message: 'Referenced related record does not exist',
        };
      }
      default: {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'DATABASE_ERROR',
          message: 'A database error occurred while processing the request',
        };
      }
    }
  }
}
