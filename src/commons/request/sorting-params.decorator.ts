import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FindOptionsOrderValue } from 'typeorm';

import { SortingParamsDto } from './request-params.dto';

export interface Sorting {
  property: string;
  direction: FindOptionsOrderValue;
}

export function isFieldAllowed(
  field: string,
  allowedFields: string[],
): boolean {
  return allowedFields.some((pattern) => {
    if (pattern === field) return true; // Exact match

    // Convert wildcard pattern to regex
    const regexPattern = pattern
      .replace('.', '\\.') // Escape dots
      .replace(/\*/g, '.*'); // Replace '*' with '.*' to match any subpath

    const regex = new RegExp(`^${regexPattern}$`); // Match entire string
    return regex.test(field);
  });
}

/**
 * Validates pagination query params and return processed sorting options.
 *
 * @param validFields valid of fields allowed to be sorted by
 * @param query sort param passed to url ?sort=tooltip:desc
 * @returns parsed sorting options: Sorting
 */
export const validateSortingParams = (
  validFields: string[],
  query: SortingParamsDto,
): { property: string; direction: FindOptionsOrderValue } => {
  const sort = query.sort;
  if (!sort) {
    return { property: '', direction: 'ASC' };
  }

  if (!Array.isArray(validFields)) {
    throw new BadRequestException('Invalid sort parameter list');
  }

  const sortPattern = /^([a-zA-Z0-9.]+):(asc|desc|ASC|DESC)$/;
  if (!sort.match(sortPattern)) {
    throw new BadRequestException('Invalid sort parameter');
  }

  const [property, direction] = sort.split(':') as [
    string,
    FindOptionsOrderValue,
  ];
  if (!isFieldAllowed(property, validFields)) {
    throw new BadRequestException(`Invalid sort property: ${property}`);
  }

  return { property, direction };
};

export const SortingParams = createParamDecorator(
  (validFields: string[], ctx: ExecutionContext): Sorting => {
    const req: FastifyRequest<{ Querystring: SortingParamsDto }> = ctx
      .switchToHttp()
      .getRequest();
    return validateSortingParams(validFields, req.query);
  },
);
