import { Fields, Form, Space } from '@cloudtower/eagle';
import { UseFormReturnType } from '@refinedev/react-hook-form';
import { get } from 'lodash-es';
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormItemLayout, RefineFormFieldRenderProps } from 'src/components/Form/type';
import { SectionTitle } from 'src/components/SectionTitle';
import { ResourceModel } from 'src/models';
import { CommonFormConfig, FormType, RefineFormConfig, ResourceConfig } from 'src/types';
import { FormErrorAlert } from '../FormErrorAlert';
import { IntegerStyle, SpaceStyle, VerticalFormItemStyle } from './styles';
import useFieldsConfig from './useFieldsConfig';

type RefineFormContentProps<Model extends ResourceModel> = {
  config?: ResourceConfig<Model>;
  step: number;
  formConfig?: CommonFormConfig & RefineFormConfig;
  formResult: UseFormReturnType;
  errorMsgs?: string[];
  resourceId?: string;
};

export function renderCommonFormFiled(props: RefineFormFieldRenderProps) {
  const { field, fieldConfig, action } = props;
  const { value, onChange, onBlur, name } = field;

  let ele = (
    <Fields.String
      placeholder={fieldConfig.placeholder}
      input={{ value, onChange, onBlur, name, onFocus: () => null }}
      meta={{}}
    />
  );

  switch (fieldConfig.type) {
    case 'number':
      ele = (
        <Fields.Integer
          className={IntegerStyle}
          placeholder={fieldConfig.placeholder}
          input={{ value, onChange, onBlur, name, onFocus: () => null }}
          meta={{}}
        />
      );
  }

  // editing name is not allowed
  if (action === 'edit' && fieldConfig.disabledWhenEdit) {
    ele = <div>{value}</div>;
  }

  return ele;
}

type FieldsContentProps<Model extends ResourceModel> = Pick<
  RefineFormContentProps<Model>,
  'config' | 'formConfig' | 'resourceId' | 'step' | 'formResult'
> & {
  fields: RefineFormConfig['fields'];
};

function FieldsContent<Model extends ResourceModel>(props: FieldsContentProps<Model>) {
  const { config, formConfig, resourceId, step, formResult, fields } = props;
  const { control, getValues, watch, trigger } = formResult;
  const action = resourceId ? 'edit' : 'create';
  const formValues = watch();

  const formFieldsConfig = useFieldsConfig(config, { fields }, resourceId, step);

  const fieldsEle = formFieldsConfig?.map(fieldConfig => {
    if ('fields' in fieldConfig) {
      return (
        <>
          <SectionTitle
            title={fieldConfig.title}
            collapsable={fieldConfig.collapsable}
            defaultCollapse={fieldConfig.defaultCollapse}
          >
            <FieldsContent
              config={config}
              formConfig={formConfig}
              resourceId={resourceId}
              step={step}
              formResult={formResult}
              fields={fieldConfig.fields}
            />
          </SectionTitle>
        </>
      );
    }

    const isDisplay =
      fieldConfig.condition?.(formValues, get(formValues, fieldConfig.path.join('.'))) !==
      false;

    return isDisplay ? (
      <Controller
        key={fieldConfig.key}
        control={control}
        name={fieldConfig.path.join('.')}
        rules={{
          async validate(value) {
            const formValue = getValues();
            if (!fieldConfig.validators || fieldConfig.validators.length === 0)
              return true;
            for (const func of fieldConfig.validators) {
              const { isValid, errorMsg } = await func(value, formValue, FormType.FORM);
              if (!isValid) return errorMsg;
            }
            return true;
          },
        }}
        render={({ field, fieldState }) => {
          const renderProps: RefineFormFieldRenderProps = {
            field,
            fieldConfig,
            action,
            control,
            trigger,
          };

          let ele = null;

          if (fieldConfig?.render) {
            ele = fieldConfig.render(renderProps);
          } else {
            ele = renderCommonFormFiled(renderProps);
          }

          return (
            <Form.Item
              key={fieldConfig.key}
              label={fieldConfig.label}
              colon={false}
              labelCol={
                fieldConfig.layout === FormItemLayout.VERTICAL
                  ? {}
                  : { flex: `0 0 ${formConfig?.labelWidth || '216px'}` }
              }
              help={fieldConfig.isHideErrorStatus ? '' : fieldState.error?.message}
              extra={fieldConfig.helperText}
              validateStatus={
                fieldState.invalid && !fieldConfig.isHideErrorStatus ? 'error' : undefined
              }
              data-test-id={fieldConfig.key}
              className={
                fieldConfig.layout === FormItemLayout.VERTICAL
                  ? VerticalFormItemStyle
                  : ''
              }
            >
              {ele}
            </Form.Item>
          );
        }}
      />
    ) : null;
  });

  return <>{fieldsEle}</>;
}

export const RefineFormContent = <Model extends ResourceModel>(
  props: RefineFormContentProps<Model>
) => {
  const { config, formResult, resourceId, errorMsgs, formConfig, step } = props;
  const action = resourceId ? 'edit' : 'create';

  return (
    <Space direction="vertical" size={16} className={SpaceStyle}>
      <FieldsContent
        config={config}
        formConfig={formConfig}
        fields={formConfig?.fields}
        resourceId={resourceId}
        step={step}
        formResult={formResult}
      />
      <FormErrorAlert
        errorMsgs={errorMsgs || []}
        style={{ marginBottom: 16 }}
        isEdit={action === 'edit'}
      />
    </Space>
  );
};
