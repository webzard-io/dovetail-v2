import React, { useMemo, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
import BaseTable from 'src/components/Table';
import ValueDisplay from 'src/components/ValueDisplay';
import ComponentContext from 'src/contexts/component';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
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
  const rows = useMemo(() => {
    return addId(ingress.flattenedRules || [], 'fullPath');
  }, [ingress.flattenedRules]);
  const component = useContext(ComponentContext);
  const Table = component.Table || BaseTable;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const columns = [
    {
      key: 'pathType',
      display: true,
      dataIndex: 'pathType',
      title: t('dovetail.path_type'),
      sortable: true,
    },
    {
      key: 'fullPath',
      display: true,
      dataIndex: 'fullPath',
      title: t('dovetail.path'),
      sortable: true,
    },
    {
      key: 'serviceName',
      display: true,
      dataIndex: 'serviceName',
      title: t('dovetail.backend'),
      sortable: true,
      render: (serviceName: string, record: RuleItem) => {
        return record.serviceName ? (
          <ResourceLink
            name="services"
            namespace={ingress.metadata.namespace || 'default'}
            resourceId={serviceName}
          />
        ) : record.resourceName;
      },
    },
    {
      key: 'servicePort',
      display: true,
      dataIndex: 'servicePort',
      title: t('dovetail.port'),
      sortable: true,
    },
    {
      key: 'secret',
      display: true,
      dataIndex: 'host',
      title: 'Secret',
      render(host: string) {
        const secretName = ingress._rawYaml.spec.tls?.find(({ hosts }) => hosts?.includes(host))?.secretName;

        return secretName ? (
          <ResourceLink
            name="secrets"
            namespace={ingress.metadata.namespace || 'default'}
            resourceId={secretName}
          />
        ) : <ValueDisplay value="" />;
      },
      sortable: true,
    },
  ];

  if (rows?.length === 0) {
    return <ErrorContent errorText={t('dovetail.no_resource', { kind: t('dovetail.rule') })} style={{ padding: '15px 0' }} />;
  }

  return (
    <Table<WithId<RuleItem>>
      tableKey="ingressRules"
      loading={false}
      data={rows}
      columns={addDefaultRenderToColumns<WithId<RuleItem>>(columns)}
      rowKey="pathType"
      empty={t('dovetail.empty')}
      currentSize={10}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      showMenuColumn={false}
    />
  );
};
