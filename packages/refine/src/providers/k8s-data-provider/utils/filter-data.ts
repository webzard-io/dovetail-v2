import { CrudFilters, CrudOperators, LogicalFilter } from '@refinedev/core';
import { get } from 'lodash-es';

export const filterData = (filters: CrudFilters, data: any[]): any[] => {
  if (!filters || filters.length === 0) {
    return data;
  }

  return data.filter((item) => {
    return filters.every((filter) => {
      if ('field' in filter) {
        // Logical filter
        const { field, operator, value } = filter;
        return evaluateFilter(item, field, operator, value);
      } else {
        // Conditional filter
        const { operator, value } = filter;
        if (operator === 'or') {
          return value.some((subFilter) => {
            const { field, operator, value } = subFilter as LogicalFilter;
            return evaluateFilter(item, field, operator, value);
          });
        } else if (operator === 'and') {
          return value.every((subFilter) => {
            const { field, operator, value } = subFilter as LogicalFilter;
            return evaluateFilter(item, field, operator, value);
          });
        }
      }
      return true;
    });
  });
};

function evaluateFilter(
  item: any,
  field: string,
  operator: CrudOperators,
  value: any
): boolean {
  const fieldValue = get(item, field);

  switch (operator) {
    case 'eq':
      return fieldValue === value;
    case 'ne':
      return fieldValue !== value;
    case 'lt':
      return fieldValue < value;
    case 'gt':
      return fieldValue > value;
    case 'lte':
      return fieldValue <= value;
    case 'gte':
      return fieldValue >= value;
    case 'in':
      return value.includes(fieldValue);
    case 'nin':
      return !value.includes(fieldValue);
    case 'contains':
      return fieldValue.includes(value);
    case 'ncontains':
      return !fieldValue.includes(value);
    case 'containss':
      return fieldValue.toLowerCase().includes(value.toLowerCase());
    case 'ncontainss':
      return !fieldValue.toLowerCase().includes(value.toLowerCase());
    case 'between':
      return value[0] <= fieldValue && fieldValue <= value[1];
    case 'nbetween':
      return value[0] > fieldValue || fieldValue > value[1];
    case 'null':
      return fieldValue === null;
    case 'nnull':
      return fieldValue !== null;
    case 'startswith':
      return fieldValue.startsWith(value);
    case 'nstartswith':
      return !fieldValue.startsWith(value);
    case 'startswiths':
      return fieldValue.toLowerCase().startsWith(value.toLowerCase());
    case 'nstartswiths':
      return !fieldValue.toLowerCase().startsWith(value.toLowerCase());
    case 'endswith':
      return fieldValue.endsWith(value);
    case 'nendswith':
      return !fieldValue.endsWith(value);
    case 'endswiths':
      return fieldValue.toLowerCase().endsWith(value.toLowerCase());
    case 'nendswiths':
      return !fieldValue.toLowerCase().endsWith(value.toLowerCase());
    default:
      return true;
  }
}
