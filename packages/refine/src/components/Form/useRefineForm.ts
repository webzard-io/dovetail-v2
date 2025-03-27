import { Unstructured } from 'k8s-api-provider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import usePathMap from 'src/hooks/usePathMap';
import { getCommonErrors } from 'src/utils/error';
import { transformResourceKindInSentence } from 'src/utils/string';
import { CommonFormConfig, ErrorBody, RefineFormConfig, ResourceConfig } from '../../types';
import { useForm, UseFormProps } from './useReactHookForm';

export const useRefineForm = (props: {
  formConfig?: RefineFormConfig & CommonFormConfig;
  id?: string;
  config: ResourceConfig;
  refineProps?: UseFormProps['refineCoreProps'];
  useFormProps?: UseFormProps;
}) => {
  const { formConfig, config, id, refineProps } = props;
  const { transformInitValues, transformApplyValues } = usePathMap({
    pathMap: formConfig?.pathMap,
    transformInitValues: formConfig?.transformInitValues,
    transformApplyValues: formConfig?.transformApplyValues,
  });
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
    transformApplyValues,
    transformInitValues,
    ...formConfig?.useFormProps,
  });

  // set request error message
  useEffect(() => {
    const response = result.refineCore.mutationResult.error?.response;
    if (response && !response?.bodyUsed) {
      response.json?.().then((body: ErrorBody) => {
        setResponseErrorMsgs(([] as string[]).concat(formConfig?.formatError?.(body) || getCommonErrors(body, i18n)));
      });
    }
  }, [formConfig, result, i18n]);

  return { formResult: result, responseErrorMsgs };
};
