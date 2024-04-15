import { CrudSorting } from '@refinedev/core';
import { sortData, paginateData } from 'k8s-api-provider';
import { useState, useCallback } from 'react';
import { Column, SorterOrder } from 'src/components/Table';

type UseTableDataProps<Data extends { id: string; }> = {
  pageSize?: number;
  defaultSorters?: CrudSorting;
  data: Data[];
  columns: Column<Data>[];
}

function useTableData<Data extends { id: string; }>({ data, columns, pageSize = 10, defaultSorters }: UseTableDataProps<Data>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sorters, setSorters] = useState<CrudSorting>(defaultSorters || []);
  const onSorterChange = useCallback((order?: SorterOrder | null, key?: string) => {
    const ORDER_MAP = {
      descend: 'desc',
      ascend: 'asc'
    } as const;
    const sorters = [{
      field: columns.find(col => col.key === key)?.dataIndex,
      order: order ? ORDER_MAP[order] : order,
    }];

    setSorters(sorters as CrudSorting);
  }, [columns]);

  return {
    data: paginateData(
      {
        pageSize,
        current: currentPage,
      },
      sortData(sorters, data as any[])
    ) as any as Data[],
    currentPage,
    onPageChange: setCurrentPage,
    onSorterChange
  };
}

export default useTableData;
