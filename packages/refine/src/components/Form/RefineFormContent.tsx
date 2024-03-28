import { Fields, Form, Space } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { UseFormReturnType } from '@refinedev/react-hook-form';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ResourceModel } from '../../models';
import { ResourceConfig } from '../../types';
import { FormErrorAlert } from '../FormErrorAlert';

type Props<Model extends ResourceModel> = {
  config?: ResourceConfig<Model>;
  formResult: UseFormReturnType;
  errorMsg?: string;
  action?: 'create' | 'edit';
};

export const RefineFormContent = <Model extends ResourceModel>(props: Props<Model>) => {
  const { config, formResult, action, errorMsg } = props;
  const { control, getValues } = formResult;

  const fields = config?.formConfig?.fields?.map(c => {
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
              input={{ value, onChange, onBlur, name, onFocus: () => null }}
              meta={{}}
            />
          );
          switch (c.type) {
            case 'number':
              ele = (
                <Fields.Integer
                  input={{ value, onChange, onBlur, name, onFocus: () => null }}
                  meta={{}}
                />
              );
          }

          // editing name is not allowed
          if (action === 'edit' && c.key === 'name') {
            ele = <div>{value}</div>;
          }

          if (c?.render) {
            ele = c.render(value, onChange, formValue, onBlur);
          }

          return (
            <Form.Item
              key={c.key}
              label={c.label}
              labelCol={{ flex: '0 0 216px' }}
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
      className={css`
        flex-basis: 58%;
        width: 100%;
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
