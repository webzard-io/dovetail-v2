import { Fields, Form, Space, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { UseFormReturnType } from '@refinedev/react-hook-form';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ResourceModel } from 'src/models';
import { ResourceConfig } from 'src/types';
import { FormErrorAlert } from '../FormErrorAlert';
import useFieldsConfig from './useFieldsConfig';

type Props<Model extends ResourceModel> = {
  config?: ResourceConfig<Model>;
  formResult: UseFormReturnType;
  errorMsg?: string;
  resourceId?: string;
};

export const RefineFormContent = <Model extends ResourceModel>(props: Props<Model>) => {
  const { config, formResult, resourceId, errorMsg } = props;
  const { control, getValues } = formResult;
  const action = resourceId ? 'edit' : 'create';

  const formFieldsConfig = useFieldsConfig(config, resourceId);

  const fields = formFieldsConfig?.map(c => {
    return (
      <Controller
        key={c.key}
        control={control}
        name={c.path.join('.')}
        rules={{
          validate(value) {
            const formValue = getValues();
            if (!c.validators || c.validators.length === 0) return true;
            for (const func of c.validators) {
              const { isValid, errorMsg } = func(value, formValue);
              if (!isValid) return errorMsg;
            }
            return true;
          },
        }}
        render={({ field: { onChange, onBlur, value, name }, fieldState }) => {
          const formValue = getValues();
          let ele = (
            <Fields.String
              placeholder={c.placeholder}
              input={{ value, onChange, onBlur, name, onFocus: () => null }}
              meta={{}}
            />
          );
          switch (c.type) {
            case 'number':
              ele = (
                <Fields.Integer
                  className={css`
                    max-width: 144px;
                  `}
                  placeholder={c.placeholder}
                  input={{ value, onChange, onBlur, name, onFocus: () => null }}
                  meta={{}}
                />
              );
          }

          // editing name is not allowed
          if (action === 'edit' && c.disabledWhenEdit) {
            ele = <div>{value}</div>;
          }


          if (c?.render) {
            ele = c.render(value, onChange, formValue, onBlur, action, control);
          }

          // add helper text
          if (c.helperText) {
            ele = (
              <Space
                size={4}
                direction="vertical"
                className={css`
                  width: 100%;
                `}
              >
                {ele}
                <div
                  className={cx(
                    Typo.Footnote.f2_regular,
                    css`
                      color: rgba(44, 56, 82, 0.6);
                    `
                  )}
                >
                  {c.helperText}
                </div>
              </Space>
            );
          }

          return (
            <Form.Item
              key={c.key}
              label={c.label}
              colon={false}
              labelCol={{ flex: `0 0 ${config?.formConfig?.labelWidth || '216px'}` }}
              help={fieldState.error?.message}
              validateStatus={fieldState.invalid ? 'error' : undefined}
            >
              {ele}
            </Form.Item>
          );
        }}
      />
    );
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
        errorMsgs={errorMsg ? [errorMsg] : []}
        style={{ marginBottom: 16 }}
        isEdit={action === 'edit'}
      />
    </Space>
  );
};
