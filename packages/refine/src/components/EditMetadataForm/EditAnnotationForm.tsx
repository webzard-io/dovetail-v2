/* eslint-disable @typescript-eslint/no-empty-function */
import { TableForm } from '@cloudtower/eagle';
import { useUpdate } from '@refinedev/core';
import React, {
  useState,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceModel } from '../../models';
import { pruneBeforeEdit } from '../../utils/k8s';

interface EditAnnotationFormProps {
  resourceModel: ResourceModel;
}

interface EditAnnotationFormHandler {
  submit: () => Promise<unknown> | undefined;
}

export const EditAnnotationForm = React.forwardRef<EditAnnotationFormHandler, EditAnnotationFormProps>(
  function EditAnnotationForm(props, ref) {
    const { resourceModel } = props;
    const { mutateAsync } = useUpdate();
    const { t } = useTranslation();
    const [value, setValue] = useState<Array<{ key: string; value: string }>>([]);

    const defaultValue = useMemo(() => {
      return Object.keys(resourceModel.metadata?.annotations || {}).map(key => {
        return { key, value: resourceModel.metadata?.annotations?.[key] };
      });
    }, [resourceModel.metadata?.annotations]);

    const submit = useCallback(() => {
      const newAnnotations: Record<string, string> = {};
      value.forEach(({ key, value }) => {
        newAnnotations[key] = value;
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
              name: resourceModel.metadata.name,
              interpolation: {
                escapeValue: false,
              },
            }),
            type: 'success',
          };
        },
        errorNotification: false,
      });
    }, [value, resourceModel, mutateAsync, t]);

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
          setValue(value as any);
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
  }
);
