import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FormLayout from 'src/components/FormLayout';
import { YamlEditorComponent } from 'src/components/YamlEditor/YamlEditorComponent';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import useEagleForm from 'src/hooks/useEagleForm';
import { getCommonErrors } from 'src/utils/error';
import ErrorContent from 'src/components/ErrorContent';

const FormStyle = css`
  height: 100%;
`;
const EditorStyle = css`
  flex: 1;
  height: 100%;
`;

export enum SchemaStrategy {
  Required = 'Required',
  Optional = 'Optional',
  None = 'None'
}

interface YamlFormProps {
  initialValues?: Record<string, unknown>;
  schemaStrategy?: SchemaStrategy;
}

function YamlForm(props: YamlFormProps) {
  const { schemaStrategy = SchemaStrategy.Optional } = props;
  const {
    formProps,
    saveButtonProps,
    editorProps,
    errorResponseBody,
    mutationResult,
    isLoadingSchema,
    fetchSchema,
  } =
    useEagleForm({
      editorOptions: {
        isSkipSchema: schemaStrategy === SchemaStrategy.None,
      }
    });
  const kit = useUIKit();
  const { t, i18n } = useTranslation();
  const responseErrors = errorResponseBody
    ? getCommonErrors(errorResponseBody, i18n)
    : [];

  return (
    <FormLayout>
      <kit.form
        {...formProps}
        initialValues={formProps.initialValues ?? props.initialValues ?? BASE_INIT_VALUE}
        layout="horizontal"
        className={FormStyle}
      >
        {(()=> {
          if (isLoadingSchema) {
            return <kit.loading />;
          }

          return editorProps.schema || schemaStrategy !== SchemaStrategy.Required ? (
            <>
              <kit.form.Item style={{ flex: 1 }}>
                <YamlEditorComponent
                  {...editorProps}
                  className={EditorStyle}
                  schema={editorProps.schema || {}}
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
                <kit.button {...saveButtonProps} type="primary" style={{ marginTop: 16 }}>
                  {t('save')}
                </kit.button>
              </kit.form.Item>
            </>
          ) : (
            <ErrorContent errorText={t('dovetail.fetch_schema_fail')} refetch={fetchSchema}></ErrorContent>
          );
        })()}
      </kit.form>
    </FormLayout>
  );
}

export default YamlForm;
