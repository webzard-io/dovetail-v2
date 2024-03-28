import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import BaseTable from 'src/components/Table';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';

type Props = {
  podSelectors: Record<string, string>;
};

export const PodSelectorTable: React.FC<Props> = ({ podSelectors = {} }) => {
  const { t } = useTranslation();
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const [currentPage, setCurrentPage] = useState<number>(1);
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
      data={datas.slice((currentPage - 1) * currentSize, currentPage * currentSize)}
      total={datas.length}
      columns={addDefaultRenderToColumns(columns)}
      rowKey="key"
      empty={t('dovetail.empty')}
      currentSize={currentSize}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      showMenuColumn={false}
    />
  );
};
