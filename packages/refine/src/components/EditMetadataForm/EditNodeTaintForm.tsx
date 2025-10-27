import { css } from '@linaria/core';
import { useUpdate } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import { Node, Taint } from 'kubernetes-types/core/v1';
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';
import {
  KeyValuePair,
  KeyValueTableForm,
  KeyValueTableFormHandle,
} from '../KeyValueTableForm';
import { NodeTaintEffect, NodeTaintEffectSelect } from './NodeTaintEffectSelect';

const UlStyle = css`
  list-style: disc;
  padding-left: 2em;
`;

interface EditNodeTaintFormProps {
  nodeModel: ResourceModel<Unstructured & Node>;
}

interface EditNodeTaintFormHandler {
  submit: () => Promise<unknown> | undefined;
}

export const EditNodeTaintForm = React.forwardRef<
  EditNodeTaintFormHandler,
  EditNodeTaintFormProps
>(function EditNodeTaintForm(props, ref) {
  const { nodeModel } = props;
  const { mutateAsync } = useUpdate();
  const { t } = useTranslation();
  const tableFormRef = useRef<KeyValueTableFormHandle<KeyValuePair>>(null);

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
              name: nodeModel.metadata?.name,
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

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        return tableFormRef.current?.submit();
      },
    }),
    []
  );

  return (
    <KeyValueTableForm
      ref={tableFormRef}
      defaultValue={defaultValue}
      onSubmit={onSubmit}
      addButtonText={t('dovetail.add_taint')}
      extraColumns={[
        {
          key: 'effect',
          title: t('dovetail.effect'),
          defaultValue: NodeTaintEffect.NoExecute,
          render: ({ value, onChange }) => {
            return (
              <NodeTaintEffectSelect
                value={value as NodeTaintEffect}
                onChange={onChange}
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

export const TaintEffectTooltip: React.FC<{
  effect: Exclude<NodeTaintEffect, NodeTaintEffect.All>;
}> = ({ effect }) => {
  const { t } = useTranslation();

  const TaintEffectTooltipTextConfig = {
    [NodeTaintEffect.NoExecute]: {
      title: 'NoExecute',
      tooltips: [
        t('dovetail.taint_effect_NoExecute_tooltip_1'),
        t('dovetail.taint_effect_NoExecute_tooltip_2'),
        t('dovetail.taint_effect_NoExecute_tooltip_3'),
      ],
    },
    [NodeTaintEffect.NoSchedule]: {
      title: 'NoSchedule',
      tooltips: [
        t('dovetail.taint_effect_NoSchedule_tooltip_1'),
        t('dovetail.taint_effect_NoSchedule_tooltip_2'),
      ],
    },
    [NodeTaintEffect.PreferNoSchedule]: {
      title: 'PreferNoSchedule',
      tooltips: [t('dovetail.taint_effect_PreferNoSchedule_tooltip')],
    },
  };

  const config = TaintEffectTooltipTextConfig[effect];

  return (
    <div>
      <b>{config.title}</b>
      <ul className={UlStyle}>
        {config.tooltips.map((tooltip, index) => (
          <li key={index}>{tooltip}</li>
        ))}
      </ul>
    </div>
  );
};
