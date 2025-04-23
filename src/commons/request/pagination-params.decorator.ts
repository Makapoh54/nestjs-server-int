import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { PaginationParamsDto } from './request-params.dto';

export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

/**
 * Validates pagination query params and return processed pagination options.
 *
 * @param query pagination params passed to url, ?page=0&size=5
 * @returns parsed pagination options: Pagination
 */
export const validatePaginationParams = (
  query: PaginationParamsDto,
): Pagination => {
  const page = parseInt(query?.page);
  const size = parseInt(query?.size);

  if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
    throw new BadRequestException('Invalid pagination params');
  }
  if (size > 1000) {
    throw new BadRequestException(
      'Invalid pagination params: Max size is 1000',
    );
  }

  const limit = size;
  const offset = page * limit;
  return { page, limit, size, offset };
};

export const PaginationParams = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: FastifyRequest<{
      Querystring: PaginationParamsDto;
    }> = ctx.switchToHttp().getRequest();
    return validatePaginationParams(req.query);
  },
);
