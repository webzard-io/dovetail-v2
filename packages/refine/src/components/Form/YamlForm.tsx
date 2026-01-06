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
import React, { useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
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
          if (isLoadingSchema || (queryResult?.isLoading && action === 'edit')) {
            return <Loading />;
          }

          return editorProps.schemas || schemaStrategy !== SchemaStrategy.Required ? (
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
          ) : (
            <ErrorContent
              errorText={t('dovetail.fetch_schema_fail')}
              refetch={fetchSchema}
            ></ErrorContent>
          );
        })()}
      </Form>
    </FormWrapper>
  );
}
