import { CrudFilters, useParsed } from '@refinedev/core';
import { useMemo } from 'react';
import { useNamespacesFilter, ALL_NS } from 'src/components/NamespacesFilter';

export const NAME_KEYWORD_PARAM = 'name_keyword';

interface UseRefineFiltersOptions {
  disableNamespaceFilter?: boolean;
  disableNameKeywordFilter?: boolean;
}

export function useRefineFilters(options: UseRefineFiltersOptions = {}) {
  const {
    disableNamespaceFilter = false,
    disableNameKeywordFilter = false,
  } = options;

  // Namespace filter logic
  const { value: nsFilters = [] } = useNamespacesFilter();
  const namespaceFilters = useMemo(() => {
    if (disableNamespaceFilter) {
      return [];
    }

    const filters = nsFilters.filter(filter => filter !== ALL_NS);
    if (filters.length === 0) {
      return [];
    }

    return [
      {
        operator: 'or',
        value: filters.map(filter => ({
          field: 'metadata.namespace',
          operator: 'eq',
          value: filter,
        })),
      },
    ] as CrudFilters;
  }, [nsFilters, disableNamespaceFilter]);

  // Name keyword filter logic
  const { params } = useParsed();
  const nameKeyword = params?.[NAME_KEYWORD_PARAM];
  const nameKeywordFilters = useMemo(() => {
    if (disableNameKeywordFilter || !nameKeyword || nameKeyword.trim() === '') {
      return [];
    }

    return [
      {
        field: 'metadata.name',
        operator: 'contains',
        value: nameKeyword.trim(),
      },
    ] as CrudFilters;
  }, [nameKeyword, disableNameKeywordFilter]);

  // Combine filters
  const filters = useMemo(
    () => ({
      permanent: [...namespaceFilters, ...nameKeywordFilters],
    }),
    [namespaceFilters, nameKeywordFilters]
  );

  return filters;
}
