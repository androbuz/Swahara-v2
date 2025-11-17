import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from './error-response.util';

export type PaginationData = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type SuccessResponse<T> = {
  success: true;
  message: string;
  result: T;
};

export class SuccessResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty()
  result: T;
}

export class ResponseUtil {
  static success<T>(message: string, result: T): SuccessResponse<T> {
    return {
      success: true,
      message,
      result,
    };
  }

  static paginated<T>(
    message: string,
    pagination: Omit<
      PaginationData,
      'totalPages' | 'hasNextPage' | 'hasPreviousPage'
    >,
    data: T[],
  ): SuccessResponse<{ pagination: PaginationData; data: T[] }> {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const hasNextPage =
      pagination.page * pagination.pageSize < pagination.total;
    const hasPreviousPage = pagination.page > 1;

    return {
      success: true,
      message,
      result: {
        pagination: {
          ...pagination,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
        data,
      },
    };
  }

  static throwError(message: string, statusCode: HttpStatus): never {
    throw new ErrorResponse(message, statusCode);
  }

  static handleError(error: unknown): never {
    if (error instanceof ErrorResponse || error instanceof HttpException) {
      const message = error.message;
      const statusCode =
        error instanceof ErrorResponse ? error.statusCode : error.getStatus();
      throw new ErrorResponse(message, statusCode);
    }

    throw new ErrorResponse(
      'Something went wrong. Please retry later',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static extractErrorMessage(error: unknown): string {
    try {
      this.handleError(error);
    } catch (e) {
      if (e instanceof Error) {
        return e.message;
      }
      return 'An unknown error occurred';
    }
  }
}
