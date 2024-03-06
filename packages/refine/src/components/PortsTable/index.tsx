import { useUIKit } from '@cloudtower/eagle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceModel } from 'src/models/service-model';
import ErrorContent from '../Table/ErrorContent';

type Props = {
  service: ServiceModel;
};

export const PortsTable: React.FC<Props> = ({ service }) => {
  const kit = useUIKit();
  const { t } = useTranslation();

  const columns = [
    {
      key: 'name',
      display: true,
      dataIndex: 'name',
      title: t('dovetail.name'),
      sortable: true,
    },
    {
      key: 'servicePort',
      display: true,
      dataIndex: 'port',
      title: t('dovetail.service_port'),
      sortable: true,
    },
    {
      key: 'protocol',
      display: true,
      dataIndex: 'protocol',
      title: t('dovetail.protocol'),
      sortable: true,
    },
    {
      key: 'podPort',
      display: true,
      dataIndex: 'targetPort',
      title: t('dovetail.pod_port'),
      sortable: true,
    },
    {
      key: 'nodePort',
      display: true,
      dataIndex: 'nodePort',
      title: t('dovetail.node_port'),
      sortable: true,
    },
  ];
  const ports = (service._rawYaml.spec.ports || []).map(port => ({
    ...port,
    id: port.name || '',
  }));

  if (ports?.length === 0) {
    return <ErrorContent errorText={t('dovetail.empty')} style={{ padding: '15px 0' }} />;
  }

  return (
    <kit.table
      loading={false}
      dataSource={ports}
      columns={columns}
      rowKey="type"
      empty={t('dovetail.empty')}
    />
  );
};
