import { Form, Loading } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import {
  BaseRecord,
  CreateResponse,
  FormAction,
  UpdateResponse,
  useResource,
} from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorContent } from 'src/components/ErrorContent';
import { FormErrorAlert } from 'src/components/FormErrorAlert';
import FormLayout from 'src/components/FormLayout';
import { YamlEditorComponent } from 'src/components/YamlEditor/YamlEditorComponent';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import { ResourceModel } from 'src/models';
import { ResourceConfig } from 'src/types';
import { getCommonErrors } from 'src/utils/error';
import { transformResourceKindInSentence } from 'src/utils/string';
import useYamlForm from './useYamlForm';
import { YamlFormRule } from './useYamlForm';

const FormStyle = css``;
const EditorStyle = css`
  flex: 1;
  height: 100%;
  margin-bottom: 16px;
`;

export enum SchemaStrategy {
  Required = 'Required',
  Optional = 'Optional',
  None = 'None',
}

export interface YamlFormProps<Model extends ResourceModel = ResourceModel> {
  id?: string;
  resource?: string;
  action?: FormAction;
  resourceConfig: Pick<
    ResourceConfig<Model>,
    'displayName' | 'dataProviderName' | 'basePath' | 'kind' | 'parent'
  >;
  initialValuesForCreate?: Record<string, unknown>;
  initialValuesForEdit?: Record<string, unknown>;
  schemaStrategy?: SchemaStrategy;
  isShowLayout?: boolean;
  useFormProps?: Parameters<typeof useYamlForm>[0];
  rules?: YamlFormRule[];
  transformInitValues?: (values: Record<string, unknown>) => Record<string, unknown>;
  transformApplyValues?: (values: Unstructured) => Unstructured;
  beforeSubmit?: (
    values: Unstructured,
    setErrors: (errors: string[]) => void
  ) => Promise<Unstructured>;
  onSaveButtonPropsChange?: (saveButtonProps: {
    disabled?: boolean;
    onClick: () => void;
    loading?: boolean | { delay?: number | undefined };
  }) => void;
  onErrorsChange?: (errors: string[]) => void;
  onFinish?: (data: UpdateResponse<BaseRecord> | CreateResponse<BaseRecord>) => void;
}

export function YamlForm<Model extends ResourceModel = ResourceModel>(
  props: YamlFormProps<Model>
) {
  const {
    id,
    resource: resourceFromProps,
    action: actionFromProps,
    schemaStrategy = SchemaStrategy.Optional,
    isShowLayout = true,
    useFormProps,
    resourceConfig,
    transformInitValues,
    transformApplyValues,
    beforeSubmit,
    onSaveButtonPropsChange,
    onErrorsChange,
    rules,
  } = props;
  const { action: actionFromResource, resource } = useResource({
    resourceNameOrRouteName: resourceFromProps,
  });
  const action = actionFromProps || actionFromResource;
  const { t, i18n } = useTranslation();
  // 编辑器是非受控的，挂载后不能再被卸载，否则会丢掉用户正在编辑的内容，
  // 因此用它区分「首次加载」与「编辑器已经渲染之后的后台刷新」。
  const hasRenderedEditor = useRef(false);
  const {
    formProps,
    saveButtonProps,
    editorProps,
    errorResponseBody,
    beforeSubmitErrors,
    mutationResult,
    isLoadingSchema,
    queryResult,
    fetchSchema,
  } = useYamlForm({
    id,
    action: actionFromProps,
    resource: resource?.name,
    dataProviderName: resourceConfig.dataProviderName,
    editorOptions: {
      isSkipSchema: schemaStrategy === SchemaStrategy.None,
    },
    liveMode: 'off',
    initialValuesForCreate: props.initialValuesForCreate ?? BASE_INIT_VALUE,
    initialValuesForEdit: props.initialValuesForEdit,
    rules,
    beforeSubmit,
    successNotification(data) {
      const displayName = resourceConfig.displayName || resource?.meta?.kind;
      return {
        message: i18n
          .t(
            action === 'create'
              ? 'dovetail.create_success_toast'
              : 'dovetail.save_yaml_success_toast',
            {
              kind: transformResourceKindInSentence(displayName, i18n.language),
              name: data?.data.id,
              interpolation: {
                escapeValue: false,
              },
            }
          )
          .trim(),
        type: 'success',
      };
    },
    errorNotification: false,
    transformInitValues,
    transformApplyValues,
    mutationMeta: {
      updateType: 'put',
      dataProviderName: resourceConfig.dataProviderName,
      resourceBasePath: resourceConfig.basePath,
      kind: resourceConfig.kind,
      label: `${resourceConfig.kind}s`,
    },
    ...useFormProps,
  });

  const FormWrapper = isShowLayout ? FormLayout : React.Fragment;
  const formWrapperProps = isShowLayout ? { saveButtonProps } : {};
  const responseErrors = useMemo(
    () => (errorResponseBody ? getCommonErrors(errorResponseBody, i18n) : []),
    [errorResponseBody, i18n]
  );
  const finalErrors = useMemo(() => {
    if (beforeSubmitErrors.length) {
      return beforeSubmitErrors;
    }
    if (mutationResult.error) {
      if (responseErrors.length) {
        return responseErrors;
      }
      return [mutationResult.error.message];
    }
    return [];
  }, [responseErrors, beforeSubmitErrors, mutationResult.error]);

  const onFinish = useCallback(
    async store => {
      try {
        const result = await formProps.onFinish?.(store);
        if (result) {
          props.onFinish?.(result);
        }
      } catch {
      } finally {
        onSaveButtonPropsChange?.({
          ...saveButtonProps,
          loading: false,
        });
      }
    },
    [formProps, props, saveButtonProps, onSaveButtonPropsChange]
  );

  useEffect(() => {
    onSaveButtonPropsChange?.(saveButtonProps);
  }, [saveButtonProps, onSaveButtonPropsChange]);
  useEffect(() => {
    onErrorsChange?.(finalErrors);
  }, [finalErrors, onErrorsChange]);

  return (
    <FormWrapper {...formWrapperProps}>
      <Form
        {...formProps}
        initialValues={formProps.initialValues}
        layout="horizontal"
        className={FormStyle}
        onFinish={onFinish}
      >
        {(() => {
          // 编辑器内容只在 onEditorCreate 时写入一次，之后 queryResult 刷新不会重新填充。
          // 而 isLoading 在命中 react-query 缓存时为 false，会用尚未刷新的旧数据初始化编辑器，
          // 导致刚保存完立刻重新打开时看到旧内容，所以首次加载要等到本次刷新结束。
          // 但只能拦首次：编辑器挂载后若再因后台刷新被替换成 Loading，用户已输入的内容会丢失。
          const isWaitingInitialData =
            action === 'edit' && !hasRenderedEditor.current && !!queryResult?.isFetching;

          if (isLoadingSchema || isWaitingInitialData) {
            return <Loading />;
          }

          if (!editorProps.schemas && schemaStrategy === SchemaStrategy.Required) {
            return (
              <ErrorContent
                errorText={t('dovetail.fetch_schema_fail')}
                refetch={fetchSchema}
              ></ErrorContent>
            );
          }

          hasRenderedEditor.current = true;

          return (
            <>
              <Form.Item style={{ flex: 1 }}>
                <YamlEditorComponent<string>
                  {...editorProps}
                  className={EditorStyle}
                  collapsable={false}
                />
              </Form.Item>
              <Form.Item>
                {finalErrors.length > 0 && (
                  <FormErrorAlert
                    errorMsgs={finalErrors}
                    style={{ marginBottom: 16 }}
                    isEdit={action === 'edit'}
                  />
                )}
              </Form.Item>
            </>
          );
        })()}
      </Form>
    </FormWrapper>
  );
}
