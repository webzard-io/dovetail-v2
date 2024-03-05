import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { FormAction, useResource } from '@refinedev/core';
import React, { useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
import { FormErrorAlert } from 'src/components/FormErrorAlert';
import FormLayout from 'src/components/FormLayout';
import { YamlEditorComponent } from 'src/components/YamlEditor/YamlEditorComponent';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import useEagleForm from 'src/hooks/useEagleForm';
import { getCommonErrors } from 'src/utils/error';

const FormStyle = css`
`;
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
  useFormProps?: Parameters<typeof useEagleForm>[0];
  onSaveButtonPropsChange?: (saveButtonProps: {
    disabled?: boolean;
    onClick: () => void;
  }) => void;
  onErrorsChange?: (errors: string[]) => void;
  onFinish?: () => void;
}

function YamlForm(props: YamlFormProps) {
  const {
    id,
    action: actionFromProps,
    schemaStrategy = SchemaStrategy.Optional,
    isShowLayout = true,
    useFormProps,
    onSaveButtonPropsChange,
    onErrorsChange
  } = props;
  const { action: actionFromResource } = useResource();
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
  } = useEagleForm({
    id,
    action: actionFromProps,
    editorOptions: {
      isSkipSchema: schemaStrategy === SchemaStrategy.None,
    },
    liveMode: 'off',
    initialValuesForCreate: props.initialValues ?? BASE_INIT_VALUE,
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

  const onFinish = useCallback(async (store) => {
    const result = await formProps.onFinish?.(store);

    if (result) {
      props.onFinish?.();
    }
  }, [formProps, props]);

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
                    errorMsgs={errorResponseBody ? responseErrors : [mutationResult.error.message]}
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

export default YamlForm;
