import { useList } from '@refinedev/core';
import { Service } from 'kubernetes-types/core/v1';
import React, { useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent, { ErrorContentType } from 'src/components/ErrorContent';
import BaseTable from 'src/components/InternalBaseTable';
import { LinkFallback } from 'src/components/LinkFallback';
import ValueDisplay from 'src/components/ValueDisplay';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import useTableData from 'src/hooks/useTableData';
import { RuleItem } from 'src/models/ingress-model';
import { IngressModel } from '../../models';
import { WithId } from '../../types';
import { addId } from '../../utils/addId';
import { ResourceLink } from '../ResourceLink';

type Props = {
  ingress: IngressModel;
};

export const IngressRulesTable: React.FC<Props> = ({ ingress }) => {
  const { t } = useTranslation();
  const { data: serviceData } = useList<Service>({
    resource: 'services',
    meta: {
      kind: 'Service',
      apiVersion: 'v1',
    },
  });
  const flattenedRules = useMemo(
    () => (serviceData?.data ? ingress.getFlattenedRules(serviceData?.data) : []),
    [serviceData?.data, ingress]
  );
  const rows = useMemo(() => {
    return addId(flattenedRules || [], 'fullPath');
  }, [flattenedRules]);
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const currentSize = 10;

  const columns = [
    {
      key: 'pathType',
      display: true,
      dataIndex: 'pathType',
      title: t('dovetail.path_type'),
      width: 160,
      sortable: true,
    },
    {
      key: 'fullPath',
      display: true,
      dataIndex: 'fullPath',
      title: t('dovetail.path'),
      width: 478,
      sortable: true,
      render(value: string) {
        return <LinkFallback fullPath={value} />;
      },
    },
    {
      key: 'serviceName',
      display: true,
      dataIndex: 'serviceName',
      title: t('dovetail.target_service'),
      sortable: true,
      width: 160,
      render: (serviceName: string, record: RuleItem) => {
        return record.serviceName ? (
          <ResourceLink
            resourceName="services"
            namespace={ingress.metadata.namespace || 'default'}
            name={serviceName}
          />
        ) : (
          <ValueDisplay value="" />
        );
      },
    },
    {
      key: 'servicePort',
      display: true,
      dataIndex: 'servicePort',
      title: t('dovetail.target_service_port'),
      width: 120,
      sortable: true,
    },
    {
      key: 'secret',
      display: true,
      dataIndex: 'host',
      title: t('dovetail.cert'),
      width: 160,
      render(host: string) {
        const secretName = ingress._rawYaml.spec.tls?.find(({ hosts }) =>
          hosts?.includes(host)
        )?.secretName;

        return secretName ? (
          <ResourceLink
            resourceName="secrets"
            namespace={ingress.metadata.namespace || 'default'}
            name={secretName}
          />
        ) : (
          <ValueDisplay value="" />
        );
      },
      sortable: true,
    },
  ];

  const {
    data: finalData,
    currentPage,
    onPageChange,
    onSorterChange,
  } = useTableData({
    columns,
    data: rows,
  });

  if (rows?.length === 0) {
    return (
      <ErrorContent
        errorText={t('dovetail.no_resource', { kind: t('dovetail.rule') })}
        type={ErrorContentType.List}
      />
    );
  }

  return (
    <Table<WithId<RuleItem>>
      tableKey="ingressRules"
      loading={false}
      data={finalData}
      total={rows.length}
      columns={addDefaultRenderToColumns<WithId<RuleItem>>(columns)}
      rowKey="pathType"
      empty={t('dovetail.empty')}
      defaultSize={currentSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onSorterChange={onSorterChange}
      showMenuColumn={false}
    />
  );
};
