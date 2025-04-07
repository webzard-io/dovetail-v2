import { Alert } from '@cloudtower/eagle';
import { Unstructured } from 'k8s-api-provider';
import React, { useMemo, useEffect } from 'react';
import { type SaveButtonProps } from 'src/components/Form/FormModal';
import usePathMap from 'src/hooks/usePathMap';
import i18n from 'src/i18n';
import { ResourceConfig } from 'src/types';
import { CommonFormConfig, RefineFormConfig } from 'src/types';
import { RefineFormContent } from './RefineFormContent';
import useFieldsConfig from './useFieldsConfig';
import { useRefineForm } from './useRefineForm';
import { YamlForm, YamlFormProps } from './YamlForm';

interface RefineFormContainerProps {
  id: string;
  isYamlMode: boolean;
  config: ResourceConfig;
  formConfig: (RefineFormConfig & CommonFormConfig) | undefined;
  customYamlFormProps?: YamlFormProps;
  onSaveButtonPropsChange?: (props: SaveButtonProps) => void;
  onError?: () => void;
  onSuccess?: () => void;
}

function RefineFormContainer({
  id,
  config,
  customYamlFormProps,
  formConfig,
  isYamlMode,
  onSuccess,
  onError,
  onSaveButtonPropsChange,
}: RefineFormContainerProps) {
  const action = id ? 'edit' : 'create';
  const fieldsConfig = useFieldsConfig(config, formConfig, id);
  const refineFormResult = useRefineForm({
    config,
    id,
    refineProps: {
      onMutationSuccess: () => {
        onSuccess?.();
      },
      onMutationError() {
        onError?.();
      },
      redirect: false,
      ...formConfig?.refineCoreProps,
    },
    formConfig,
  });
  const {
    transformApplyValues,
  } = usePathMap({
    pathMap: formConfig?.pathMap,
    transformInitValues: formConfig?.transformInitValues,
    transformApplyValues: formConfig?.transformApplyValues || ((v: Record<string, unknown>) => v as Unstructured),
  });
  const yamlFormProps: YamlFormProps = useMemo(() => {
    if (isYamlMode) {
      return {
        ...customYamlFormProps,
        config,
        transformInitValues: undefined,
        transformApplyValues: undefined,
        initialValuesForCreate: transformApplyValues(
          refineFormResult.formResult.getValues()
        ),
        initialValuesForEdit: transformApplyValues(refineFormResult.formResult.getValues()),
        id,
        action,
        isShowLayout: false,
        useFormProps: {
          redirect: false,
        },
        rules: fieldsConfig?.map(config => ({
          path: config.path,
          validators: config.validators,
        })),
        onSaveButtonPropsChange,
        onErrorsChange(errors: string[]) {
          if (errors.length) {
            onError?.();
          }
        },
        onFinish: onSuccess,
      };
    }

    return {
      config,
    };
  }, [
    action,
    isYamlMode,
    customYamlFormProps,
    fieldsConfig,
    config,
    id,
    refineFormResult,
    transformApplyValues,
    onSaveButtonPropsChange,
    onSuccess,
    onError,
  ]);

  useEffect(() => {
    if (!isYamlMode) {
      onSaveButtonPropsChange?.(refineFormResult.formResult.saveButtonProps);
    }
  }, [isYamlMode, refineFormResult.formResult.saveButtonProps, onSaveButtonPropsChange]);

  if (isYamlMode) {
    return <YamlForm {...yamlFormProps} />;
  }

  return (
    <>
      {!formConfig?.isDisabledChangeMode ? (
        <Alert
          type="warning"
          message={i18n.t('dovetail.change_form_mode_alert')}
          style={{ marginBottom: '16px' }}
        />
      ) : undefined}
      {formConfig?.renderForm ? (
        formConfig?.renderForm()
      ) : (
        <RefineFormContent
          formResult={refineFormResult.formResult}
          config={config}
          formConfig={formConfig}
          errorMsgs={refineFormResult.responseErrorMsgs}
          resourceId={id as string}
        />
      )}
    </>
  );
}

export default RefineFormContainer;
