import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useResource, useUpdate } from '@refinedev/core';
import { WorkloadModel } from 'k8s-api-provider';
import { get } from 'lodash-es';
import React from 'react';
import { pruneBeforeEdit } from '../../utils/k8s';

const MinusButtonStyle = css`
  margin-right: 8px;
`;

const PlusButtonStyle = css`
  margin-left: 8px;
`;

export const WorkloadReplicas: React.FC<{ record: WorkloadModel }> = ({ record }) => {
  const kit = useUIKit();

  const { resource } = useResource();
  const { mutate } = useUpdate();

  const readyReplicas =
    record.status && 'readyReplicas' in record.status ? record.status.readyReplicas : 0;
  const replicas =
    record.status && 'replicas' in record.status ? record.status.replicas : 0;

  const canScale = record.kind === 'Deployment' || record.kind === 'StatefulSet';
  const currentReplicas = get(record, 'spec.replicas', 0);

  const scale = (delta: number) => {
    // TODO: fix the result of scale
    const v = record.scale(currentReplicas + delta) as WorkloadModel;
    const id = v.id;
    pruneBeforeEdit(v);
    mutate({
      id,
      resource: resource?.name || '',
      values: v,
    });
  };

  return (
    <span>
      {canScale && (
        <kit.button
          className={MinusButtonStyle}
          type="ordinary"
          size="small"
          onClick={() => scale(-1)}
        >
          -
        </kit.button>
      )}
      {readyReplicas}/{replicas}
      {canScale && (
        <kit.button
          className={PlusButtonStyle}
          type="ordinary"
          size="small"
          onClick={() => scale(1)}
        >
          +
        </kit.button>
      )}
    </span>
  );
};
