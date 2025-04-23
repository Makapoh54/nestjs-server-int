import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ResponseDto } from '../response';

interface ExceptionResponse<T> {
  message: T;
  error?: string;
  statusCode: number;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as
        | string
        | ExceptionResponse<string>;

      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message;

      response.status(exception.getStatus()).send({
        status: false,
        message,
        result: null,
      } as ResponseDto<null>);

      return;
    }

    this.logger.error(
      exception.message,
      exception.stack,
      AllExceptionFilter.name,
    );

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (response.raw.headersSent) {
      this.logger.error(
        'Headers already sent to client',
        exception.stack,
        AllExceptionFilter.name,
      );
      request.raw.destroy();
      response.raw.end();
      return;
    }

    response.status(statusCode).send({
      status: false,
      message: 'Internal server error',
      result: null,
    } as ResponseDto<null>);
  }
}