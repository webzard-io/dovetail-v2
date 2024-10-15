import { Select } from '@cloudtower/eagle';
import { useUpdate } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import { Node, Taint } from 'kubernetes-types/core/v1';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';
import { KeyValueTableFormForm } from './KeyValueTableForm';

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

  const defaultValue = useMemo(() => {
    return nodeModel._rawYaml.spec?.taints || [];
  }, [nodeModel]);

  const onSubmit = useCallback(
    (_value: unknown) => {
      const value = _value as Taint[];
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
    },
    [nodeModel, mutateAsync, t]
  );

  return (
    <KeyValueTableFormForm
      ref={ref}
      defaultValue={defaultValue}
      onSubmit={onSubmit}
      addButtonText={t('dovetail.add_taint')}
      extraColumns={[
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
          validator: ({ value }) => {
            if (!value) return t('dovetail.taint_effect_empty_text');
          },
        },
      ]}
    />
  );
});
