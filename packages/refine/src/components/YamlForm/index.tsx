import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React, { useMemo, useCallback, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorContent from 'src/components/ErrorContent';
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
`;

export enum SchemaStrategy {
  Required = 'Required',
  Optional = 'Optional',
  None = 'None',
}

export interface YamlFormProps {
  id?: string;
  initialValues?: Record<string, unknown>;
  schemaStrategy?: SchemaStrategy;
  isShowLayout?: boolean;
  onFinish?: () => void;
}

export interface YamlFormHandler {
  saveButtonProps: {
    disabled?: boolean;
    onClick: () => void;
  }
}

const YamlForm = React.forwardRef<YamlFormHandler, YamlFormProps>(function YamlForm(props: YamlFormProps, ref) {
  const { id, schemaStrategy = SchemaStrategy.Optional, isShowLayout = true } = props;
  const {
    formProps,
    saveButtonProps,
    editorProps,
    errorResponseBody,
    mutationResult,
    isLoadingSchema,
    fetchSchema,
  } = useEagleForm({
    id,
    action: id ? 'edit' : 'create',
    editorOptions: {
      isSkipSchema: schemaStrategy === SchemaStrategy.None,
    },
    liveMode: 'off',
    initialValuesForCreate: props.initialValues ?? BASE_INIT_VALUE
  });
  const kit = useUIKit();
  const { t, i18n } = useTranslation();
  const responseErrors = errorResponseBody
    ? getCommonErrors(errorResponseBody, i18n)
    : [];

  const FormWrapper = isShowLayout ? FormLayout : React.Fragment;
  // use useMemo to keep {} the same
  const schema = useMemo(() => {
    return editorProps.schema || {};
  }, [editorProps.schema]);

  const onFinish = useCallback(async (store) => {
    await formProps.onFinish?.(store);
    props.onFinish?.();
  }, [formProps, props]);

  useImperativeHandle(ref, () => ({
    saveButtonProps,
  }), [saveButtonProps]);

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
          if (isLoadingSchema) {
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
                  <kit.alert
                    message={
                      errorResponseBody ? (
                        <ul>
                          {responseErrors.map((error, index) => (
                            <li key={error}>
                              {responseErrors.length > 1 ? index + 1 + '. ' : ''}
                              {error}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        mutationResult.error.message
                      )
                    }
                    type="error"
                    style={{ marginTop: 16 }}
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
});

export default YamlForm;
