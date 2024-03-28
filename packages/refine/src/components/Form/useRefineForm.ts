import { UseFormProps } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { Unstructured } from 'k8s-api-provider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceConfig } from '../../types';

export const useRefineForm = (props: {
  config: ResourceConfig;
  id?: string;
  refineProps?: UseFormProps;
}) => {
  const { config, id, refineProps } = props;
  const [responseErrorMsg, setResponseErrorMsg] = useState<string>('');
  const i18n = useTranslation();

  const result = useForm({
    mode: 'onChange',
    refineCoreProps: {
      errorNotification: false,
      successNotification: () => {
        const formValue = result.getValues() as Unstructured;
        return {
          message: i18n.t(
            id ? 'dovetail.edit_resource_success' : 'dovetail.create_success_toast',
            {
              kind: formValue.kind,
              name: formValue.metadata.name,
              interpolation: { escapeValue: false },
            }
          ),
          description: 'Success',
          type: 'success',
        };
      },
      resource: config.name,
      action: id ? 'edit' : 'create',
      id,
      liveMode: 'off',
      ...refineProps,
    },
    defaultValues: config?.initValue,
  });

  // set request error message
  useEffect(() => {
    const response = result.refineCore.mutationResult.error?.response;
    if (response && !response?.bodyUsed) {
      response.json?.().then((body: any) => {
        setResponseErrorMsg(body.message);
      });
    }
  }, [result.refineCore.mutationResult.error?.response]);

  return { formResult: result, responseErrorMsg };
};
