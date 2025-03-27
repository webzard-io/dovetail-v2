import { Alert } from '@cloudtower/eagle';
import { Unstructured } from 'k8s-api-provider';
import React, { useMemo, useEffect } from 'react';
import { type SaveButtonProps } from 'src/components/Form/FormModal';
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
  });
  const yamlFormProps: YamlFormProps = useMemo(() => {
    const transformApplyValues =
      formConfig?.transformApplyValues ||
      ((v: Record<string, unknown>) => v as Unstructured);

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
  }, [
    action,
    customYamlFormProps,
    fieldsConfig,
    config,
    id,
    refineFormResult,
    formConfig,
    onSaveButtonPropsChange,
    onSuccess,
    onError,
  ]);

  useEffect(() => {
    if (!isYamlMode) {
      onSaveButtonPropsChange?.(refineFormResult.formResult.saveButtonProps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYamlMode, onSaveButtonPropsChange]);

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
