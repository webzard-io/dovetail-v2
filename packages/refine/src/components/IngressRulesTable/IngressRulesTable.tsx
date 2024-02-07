import { useUIKit } from '@cloudtower/eagle';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IngressModel } from '../../models';
import { addId } from '../../utils/addId';
import { ResourceLink } from '../ResourceLink';
import ErrorContent from '../Table/ErrorContent';

type Props = {
  ingress: IngressModel;
};

export const IngressRulesTable: React.FC<Props> = ({ ingress }) => {
  const kit = useUIKit();
  const { t } = useTranslation();
  const rows = useMemo(() => {
    return addId(ingress.flattenedRules, 'fullPath');
  }, [ingress.flattenedRules]);

  const columns = [
    {
      key: 'pathType',
      display: true,
      dataIndex: 'pathType',
      title: t('dovetail.ingress_rule_type'),
      sortable: true,
    },
    {
      key: 'fullPath',
      display: true,
      dataIndex: 'fullPath',
      title: t('dovetail.Path'),
      sortable: true,
    },
    {
      key: 'serviceName',
      display: true,
      dataIndex: 'serviceName',
      title: t('dovetail.service'),
      sortable: true,
      render: (serviceName: string) => {
        return (
          <ResourceLink
            name="services"
            namespace={ingress.metadata.namespace || 'default'}
            resourceId={serviceName}
          />
        );
      },
    },
    {
      key: 'servicePort',
      display: true,
      dataIndex: 'servicePort',
      title: t('dovetail.port'),
      sortable: true,
    },
  ];

  if (rows.length === 0) {
    return <ErrorContent errorText={t('dovetail.empty')} style={{ padding: '15px 0' }} />;
  }

  return (
    <kit.table
      loading={false}
      dataSource={rows}
      columns={columns}
      rowKey="type"
      empty={t('dovetail.empty')}
    />
  );
};
