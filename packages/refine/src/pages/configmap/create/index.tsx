import { useUIKit } from '@cloudtower/eagle';
import { FormProps } from 'antd/lib/form';
import React from 'react';
import { KeyValueListWidget } from 'src/components/Form/KeyValueListWidget';
import { MetadataForm } from 'src/components/Form/MetadataForm';
import { YamlEditorComponent } from 'src/components/YamlEditor';
import useEagleForm from 'src/hooks/useEagleForm';

export const ConfigmapForm: React.FC<FormProps> = () => {
  const { formProps, saveButtonProps, editorProps, enableEditor, switchEditor } = useEagleForm({
    editorOptions: {
      isGenerateAnnotations: true,
    }
  });
  const kit = useUIKit();

  return (
    <kit.form
      {...formProps}
      onFinish={formProps.onFinish}
      layout="horizontal"
    >
      {
        enableEditor ? (
          editorProps.schema ? (
            <kit.form.Item>
              <YamlEditorComponent
                {...editorProps}
                schema={editorProps.schema}
              />
            </kit.form.Item>
          ) : (<kit.loading></kit.loading>)
        ) : (
          <>
            <MetadataForm />
            <kit.form.Item name={['data']} label="Data">
              <KeyValueListWidget />
            </kit.form.Item>
          </>
        )
      }
      <kit.form.Item>
        <kit.button
          {...saveButtonProps}
          type="primary"
        >Save</kit.button>
        <kit.button onClick={switchEditor}>Switch YAML</kit.button>
      </kit.form.Item>
    </kit.form>
  );
};
