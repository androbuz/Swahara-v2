export class IError extends Error {
  statusCode: number;
  path: string;
  errors: any;
}
