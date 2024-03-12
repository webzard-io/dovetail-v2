import { useUIKit, StatusCapsuleColor } from '@cloudtower/eagle';
import { cx } from '@linaria/core';
import { Condition } from 'kubernetes-types/meta/v1';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StateTagStyle } from 'src/components/StateTag';
import { addDefaultRenderToColumns } from 'src/hooks/useEagleTable';
import { WithId } from 'src/types';
import { addId } from '../../utils/addId';
import ErrorContent from '../Table/ErrorContent';
import { Time } from '../Time';

type Props = {
  conditions: Condition[];
};

export const ConditionsTable: React.FC<Props> = ({ conditions = [] }) => {
  const kit = useUIKit();
  const { t } = useTranslation();

  const conditionsWithId = addId(conditions, 'type');

  const columns = [
    {
      key: 'type',
      display: true,
      dataIndex: 'type',
      title: t('dovetail.type'),
      sortable: true,
    },
    {
      key: 'status',
      display: true,
      dataIndex: 'status',
      title: t('dovetail.state'),
      render(value: string) {
        const colorMap: Record<string, StatusCapsuleColor> = {
          'True': 'green',
          'False': 'red',
          'Unknown': 'warning',
        };

        return (
          <kit.statusCapsule color={colorMap[value || 'Unknown']} className={cx(StateTagStyle, 'no-background')}>
            {t(`dovetail.${value.toLowerCase()}`)}
          </kit.statusCapsule>
        );
      },
      sortable: true,
    },
    {
      key: 'lastUpdateTime',
      display: true,
      dataIndex: 'lastUpdateTime',
      title: t('dovetail.updated_time'),
      sortable: true,
      render: (value: string, record: Condition) => {
        const time = value || record.lastTransitionTime;
        return <Time date={new Date(time)} />;
      },
    },
    {
      key: 'reason',
      display: true,
      dataIndex: 'reason',
      title: t('dovetail.reason'),
      sortable: true,
    },
    {
      key: 'message',
      display: true,
      dataIndex: 'message',
      title: t('dovetail.message'),
      sortable: true,
    },
  ];

  if (conditionsWithId.length === 0) {
    return <ErrorContent errorText={t('dovetail.no_resource', { kind: t('dovetail.condition') })} style={{ padding: '15px 0' }} />;
  }

  return (
    <kit.table
      loading={false}
      dataSource={conditionsWithId}
      columns={addDefaultRenderToColumns<WithId<Condition>>(columns)}
      rowKey="type"
      empty={t('dovetail.empty')}
    />
  );
};
