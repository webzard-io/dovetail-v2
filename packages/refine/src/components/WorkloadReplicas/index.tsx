import React from 'react';
import { WorkloadModel } from '../../model/workload-model';

export const WorkloadReplicas: React.FC<{ record: WorkloadModel }> = ({ record }) => {
  const readyReplicas =
    record.status && 'readyReplicas' in record.status ? record.status.readyReplicas : 0;
  const replicas =
    record.status && 'replicas' in record.status ? record.status.replicas : 0;

  return (
    <span>
      {readyReplicas}/{replicas}
    </span>
  );
};
