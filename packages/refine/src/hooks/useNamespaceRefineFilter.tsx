import { CrudFilters } from '@refinedev/core';
import { useMemo } from 'react';
import { useNamespacesFilter, ALL_NS } from 'src/components/NamespacesFilter';

function useNamespaceRefineFilter() {
  const { value: nsFilters = [] } = useNamespacesFilter();
  const filters = useMemo(() => ({
    permanent: [
      {
        operator: 'or',
        value: nsFilters.filter(filter => filter !== ALL_NS).map(filter => ({
          field: 'metadata.namespace',
          operator: 'eq',
          value: filter,
        }))
      }
    ] as CrudFilters,
  }), [nsFilters]);

  return filters;
}

export default useNamespaceRefineFilter;
