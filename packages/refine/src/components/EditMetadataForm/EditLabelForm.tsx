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
    const [value, setValue] = useState<Array<{ key: string; value: string }>>([]);

    const defaultValue = useMemo(() => {
      return Object.keys(resourceModel.metadata?.labels || {}).map(key => {
        return { key, value: resourceModel.metadata?.labels?.[key] };
      });
    }, [resourceModel.metadata?.labels]);

    const submit = useCallback(() => {
      const newLabels: Record<string, string> = {};
      value.forEach(({ key, value }) => {
        newLabels[key] = value;
      });
      const newYaml = resourceModel.updateLabel(newLabels);
      pruneBeforeEdit(newYaml);
      console.log('newYaml', newYaml);
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
            title: 'Key',
            type: 'input',
          },
          {
            key: 'value',
            title: 'Value',
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
