import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import BaseTable from 'src/components/Table';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import { ServiceModel } from 'src/models/service-model';

type Props = {
  service: ServiceModel;
};

export const PortsTable: React.FC<Props> = ({ service }) => {
  const { t } = useTranslation();
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const currentSize = 10;

  const columns = [
    {
      key: 'name',
      display: true,
      dataIndex: 'name',
      title: t('dovetail.name'),
      sortable: true,
      width: 267,
    },
    {
      key: 'servicePort',
      display: true,
      dataIndex: 'port',
      title: t('dovetail.service_port'),
      sortable: true,
      width: 199,
    },
    {
      key: 'protocol',
      display: true,
      dataIndex: 'protocol',
      title: t('dovetail.protocol'),
      sortable: true,
      width: 199,
    },
    {
      key: 'podPort',
      display: true,
      dataIndex: 'targetPort',
      title: t('dovetail.pod_port'),
      sortable: true,
      width: 199,
    },
    {
      key: 'nodePort',
      display: true,
      dataIndex: 'nodePort',
      title: t('dovetail.node_port'),
      sortable: true,
      width: 199,
    },
  ];
  const ports = (service._rawYaml.spec.ports || []).map(port => ({
    ...port,
    id: port.name || '',
  }));

  if (ports?.length === 0) {
    return <ErrorContent
      errorText={t('dovetail.no_resource', { kind: t('dovetail.port') })}
      style={{ padding: '15px 0' }}
      type={ErrorContentType.Card}
    />;
  }

  return (
    <Table
      tableKey="ports"
      loading={false}
      data={ports.slice((currentPage - 1) * currentSize, currentPage * currentSize)}
      total={ports.length}
      columns={addDefaultRenderToColumns(columns)}
      rowKey="name"
      empty={t('dovetail.empty')}
      currentSize={currentSize}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      showMenuColumn={false}
    />
  );
};
