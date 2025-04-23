import { FindOptionsOrderValue } from 'typeorm';
import { Filtering, FilterRule, parseValue } from './filter-params.decorator';
import { Sorting } from './sorting-params.decorator';

export const getOrderClause = (
  sort: Sorting,
): { [key: string]: FindOptionsOrderValue } =>
  sort ? { [sort.property]: sort.direction } : {};

export const getWhereClause = (
  filter: Filtering,
): { [key: string]: { [key: string]: any } } | undefined => {
  if (!filter) return undefined;
  const parsedValue = parseValue(filter.value ?? '');

  switch (filter.rule as FilterRule) {
    case FilterRule.EQUALS:
      return { [filter.property]: { $eq: parsedValue } };

    case FilterRule.NOT_EQUALS:
      return { [filter.property]: { $not: { $eq: parsedValue } } };

    case FilterRule.GREATER_THAN:
      return { [filter.property]: { $gt: parsedValue } };

    case FilterRule.GREATER_THAN_OR_EQUALS:
      return { [filter.property]: { $gte: parsedValue } };

    case FilterRule.LESS_THAN:
      return { [filter.property]: { $lt: parsedValue } };

    case FilterRule.LESS_THAN_OR_EQUALS:
      return { [filter.property]: { $lte: parsedValue } };

    default:
      return undefined;
  }
};

export const getWhereClauseAggregation = (
  filter: Filtering,
): { [key: string]: { [key: string]: any } } => {
  if (!filter) return {};
  const parsedValue = parseValue(filter.value ?? '');

  switch (filter.rule as FilterRule) {
    case FilterRule.EQUALS:
      return { $eq: [`$${filter.property}`, parsedValue] };

    case FilterRule.NOT_EQUALS:
      return { $not: [{ $eq: [`$${filter.property}`, parsedValue] }] };

    case FilterRule.GREATER_THAN:
      return { $gt: [`$${filter.property}`, parsedValue] };

    case FilterRule.GREATER_THAN_OR_EQUALS:
      return { $gte: [`$${filter.property}`, parsedValue] };

    case FilterRule.LESS_THAN:
      return { $lt: [`$${filter.property}`, parsedValue] };

    case FilterRule.LESS_THAN_OR_EQUALS:
      return { $lte: [`$${filter.property}`, parsedValue] };

    default:
      return {};
  }
};
