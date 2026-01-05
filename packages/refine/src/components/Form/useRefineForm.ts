import { Unstructured } from 'k8s-api-provider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import usePathMap from 'src/hooks/usePathMap';
import { getCommonErrors } from 'src/utils/error';
import { transformResourceKindInSentence } from 'src/utils/string';
import {
  CommonFormConfig,
  ErrorBody,
  RefineFormConfig,
  ResourceConfig,
} from '../../types';
import { useForm, UseFormProps } from './useReactHookForm';

interface UseRefineFormOptions {
  initialValues?: Record<string, unknown>;
  onBeforeSubmitError?: (errors: string[]) => void;
}

export const useRefineForm = (props: {
  formConfig?: RefineFormConfig & CommonFormConfig;
  id?: string;
  config: Pick<
    ResourceConfig,
    'name' | 'displayName' | 'kind' | 'initValue' | 'formConfig'
  >;
  refineProps?: UseFormProps['refineCoreProps'];
  options?: UseRefineFormOptions;
}) => {
  const { formConfig, config, id, refineProps, options } = props;
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
          message: i18n
            .t(id ? 'dovetail.edit_resource_success' : 'dovetail.create_success_toast', {
              kind: transformResourceKindInSentence(
                config.displayName || config.kind,
                i18n.language
              ),
              name: formValue.metadata?.name,
              interpolation: { escapeValue: false },
            })
            .trim(),
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
    defaultValues: options?.initialValues || config?.initValue,
    transformApplyValues,
    transformInitValues,
    beforeSubmit: formConfig?.beforeSubmit,
    onBeforeSubmitError: options?.onBeforeSubmitError,
    ...formConfig?.useFormProps,
  });

  // set request error message
  useEffect(() => {
    const response = result.refineCore.mutationResult.error?.response;
    if (response && !response?.bodyUsed) {
      response.json?.().then((body: ErrorBody) => {
        setResponseErrorMsgs(
          ([] as string[]).concat(
            formConfig?.formatError?.(body) || getCommonErrors(body, i18n)
          )
        );
      });
    }
  }, [formConfig, result, i18n]);

  return {
    formResult: result,
    responseErrorMsgs,
    beforeSubmitErrors: result.beforeSubmitErrors,
  };
};
