import { useUIKit, message } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { FormAction, useResource } from '@refinedev/core';
import { Unstructured } from 'k8s-api-provider';
import React, { useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
import { FormErrorAlert } from 'src/components/FormErrorAlert';
import FormLayout from 'src/components/FormLayout';
import { YamlEditorComponent } from 'src/components/YamlEditor/YamlEditorComponent';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import { getCommonErrors } from 'src/utils/error';
import useYamlForm from './useYamlForm';

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

export interface YamlFormProps {
  id?: string;
  action?: FormAction;
  initialValues?: Record<string, unknown>;
  schemaStrategy?: SchemaStrategy;
  isShowLayout?: boolean;
  useFormProps?: Parameters<typeof useYamlForm>[0];
  transformInitValues?: (values: Unstructured) => Unstructured;
  transformApplyValues?: (values: Unstructured) => Unstructured;
  onSaveButtonPropsChange?: (saveButtonProps: {
    disabled?: boolean;
    onClick: () => void;
  }) => void;
  onErrorsChange?: (errors: string[]) => void;
  onFinish?: () => void;
}

export function YamlForm(props: YamlFormProps) {
  const {
    id,
    action: actionFromProps,
    schemaStrategy = SchemaStrategy.Optional,
    isShowLayout = true,
    useFormProps,
    transformInitValues,
    transformApplyValues,
    onSaveButtonPropsChange,
    onErrorsChange
  } = props;
  const { action: actionFromResource, resource } = useResource();
  const action = actionFromProps || actionFromResource;
  const {
    formProps,
    saveButtonProps,
    editorProps,
    errorResponseBody,
    mutationResult,
    isLoadingSchema,
    queryResult,
    fetchSchema,
  } = useYamlForm({
    id,
    action: actionFromProps,
    editorOptions: {
      isSkipSchema: schemaStrategy === SchemaStrategy.None,
    },
    liveMode: 'off',
    initialValuesForCreate: props.initialValues ?? BASE_INIT_VALUE,
    successNotification: false,
    errorNotification: false,
    transformInitValues,
    transformApplyValues,
    ...useFormProps,
  });
  const kit = useUIKit();
  const { t, i18n } = useTranslation();

  const FormWrapper = isShowLayout ? FormLayout : React.Fragment;
  // use useMemo to keep {} the same
  const schema = useMemo(() => {
    return editorProps.schema || {};
  }, [editorProps.schema]);
  const responseErrors = useMemo(() => (
    errorResponseBody
      ? getCommonErrors(errorResponseBody, i18n)
      : []
  ), [errorResponseBody, i18n]);

  const onFinish = useCallback(
    async store => {
      const result = await formProps.onFinish?.(store);

      if (result) {
        message.success(
          i18n.t(action === 'create' ? 'dovetail.create_success_toast' : 'dovetail.save_yaml_success_toast', {
            kind: resource?.meta?.kind,
            name: result.data.id,
            interpolation: {
              escapeValue: false
            }
          }),
          4.5
        );
        props.onFinish?.();
      }
    },
    [formProps, props, action, i18n, resource]
  );

  useEffect(() => {
    onSaveButtonPropsChange?.(saveButtonProps);
  }, [saveButtonProps, onSaveButtonPropsChange]);
  useEffect(() => {
    onErrorsChange?.(responseErrors);
  }, [responseErrors, onErrorsChange]);

  return (
    <FormWrapper saveButtonProps={saveButtonProps}>
      <kit.form
        {...formProps}
        initialValues={formProps.initialValues}
        layout="horizontal"
        className={FormStyle}
        onFinish={onFinish}
      >
        {(() => {
          if (isLoadingSchema || (queryResult?.isLoading && action === 'edit')) {
            return <kit.loading />;
          }

          return editorProps.schema || schemaStrategy !== SchemaStrategy.Required ? (
            <>
              <kit.form.Item style={{ flex: 1 }}>
                <YamlEditorComponent
                  {...editorProps}
                  className={EditorStyle}
                  schema={schema}
                  collapsable={false}
                />
              </kit.form.Item>
              <kit.form.Item>
                {mutationResult.error && (
                  <FormErrorAlert
                    errorMsgs={
                      errorResponseBody ? responseErrors : [mutationResult.error.message]
                    }
                    style={{ marginBottom: 16 }}
                    isEdit={action === 'edit'}
                  />
                )}
              </kit.form.Item>
            </>
          ) : (
            <ErrorContent
              errorText={t('dovetail.fetch_schema_fail')}
              refetch={fetchSchema}
            ></ErrorContent>
          );
        })()}
      </kit.form>
    </FormWrapper>
  );
}
