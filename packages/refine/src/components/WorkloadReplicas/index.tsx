/* eslint-disable @typescript-eslint/no-empty-function */
import { useUIKit } from '@cloudtower/eagle';
import { useResource, useUpdate } from '@refinedev/core';
import { get } from 'lodash-es';
import React, { useState, useCallback, useImperativeHandle, useRef } from 'react';
import { EditField } from 'src/components/EditField';
import { ShowField } from 'src/components/ShowContent';
import { WorkloadModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';

interface WorkloadReplicasFormProps {
  defaultValue: number;
  record: WorkloadModel;
  label: string;
}

interface WorkloadReplicasFormHandler {
  submit: ()=> Promise<unknown> | undefined;
}

const WorkloadReplicasForm = React.forwardRef<WorkloadReplicasFormHandler, WorkloadReplicasFormProps>(function WorkloadReplicasForm(props, ref) {
  const { defaultValue, record, label } = props;
  const kit = useUIKit();
  const { resource } = useResource();
  const { mutateAsync } = useUpdate();

  const [replicas, setReplicas] = useState(defaultValue);

  const submit = useCallback(() => {
    const v = record.scale(replicas);
    const id = record.id;

    pruneBeforeEdit(v);

    return mutateAsync({
      id,
      resource: resource?.name || '',
      values: v,
    });
  }, [record, replicas, resource?.name, mutateAsync]);

  useImperativeHandle(ref, () => ({
    submit,
  }), [submit]);

  return (
    <kit.form.Item
      label={label}
    >
      <kit.fields.Integer
        input={{
          name: 'replicas',
          value: replicas,
          onChange: (value) => {
            setReplicas(Number(value));
          },
          onBlur: () => { },
          onFocus: () => { },
        }}
        meta={{}}
        controls
      />
    </kit.form.Item>
  );
});

export interface WorkloadReplicasProps {
  record: WorkloadModel;
  field: ShowField<WorkloadModel>;
  editable?: boolean;
}

export function WorkloadReplicas({ record, field, editable }: WorkloadReplicasProps) {
  const formRef = useRef<WorkloadReplicasFormHandler | null>(null);

  const readyReplicas =
    record.status && 'readyReplicas' in record.status ? record.status.readyReplicas : 0;
  const replicas = record.spec && 'replicas' in record.spec ? record.spec.replicas : 0;

  const canScale = record.kind === 'Deployment' || record.kind === 'StatefulSet';
  const currentReplicas = get(record, 'spec.replicas', 0);

  return (
    <span>
      {readyReplicas}/{replicas}
      {
        editable && canScale && (
          <EditField
            modalProps={{
              formRef,
              renderContent() {
                return (
                  <WorkloadReplicasForm
                    ref={formRef}
                    defaultValue={currentReplicas}
                    record={record}
                    label={field.title}
                  />
                );
              }
            }}
          />
        )
      }
    </span>
  );
}
