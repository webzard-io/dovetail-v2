import { useUpdate } from '@refinedev/core';
import React, { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';
import {
  KeyValuePair,
  KeyValueTableForm,
  KeyValueTableFormHandle,
} from '../KeyValueTableForm';

interface EditLabelFormProps {
  resourceModel: ResourceModel;
}

interface EditLabelFormHandler {
  submit: () => Promise<unknown> | undefined;
}

export const EditLabelForm = React.forwardRef<EditLabelFormHandler, EditLabelFormProps>(
  function EditLabelForm(props, ref) {
    const { resourceModel } = props;
    const { mutateAsync } = useUpdate();
    const { t } = useTranslation();
    const tableFormRef = useRef<KeyValueTableFormHandle<KeyValuePair>>(null);

    const defaultValue = useMemo<KeyValuePair[]>(() => {
      return Object.keys(resourceModel.metadata?.labels || {}).map(key => {
        return { key, value: resourceModel.metadata?.labels?.[key] || '' };
      });
    }, [resourceModel.metadata?.labels]);

    const onSubmit = useCallback(
      (value: KeyValuePair[]) => {
        const newLabels: Record<string, string> = {};
        value.forEach(({ key, value }) => {
          newLabels[key] = value || '';
        });
        const newYaml = resourceModel.updateLabel(newLabels);
        pruneBeforeEdit(newYaml);
        return mutateAsync({
          id: resourceModel.id,
          resource: resourceModel.name || '',
          values: newYaml,
          meta: {
            resourceBasePath: resourceModel.apiVersion,
            kind: resourceModel.kind,
          },
          successNotification() {
            return {
              message: t('dovetail.edit_label_success_toast', {
                kind: resourceModel.kind,
                name: resourceModel.metadata?.name,
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
      [resourceModel, mutateAsync, t]
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
        addButtonText={t('dovetail.add_label')}
      />
    );
  }
);
