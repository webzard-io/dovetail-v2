import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import BaseTable from 'src/components/InternalBaseTable';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import useTableData from 'src/hooks/useTableData';

type Props = {
  podSelectors: Record<string, string>;
};

export const PodSelectorTable: React.FC<Props> = ({ podSelectors = {} }) => {
  const { t } = useTranslation();
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const currentSize = 10;

  const datas = Object.keys(podSelectors).map(key => ({
    id: key,
    key,
    value: podSelectors[key]
  }));

  const columns = [
    {
      key: 'key',
      display: true,
      dataIndex: 'key',
      title: t('dovetail.key'),
      sortable: true,
      width: '50%',
    },
    {
      key: 'value',
      display: true,
      dataIndex: 'value',
      title: t('dovetail.value'),
      sortable: true,
      width: '50%',
    },
  ];

  const {
    data: finalData,
    currentPage,
    onPageChange,
    onSorterChange
  } = useTableData({
    data: datas,
    columns
  });

  if (datas.length === 0) {
    return <ErrorContent
      errorText={t('dovetail.no_resource', { kind: ` ${t('dovetail.pod_selector')}` })}
      style={{ padding: '15px 0' }}
      type={ErrorContentType.Card}
    />;
  }

  return (
    <Table
      tableKey="podSelector"
      loading={false}
      data={finalData}
      total={datas.length}
      columns={addDefaultRenderToColumns(columns)}
      rowKey="key"
      empty={t('dovetail.empty')}
      defaultSize={currentSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onSorterChange={onSorterChange}
      showMenuColumn={false}
    />
  );
};
