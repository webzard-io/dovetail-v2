import { Unstructured } from 'k8s-api-provider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCommonErrors } from 'src/utils/error';
import { transformResourceKindInSentence } from 'src/utils/string';
import { ResourceConfig } from '../../types';
import { useForm, UseFormProps } from './useReactHookForm';

export const useRefineForm = (props: {
  config: ResourceConfig;
  id?: string;
  refineProps?: UseFormProps['refineCoreProps'];
  useFormProps?: UseFormProps;
}) => {
  const { config, id, refineProps } = props;
  const [responseErrorMsgs, setResponseErrorMsgs] = useState<string[]>([]);
  const { i18n } = useTranslation();
  const result = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    refineCoreProps: {
      errorNotification: false,
      successNotification: () => {
        const formValue = result.getValues() as Unstructured;

        return {
          message: i18n.t(
            id ? 'dovetail.edit_resource_success' : 'dovetail.create_success_toast',
            {
              kind: transformResourceKindInSentence(config.displayName || config.kind, i18n.language),
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
        setResponseErrorMsgs(([] as string[]).concat(config.formConfig?.formatError?.(body) || getCommonErrors(body, i18n)));
      });
    }
  }, [config.formConfig, result, i18n]);

  return { formResult: result, responseErrorMsgs };
};
