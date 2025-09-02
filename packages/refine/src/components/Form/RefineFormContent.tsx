import { Fields, Form, Space } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { UseFormReturnType } from '@refinedev/react-hook-form';
import { get } from 'lodash-es';
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormItemLayout, RefineFormFieldRenderProps } from 'src/components/Form/type';
import { ResourceModel } from 'src/models';
import { CommonFormConfig, FormType, RefineFormConfig, ResourceConfig } from 'src/types';
import { FormErrorAlert } from '../FormErrorAlert';
import useFieldsConfig from './useFieldsConfig';

const VerticalFormItemStyle = css`
  &.ant-form-item {
    flex-direction: column !important;
    gap: 8px;
  }
`;

type Props<Model extends ResourceModel> = {
  config?: ResourceConfig<Model>;
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
          className={css`
            max-width: 144px;
          `}
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

export const RefineFormContent = <Model extends ResourceModel>(props: Props<Model>) => {
  const { config, formResult, resourceId, errorMsgs, formConfig } = props;
  const { control, getValues, watch, trigger } = formResult;
  const action = resourceId ? 'edit' : 'create';
  const formValues = watch();

  const formFieldsConfig = useFieldsConfig(config, formConfig, resourceId);

  const fields = formFieldsConfig?.map(fieldConfig => {
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
            formValue: formValues,
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

  return (
    <Space
      direction="vertical"
      size={16}
      className={css`
        flex-basis: 58%;
        width: 100%;
        margin: 0 auto;
      `}
    >
      {fields}
      <FormErrorAlert
        errorMsgs={errorMsgs || []}
        style={{ marginBottom: 16 }}
        isEdit={action === 'edit'}
      />
    </Space>
  );
};
