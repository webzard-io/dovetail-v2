import { Unstructured } from 'k8s-api-provider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addSpaceBeforeLetter } from 'src/utils/string';
import { ResourceConfig } from '../../types';
import { useForm, UseFormProps } from './useReactHookForm';

export const useRefineForm = (props: {
  config: ResourceConfig;
  id?: string;
  refineProps?: UseFormProps['refineCoreProps'];
  useFormProps?: UseFormProps;
}) => {
  const { config, id, refineProps } = props;
  const [responseErrorMsg, setResponseErrorMsg] = useState<string>('');
  const i18n = useTranslation();
  const result = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    refineCoreProps: {
      errorNotification: false,
      successNotification: () => {
        const formValue = result.getValues() as Unstructured;

        return {
          message: i18n.t(
            id ? 'dovetail.edit_resource_success' : 'dovetail.create_success_toast',
            {
              kind: addSpaceBeforeLetter(config.displayName || config.kind),
              name: formValue.metadata?.name,
              interpolation: { escapeValue: false },
            }
          ).trim(),
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
    transformApplyValues: config.formConfig?.transformApplyValues,
    transformInitValues: config.formConfig?.transformInitValues,
    ...config.formConfig?.useFormProps,
  });

  // set request error message
  useEffect(() => {
    const response = result.refineCore.mutationResult.error?.response;
    if (response && !response?.bodyUsed) {
      response.json?.().then((body: any) => {
        setResponseErrorMsg(config.formConfig?.formatError?.(body) || body.message);
      });
    }
  }, [config.formConfig, result]);

  return { formResult: result, responseErrorMsg };
};
