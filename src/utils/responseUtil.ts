import { Context } from 'hono';

export class ResponseUtility {
  static ok(data: any, message: string = 'Success') {
    return {
      status: 'success',
      message,
      data,
    };
  }

  static created(data: any, message: string = 'Created successfully') {
    return {
      status: 'success',
      message,
      data,
    };
  }

  static badRequest(message: string = 'Bad Request') {
    return {
      status: 'error',
      message,
    };
  }

  static unauthorized(message: string = 'Unauthorized') {
    return {
      status: 'error',
      message,
    };
  }

  static notFound(message: string = 'Not Found') {
    return {
      status: 'error',
      message,
    };
  }

  static internalServerError(message: string = 'Internal Server Error') {
    return {
      status: 'error',
      message,
    };
  }
} 