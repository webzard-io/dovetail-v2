import { usePushModal, usePopModal } from '@cloudtower/eagle';
import { BaseRecord, CreateResponse, UpdateResponse, useOne } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React, { useMemo, useEffect, useRef } from 'react';
import { type SaveButtonProps } from 'src/components/Form/FormModal';
import usePathMap from 'src/hooks/usePathMap';
import { useResourceVersionCheck } from 'src/hooks/useResourceVersionCheck';
import { ResourceConfig } from 'src/types';
import { CommonFormConfig } from 'src/types';
import { YamlFormConfig } from 'src/types';
import { getInitialValues } from 'src/utils/form';
import { DataExpiredModal } from './DataExpiredModal';
import { YamlForm, YamlFormProps } from './YamlForm';

export interface YamlFormContainerProps {
  id: string;
  resourceConfig: Pick<
    ResourceConfig,
    | 'name'
    | 'displayName'
    | 'kind'
    | 'initValue'
    | 'apiVersion'
    | 'basePath'
    | 'formConfig'
    | 'dataProviderName'
    | 'parent'
  >;
  customYamlFormProps?: YamlFormProps;
  formConfig?: YamlFormConfig & CommonFormConfig;
  onSuccess?: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => void;
  onError?: () => void;
  onSaveButtonPropsChange?: (props: SaveButtonProps) => void;
}

function YamlFormContainer({
  id,
  customYamlFormProps,
  resourceConfig,
  formConfig,
  onSuccess,
  onError,
  onSaveButtonPropsChange,
}: YamlFormContainerProps) {
  const action = id ? 'edit' : 'create';
  const pushModal = usePushModal();
  const popModal = usePopModal();
  const hasShownExpiredRef = useRef(false);

  const queryResult = useOne({
    resource: resourceConfig.name,
    id,
    liveMode: id ? 'auto' : 'off',
    queryOptions: { enabled: !!id },
  });

  const isExpired = useResourceVersionCheck({ queryResult });

  useEffect(() => {
    if (isExpired && !hasShownExpiredRef.current) {
      hasShownExpiredRef.current = true;
      pushModal<'DataExpiredModal'>({
        component: DataExpiredModal,
        props: {
          onAbandon: () => {
            popModal();
          },
        },
      });
    }
  }, [isExpired, pushModal, popModal]);

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
      resource: resourceConfig.name,
      resourceConfig,
      transformInitValues,
      transformApplyValues,
      beforeSubmit: formConfig?.beforeSubmit,
      initialValuesForCreate:
        customYamlFormProps?.initialValuesForCreate || getInitialValues(resourceConfig),
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
    resourceConfig,
    formConfig?.beforeSubmit,
    transformInitValues,
    transformApplyValues,
    onSuccess,
    onError,
    onSaveButtonPropsChange,
  ]);

  return <YamlForm {...yamlFormProps} />;
}

export default YamlFormContainer;
