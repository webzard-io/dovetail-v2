import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FormLayout from 'src/components/FormLayout';
import { YamlEditorComponent } from 'src/components/YamlEditor/YamlEditorComponent';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import useEagleForm from 'src/hooks/useEagleForm';
import { getCommonErrors } from 'src/utils/error';

const EditorStyle = css`
  flex: 1;
  height: 100%;
`;

interface YamlFormProps {
  initialValues?: Record<string, unknown>;
}

function YamlForm(props: YamlFormProps) {
  const { formProps, saveButtonProps, editorProps, errorResponseBody, mutationResult } = useEagleForm();
  const kit = useUIKit();
  const { t, i18n } = useTranslation();
  const responseErrors = errorResponseBody ? getCommonErrors(errorResponseBody, i18n) : [];

  return (
    <FormLayout>
      <kit.form
        {...formProps}
        initialValues={formProps.initialValues ?? props.initialValues ?? BASE_INIT_VALUE}
        layout="horizontal"
      >
        {
          editorProps.schema ? (
            <>
              <kit.form.Item style={{ flex: 1 }}>
                <YamlEditorComponent
                  {...editorProps}
                  className={EditorStyle}
                  schema={editorProps.schema}
                  collapsable={false}
                />
              </kit.form.Item>
              <kit.form.Item>
                {mutationResult.error && <kit.alert
                  message={errorResponseBody ? (
                    <ul>
                      {responseErrors.map((error, index)=> (
                        <li key={error}>{responseErrors.length > 1 ? index + 1 + '. ' : ''}{error}</li>
                      ))}
                    </ul>
                  ) : mutationResult.error.message}
                  type="error"
                  style={{ marginTop: 16 }} />}
                <kit.button {...saveButtonProps} type="primary" style={{ marginTop: 16 }}>
                  {t('save')}
                </kit.button>
              </kit.form.Item>
            </>
          ) : (
            <kit.loading />
          )
        }
      </kit.form>
    </FormLayout>
  );
}

export default YamlForm;
