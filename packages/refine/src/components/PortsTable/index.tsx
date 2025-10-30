import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import BaseTable from 'src/components/InternalBaseTable';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import useTableData from 'src/hooks/useTableData';
import { ServiceModel } from 'src/models/service-model';

type Props = {
  service: ServiceModel;
};

export const PortsTable: React.FC<Props> = ({ service }) => {
  const { t } = useTranslation();
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
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
      title: t('dovetail.container_port'),
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

  const {
    data: finalData,
    currentPage,
    onPageChange,
    onSorterChange,
  } = useTableData({
    data: ports,
    columns,
  });

  if (ports?.length === 0) {
    return (
      <ErrorContent
        errorText={t('dovetail.no_resource', { kind: t('dovetail.port') })}
        type={ErrorContentType.Card}
      />
    );
  }

  return (
    <Table
      tableKey="ports"
      loading={false}
      data={finalData}
      total={ports.length}
      columns={addDefaultRenderToColumns(columns)}
      rowKey="name"
      empty={t('dovetail.empty')}
      defaultSize={currentSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onSorterChange={onSorterChange}
      showMenuColumn={false}
    />
  );
};
