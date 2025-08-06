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

interface EditAnnotationFormProps {
  resourceModel: ResourceModel;
}

interface EditAnnotationFormHandler {
  submit: () => Promise<unknown> | undefined;
}

export const EditAnnotationForm = React.forwardRef<
  EditAnnotationFormHandler,
  EditAnnotationFormProps
>(function EditAnnotationForm(props, ref) {
  const { resourceModel } = props;
  const { mutateAsync } = useUpdate();
  const { t } = useTranslation();
  const tableFormRef = useRef<KeyValueTableFormHandle<KeyValuePair>>(null);

  const defaultValue = useMemo<KeyValuePair[]>(() => {
    return Object.keys(resourceModel.metadata?.annotations || {}).map(key => {
      return { key, value: resourceModel.metadata?.annotations?.[key] || '' };
    });
  }, [resourceModel.metadata?.annotations]);

  const onSubmit = useCallback(
    (value: KeyValuePair[]) => {
      const newAnnotations: Record<string, string> = {};
      value.forEach(({ key, value }) => {
        newAnnotations[key] = value || '';
      });
      const newYaml = resourceModel.updateAnnotation(newAnnotations);
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
            message: t('dovetail.edit_annotation_success_toast', {
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
      addButtonText={t('dovetail.add_annotation')}
      noValueValidation
    />
  );
});
