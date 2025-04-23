import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FilteringParamsDto } from './request-params.dto';
import { isFieldAllowed } from './sorting-params.decorator';

export interface Filtering {
  property: string;
  rule: string;
  value?: string;
}

export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
}

const isIsoDateString = (value: string): boolean =>
  !isNaN(Date.parse(value)) && /\d{4}-\d{2}-\d{2}T/.test(value);

export const parseValue = (value: string): string | number | Date => {
  if (!isNaN(Number(value))) return Number(value);
  if (isIsoDateString(value)) return new Date(value);
  return value;
};

export const validateFilteringParams = (
  validFields: string[],
  query: FilteringParamsDto,
): Filtering[] => {
  if (!Array.isArray(validFields)) {
    throw new BadRequestException('Invalid filter parameter list');
  }

  const filterString = query.filter;
  if (!filterString) return [];

  const filters = Array.isArray(filterString) ? filterString : [filterString];

  return filters.map((filter) => {
    if (!filter.match(/^[a-zA-Z0-9_.]+:(eq|neq|gt|gte|lt|lte):.+$/)) {
      throw new BadRequestException(
        `Invalid filter parameter: ${filter}; Allowed rules: ${Object.values(FilterRule).join(', ')}`,
      );
    }

    let filterValue = filter.split(':');
    if (filterValue.length > 3) {
      filterValue = [
        filterValue[0],
        filterValue[1],
        filterValue.slice(2).join(':'),
      ];
    }
    const [property, rule, value] = filterValue;
    if (!isFieldAllowed(property, validFields)) {
      throw new BadRequestException(`Invalid filter property: ${property}`);
    }
    if (!Object.values(FilterRule).includes(rule as FilterRule)) {
      throw new BadRequestException(
        `Invalid filter rule: ${rule}; Allowed rules: ${Object.values(FilterRule).join(', ')}`,
      );
    }

    return { property, rule, value };
  });
};

export const FilteringParams = createParamDecorator(
  (validFields: string[], ctx: ExecutionContext): Filtering[] => {
    const req: FastifyRequest<{ Querystring: FilteringParamsDto }> = ctx
      .switchToHttp()
      .getRequest();
    return validateFilteringParams(validFields, req.query);
  },
);
