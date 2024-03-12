import { useUIKit } from '@cloudtower/eagle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import ErrorContent from '../Table/ErrorContent';

type Props = {
  podSelectors: Record<string, string>;
};

export const PodSelectorTable: React.FC<Props> = ({ podSelectors = {} }) => {
  const kit = useUIKit();
  const { t } = useTranslation();

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
    },
    {
      key: 'value',
      display: true,
      dataIndex: 'value',
      title: t('dovetail.value'),
      sortable: true,
    },
  ];

  if (datas.length === 0) {
    return <ErrorContent
      errorText={t('dovetail.no_resource', { kind: ` ${t('dovetail.pod_selector')}` })}
      style={{ padding: '15px 0' }}
    />;
  }

  return (
    <kit.table
      loading={false}
      dataSource={datas}
      columns={addDefaultRenderToColumns(columns)}
      rowKey="type"
      empty={t('dovetail.empty')}
    />
  );
};
