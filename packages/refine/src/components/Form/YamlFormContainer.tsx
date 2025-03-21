import { Unstructured } from 'k8s-api-provider';
import React, { useMemo } from 'react';
import { type SaveButtonProps } from 'src/components/Form/FormModal';
import { ResourceConfig } from 'src/types';
import { CommonFormConfig } from 'src/types';
import { YamlFormConfig } from 'src/types';
import { YamlForm, YamlFormProps } from './YamlForm';

interface YamlFormContainerProps {
  id: string;
  config: ResourceConfig;
  customYamlFormProps?: YamlFormProps;
  formConfig?: YamlFormConfig & CommonFormConfig;
  onSuccess?: () => void;
  onError?: () => void;
  onSaveButtonPropsChange?: (props: SaveButtonProps) => void;
}

function YamlFormContainer({
  id,
  customYamlFormProps,
  config,
  formConfig,
  onSuccess,
  onError,
  onSaveButtonPropsChange
}: YamlFormContainerProps) {
  const action = id ? 'edit' : 'create';
  const yamlFormProps: YamlFormProps = useMemo(
    () => {
      const transformApplyValues = formConfig?.transformApplyValues || ((v: Record<string, unknown>) => v as Unstructured);

      return {
        ...customYamlFormProps,
        config,
        transformInitValues: formConfig?.transformInitValues,
        transformApplyValues: transformApplyValues,
        initialValuesForCreate: (customYamlFormProps?.initialValuesForCreate || config.initValue),
        initialValuesForEdit: undefined,
        id,
        action,
        isShowLayout: false,
        useFormProps: {
          redirect: false,
        },
        rules: undefined,
        onSaveButtonPropsChange,
        onErrorsChange(errors: string[]) {
          if (errors.length) {
            onError?.();
          }
        },
        onFinish: onSuccess,
      };
    },
    [
      id,
      action,
      customYamlFormProps,
      config,
      formConfig,
      onSuccess,
      onError,
      onSaveButtonPropsChange,
    ]
  );

  return (
    <YamlForm {...yamlFormProps} />
  );
}

export default YamlFormContainer;
