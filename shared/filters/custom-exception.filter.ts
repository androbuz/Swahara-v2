import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IError } from '../types';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: HttpException | IError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR);

    let validation_errors: string[] | null = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (exceptionResponse && typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, unknown>;

        if ('message' in responseObj && Array.isArray(responseObj.message)) {
          validation_errors = responseObj.message as string[];
        }
      }
    }

    // Log the error for tracking in all environments
    const timestamp = new Date().toISOString();
    const errorMessage = validation_errors
      ? 'Validation failed'
      : exception.message || 'Internal Server Error';
    const errorLog = {
      timestamp,
      path: request.url,
      method: request.method,
      statusCode: status,
      message: errorMessage,
      ...(validation_errors ? { validation_errors } : {}),
      stack: exception.stack,
      body: request.body as unknown,
      query: request.query,
      headers: request.headers,
    };

    if (status >= Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
      this.logger.error(
        `[${timestamp}] [${request.method}] ${request.url} - ${status}: ${errorMessage}`,
        exception.stack,
        'CustomExceptionFilter',
      );
    } else if (status >= Number(HttpStatus.BAD_REQUEST)) {
      this.logger.warn(
        `[${timestamp}] [${request.method}] ${request.url} - ${status}: ${errorMessage}`,
        JSON.stringify(errorLog),
        'CustomExceptionFilter',
      );
    } else {
      this.logger.log(
        `[${timestamp}] [${request.method}] ${request.url} - ${status}: ${errorMessage}`,
        'CustomExceptionFilter',
      );
    }

    if (process.env.NODE_ENV == 'dev') {
      response.status(status).json({
        success: false,
        error: exception,
        message: validation_errors ? 'Validation failed' : exception.message,
        ...(validation_errors ? { validation_errors } : {}),
        timestamp: new Date().toISOString(),
        path: request.url,
        stack: exception.stack,
      });
    } else {
      response.status(status).json({
        success: false,
        message: validation_errors
          ? 'Validation failed'
          : exception.message || 'Internal Server Error',
        ...(validation_errors ? { validation_errors } : {}),
      });
    }
  }
}
