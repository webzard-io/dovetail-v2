import { BaseRecord, CreateResponse, UpdateResponse } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React, { useMemo } from 'react';
import { type SaveButtonProps } from 'src/components/Form/FormModal';
import usePathMap from 'src/hooks/usePathMap';
import { ResourceConfig } from 'src/types';
import { CommonFormConfig } from 'src/types';
import { YamlFormConfig } from 'src/types';
import { getInitialValues } from 'src/utils/form';
import { YamlForm, YamlFormProps } from './YamlForm';

interface YamlFormContainerProps {
  id: string;
  config: ResourceConfig;
  customYamlFormProps?: YamlFormProps;
  formConfig?: YamlFormConfig & CommonFormConfig;
  onSuccess?: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => void;
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
  onSaveButtonPropsChange,
}: YamlFormContainerProps) {
  const action = id ? 'edit' : 'create';
  const { transformInitValues, transformApplyValues } = usePathMap({
    pathMap: formConfig?.pathMap,
    transformInitValues: formConfig?.transformInitValues,
    transformApplyValues:
      formConfig?.transformApplyValues ||
      ((v: Record<string, unknown>) => v as Unstructured),
  });
  const yamlFormProps: YamlFormProps = useMemo(() => {
    return {
      ...customYamlFormProps,
      config,
      transformInitValues,
      transformApplyValues,
      initialValuesForCreate:
        customYamlFormProps?.initialValuesForCreate || getInitialValues(config),
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
  }, [
    id,
    action,
    customYamlFormProps,
    config,
    transformInitValues,
    transformApplyValues,
    onSuccess,
    onError,
    onSaveButtonPropsChange,
  ]);

  return <YamlForm {...yamlFormProps} />;
}

export default YamlFormContainer;
