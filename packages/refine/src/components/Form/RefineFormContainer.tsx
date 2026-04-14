import { Alert, Loading, usePushModal, usePopModal } from '@cloudtower/eagle';
import { BaseRecord, CreateResponse, UpdateResponse } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React, { useMemo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { type SaveButtonProps } from 'src/components/Form/FormModal';
import usePathMap from 'src/hooks/usePathMap';
import { useResourceVersionCheck } from 'src/hooks/useResourceVersionCheck';
import i18n from 'src/i18n';
import { ResourceConfig } from 'src/types';
import { CommonFormConfig, RefineFormConfig } from 'src/types';
import { DataExpiredModal } from './DataExpiredModal';
import { RefineFormContent } from './RefineFormContent';
import useFieldsConfig from './useFieldsConfig';
import { useRefineForm } from './useRefineForm';
import { YamlForm, YamlFormProps } from './YamlForm';

interface RefineFormContainerProps {
  id: string;
  isYamlMode: boolean;
  resourceConfig: Pick<
    ResourceConfig,
    'name' | 'displayName' | 'kind' | 'initValue' | 'basePath' | 'formConfig'
  >;
  step: number;
  formConfig: (RefineFormConfig & CommonFormConfig) | undefined;
  customYamlFormProps?: YamlFormProps;
  options?: {
    initialValues?: Record<string, unknown>;
    customOptions?: Record<string, unknown>;
  };
  onSaveButtonPropsChange?: (props: SaveButtonProps) => void;
  onError?: () => void;
  onSuccess?: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => void;
}

export interface RefineFormContainerRef {
  validate: () => Promise<boolean>;
}

const RefineFormContainer = React.forwardRef<
  RefineFormContainerRef,
  RefineFormContainerProps
>(function RefineFormContainer(
  {
    id,
    resourceConfig,
    step,
    customYamlFormProps,
    formConfig,
    isYamlMode,
    options,
    onSuccess,
    onError,
    onSaveButtonPropsChange,
  },
  ref
) {
  const action = id ? 'edit' : 'create';
  const pushModal = usePushModal();
  const popModal = usePopModal();
  const hasShownExpiredRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refineFormResult = useRefineForm({
    resourceConfig: resourceConfig,
    id,
    refineProps: {
      onMutationSuccess: data => {
        onSuccess?.(data);
      },
      onMutationError() {
        setIsSubmitting(false);
        onError?.();
      },
      redirect: false,
      mutationMeta: {
        updateType: 'put',
      },
      ...formConfig?.refineCoreProps,
    },
    formConfig,
    options: {
      ...options,
      onBeforeSubmitError: (errors: string[]) => {
        if (errors.length) {
          setIsSubmitting(false);
          onError?.();
        }
      },
      onSubmitStart: () => {
        setIsSubmitting(true);
      },
      onSubmitAbort: () => {
        setIsSubmitting(false);
      },
    },
  });
  const isExpired = useResourceVersionCheck({
    queryResult: refineFormResult.formResult.refineCore.queryResult,
  });

  useEffect(() => {
    if (!isExpired || isSubmitting || hasShownExpiredRef.current) {
      return;
    }

    hasShownExpiredRef.current = true;
    pushModal<'DataExpiredModal'>({
      component: DataExpiredModal,
      props: {
        onAbandon: () => {
          popModal();
        },
      },
    });
  }, [isExpired, isSubmitting, pushModal, popModal]);

  const fieldsConfig = useFieldsConfig(
    resourceConfig,
    { fields: formConfig?.fields },
    id,
    step,
    options?.customOptions,
    refineFormResult.formResult.transformedInitValues
  );
  const { transformApplyValues } = usePathMap({
    pathMap: formConfig?.pathMap,
    transformInitValues: formConfig?.transformInitValues,
    transformApplyValues:
      formConfig?.transformApplyValues ||
      ((v: Record<string, unknown>) => v as Unstructured),
  });
  const yamlFormProps: YamlFormProps = useMemo(() => {
    if (isYamlMode) {
      return {
        ...customYamlFormProps,
        resource: resourceConfig.name,
        resourceConfig,
        transformInitValues: undefined,
        transformApplyValues: undefined,
        initialValuesForCreate: transformApplyValues(
          refineFormResult.formResult.getValues()
        ),
        initialValuesForEdit: transformApplyValues(
          refineFormResult.formResult.getValues()
        ),
        id,
        action,
        isShowLayout: false,
        useFormProps: {
          redirect: false,
          onSubmitStart: () => {
            setIsSubmitting(true);
          },
          onSubmitAbort: () => {
            setIsSubmitting(false);
          },
        },
        rules: fieldsConfig
          ?.filter(
            config => 'isSkipValidationInYaml' in config && !config.isSkipValidationInYaml
          )
          .map(config => ({
            path: 'path' in config ? config.path : [],
            validators: 'validators' in config ? config.validators : undefined,
          })),
        onSaveButtonPropsChange,
        beforeSubmit: formConfig?.beforeSubmit,
        onErrorsChange(errors: string[]) {
          if (errors.length) {
            onError?.();
          }
        },
        onFinish: onSuccess,
      };
    }

    return {
      resourceConfig,
    };
  }, [
    action,
    isYamlMode,
    customYamlFormProps,
    fieldsConfig,
    resourceConfig,
    id,
    refineFormResult,
    formConfig?.beforeSubmit,
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

  useImperativeHandle(
    ref,
    () => ({
      validate: () => {
        return refineFormResult.formResult.trigger();
      },
    }),
    [refineFormResult.formResult]
  );

  // 等获取到真实数据后再渲染表单
  if (
    action === 'edit' &&
    !(refineFormResult.formResult.getValues() as Unstructured)?.metadata?.name
  ) {
    return <Loading />;
  }

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
          resourceConfig={resourceConfig}
          step={step}
          formConfig={formConfig}
          errorMsgs={[
            ...refineFormResult.responseErrorMsgs,
            ...refineFormResult.beforeSubmitErrors,
          ]}
          resourceId={id as string}
          transformedInitValues={refineFormResult.formResult.transformedInitValues}
          customOptions={options?.customOptions}
        />
      )}
    </>
  );
});

export default RefineFormContainer;
