import { Select, Tooltip, getOptions, Icon } from '@cloudtower/eagle';
import {
  InfoICircleFill16Gray70Icon,
  InfoICircleFill16GrayIcon,
} from '@cloudtower/icons-react';
import { css } from '@linaria/core';
import { useUpdate } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import { Node, Taint } from 'kubernetes-types/core/v1';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';
import { KeyValueTableFormForm } from './KeyValueTableForm';

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

  const noScheduleTooltip = (
    <div>
      <b>NoSchedule</b>
      <ul className={UlStyle}>
        <li>{t('dovetail.taint_effect_NoSchedule_tooltip_1')}</li>
        <li>{t('dovetail.taint_effect_NoSchedule_tooltip_2')}</li>
      </ul>
    </div>
  );

  const preferNoScheduleTooltip = (
    <div>
      <b>PreferNoSchedule</b>
      <ul className={UlStyle}>
        <li>{t('dovetail.taint_effect_PreferNoSchedule_tooltip_1')}</li>
        <li>{t('dovetail.taint_effect_PreferNoSchedule_tooltip_2')}</li>
        <li>{t('dovetail.taint_effect_PreferNoSchedule_tooltip_3')}</li>
      </ul>
    </div>
  );

  const noExecuteTooltip = (
    <div>
      <b>NoExecute</b>
      <ul className={UlStyle}>
        <li>{t('dovetail.taint_effect_NoExecute_tooltip_3')}</li>
      </ul>
    </div>
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
              <Select input={{}} value={value} onChange={onChange} size="small">
                {getOptions([
                  {
                    value: NodeTaintEffect.NoSchedule,
                    children: t(`dovetail.node_taint_${NodeTaintEffect.NoSchedule}`),
                    suffix: (
                      <Tooltip title={noScheduleTooltip}>
                        <Icon
                          src={InfoICircleFill16GrayIcon}
                          hoverSrc={InfoICircleFill16Gray70Icon}
                        />
                      </Tooltip>
                    ),
                  },
                  {
                    value: NodeTaintEffect.PreferNoSchedule,
                    children: t(
                      `dovetail.node_taint_${NodeTaintEffect.PreferNoSchedule}`
                    ),
                    suffix: (
                      <Tooltip title={preferNoScheduleTooltip}>
                        <Icon
                          src={InfoICircleFill16GrayIcon}
                          hoverSrc={InfoICircleFill16Gray70Icon}
                        />
                      </Tooltip>
                    ),
                  },
                  {
                    value: NodeTaintEffect.NoExecute,
                    children: t(`dovetail.node_taint_${NodeTaintEffect.NoExecute}`),
                    suffix: (
                      <Tooltip title={noExecuteTooltip}>
                        <Icon
                          src={InfoICircleFill16GrayIcon}
                          hoverSrc={InfoICircleFill16Gray70Icon}
                        />
                      </Tooltip>
                    ),
                  },
                ])}
              </Select>
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
