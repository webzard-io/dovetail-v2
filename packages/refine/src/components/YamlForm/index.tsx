import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FormLayout from 'src/components/FormLayout';
import { YamlEditorComponent } from 'src/components/YamlEditor/YamlEditorComponent';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import useEagleForm from 'src/hooks/useEagleForm';

const EditorStyle = css`
  flex: 1;
  height: 100%;
`;

interface YamlFormProps {
  initialValues?: Record<string, unknown>;
}

function YamlForm(props: YamlFormProps) {
  const { formProps, saveButtonProps, editorProps } = useEagleForm();
  const kit = useUIKit();
  const { t } = useTranslation();

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
