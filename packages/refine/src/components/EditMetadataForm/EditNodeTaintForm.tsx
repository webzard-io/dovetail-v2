/* eslint-disable @typescript-eslint/no-empty-function */
import { Select, TableForm } from '@cloudtower/eagle';
import { useUpdate } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import { Node, Taint } from 'kubernetes-types/core/v1';
import React, { useState, useCallback, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';

interface EditNodeTaintFormProps {
  nodeModel: ResourceModel<Unstructured & Node>;
}

interface EditNodeTaintFormHandler {
  submit: () => Promise<unknown> | undefined;
}

enum NodeTaintEffect {
  'NoSchedule' = 'NoSchedule',
  'PreferNoSchedule' = 'PreferNoSchedule',
  'NoExecute' = 'NoExecute',
}

export const EditNodeTaintForm = React.forwardRef<
  EditNodeTaintFormHandler,
  EditNodeTaintFormProps
>(function EditNodeTaintForm(props, ref) {
  const { nodeModel } = props;
  const { mutateAsync } = useUpdate();
  const { t } = useTranslation();
  const [value, setValue] = useState<Array<Taint>>([]);

  const defaultValue = useMemo(() => {
    return nodeModel._rawYaml.spec?.taints || [];
  }, [nodeModel]);

  const submit = useCallback(() => {
    const newYaml = nodeModel._globalStore.restoreItem(nodeModel) as Node;

    if (newYaml.spec) {
      newYaml.spec.taints = value;
    }

    pruneBeforeEdit(newYaml);

    return mutateAsync({
      id: nodeModel.id,
      resource: nodeModel.name || '',
      values: newYaml,
      meta: {
        resourceBasePath: nodeModel.apiVersion,
        kind: nodeModel.kind,
      },
      successNotification() {
        return {
          message: t('dovetail.edit_node_taint_success_toast', {
            kind: nodeModel.kind,
            name: nodeModel.metadata.name,
            interpolation: {
              escapeValue: false,
            },
          }),
          type: 'success',
        };
      },
      errorNotification: false,
    });
  }, [value, nodeModel, mutateAsync, t]);

  useImperativeHandle(
    ref,
    () => ({
      submit,
    }),
    [submit]
  );

  return (
    <TableForm
      onBodyChange={value => {
        setValue(value as Taint[]);
      }}
      columns={[
        {
          key: 'key',
          title: t('dovetail.key'),
          type: 'input',
        },
        {
          key: 'value',
          title: t('dovetail.value'),
          type: 'input',
        },
        {
          key: 'effect',
          title: t('dovetail.effect'),
          render: ({ value, onChange }) => {
            return (
              <Select
                input={{}}
                value={value}
                onChange={onChange}
                size="small"
                options={[
                  {
                    value: NodeTaintEffect.NoSchedule,
                    label: t(`dovetail.node_taint_${NodeTaintEffect.NoSchedule}`),
                  },
                  {
                    value: NodeTaintEffect.PreferNoSchedule,
                    label: t(`dovetail.node_taint_${NodeTaintEffect.PreferNoSchedule}`),
                  },
                  {
                    value: NodeTaintEffect.NoExecute,
                    label: t(`dovetail.node_taint_${NodeTaintEffect.NoExecute}`),
                  },
                ]}
              />
            );
          },
        },
      ]}
      disableBatchFilling
      rowAddConfig={{
        addible: true,
      }}
      defaultData={defaultValue}
      row={{
        deletable: true,
      }}
    />
  );
});
