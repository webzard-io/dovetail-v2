import { CrudFilters } from '@refinedev/core';
import { useMemo } from 'react';
import { useNamespacesFilter, ALL_NS } from 'src/components/NamespacesFilter';

function useNamespaceRefineFilter() {
  const { value: nsFilters = [] } = useNamespacesFilter();
  const filters = useMemo(() => {
    const filters = nsFilters.filter(filter => filter !== ALL_NS);
    if (filters.length === 0) {
      return {
        initial: [],
        defaultBehavior: 'replace' as const,
      };
    }

    return {
      initial: [
        {
          operator: 'or',
          value: filters.map(filter => ({
            field: 'metadata.namespace',
            operator: 'eq',
            value: filter,
          })),
        },
      ] as CrudFilters,
      defaultBehavior: 'replace' as const,
    };
  }, [nsFilters]);

  return filters;
}

export default useNamespaceRefineFilter;
