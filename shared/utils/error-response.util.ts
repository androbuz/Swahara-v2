import { IError } from '../types';

export class ErrorResponse extends IError {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
