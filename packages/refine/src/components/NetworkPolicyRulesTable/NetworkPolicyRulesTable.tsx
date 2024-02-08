import { useUIKit } from '@cloudtower/eagle';
import type {
  NetworkPolicyIngressRule,
  NetworkPolicyEgressRule,
  NetworkPolicyPeer,
} from 'kubernetes-types/networking/v1';
import { flatten, get } from 'lodash-es';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { addId } from '../../utils/addId';
import ErrorContent from '../Table/ErrorContent';
import { Tags } from '../Tags';

type Props = {
  ingressOrEgress: NetworkPolicyIngressRule[] | NetworkPolicyEgressRule[];
};

export const NetworkPolicyRulesTable: React.FC<Props> = ({ ingressOrEgress }) => {
  const result = ingressOrEgress?.map((gress, i) => {
    const peers = get(gress, 'from') || get(gress, 'to');
    if (!peers) return null;
    return <IngressRuleTable key={i} peers={peers} />;
  });
  return <>{result}</>;
};

type IngressRuleTableProps = {
  peers: NetworkPolicyPeer[];
};

const IngressRuleTable: React.FC<IngressRuleTableProps> = ({ peers }) => {
  const kit = useUIKit();
  const { t } = useTranslation();
  const rows = useMemo(() => {
    const rows =
      peers?.map(p => {
        return Object.keys(p).map(key => {
          return {
            type: key,
            ...p[key as keyof NetworkPolicyPeer],
          };
        });
      }) || [];
    return addId(flatten(rows), 'type');
  }, [peers]);

  const columns = [
    {
      key: 'type',
      display: true,
      dataIndex: 'type',
      title: t('dovetail.type'),
      sortable: true,
    },
    {
      key: 'cidr',
      display: true,
      dataIndex: 'cidr',
      title: 'CIDR',
      sortable: true,
      render(v: string) {
        return <span>{v || '-'}</span>;
      },
    },
    {
      key: 'except',
      display: true,
      dataIndex: 'except',
      title: 'Except',
      sortable: true,
      render: (except: string[]) => {
        if (!except) return '-';
        return except?.map(str => <div key={str}>{str}</div>);
      },
    },
    {
      key: 'matchLabels',
      display: true,
      dataIndex: 'matchLabels',
      title: 'Match Labels',
      sortable: true,
      render(matchLabels: Record<string, string>) {
        return <Tags value={matchLabels} />;
      },
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
