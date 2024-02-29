import { Fields, Form, Space } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { ResourceModel } from '../../models';
import { ResourceConfig } from '../../types';

type Props<Model extends ResourceModel> = {
  config?: ResourceConfig<Model>;
  control: Control;
};

export const RefineFormContent = <Model extends ResourceModel>(props: Props<Model>) => {
  const { config, control } = props;

  const fields = config?.formConfig?.fields.map(c => {
    return (
      <Controller
        key={c.key}
        control={control}
        name={c.path.join('.')}
        rules={{
          validate(value, formValues) {
            if (!c.validators || c.validators.length === 0) return true;
            for (const func of c.validators) {
              const { isValid, errorMsg } = func(value, formValues);
              if (!isValid) return errorMsg;
            }
            return true;
          },
        }}
        render={({ field: { onChange, onBlur, value, name }, fieldState, formState }) => {
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
    </Space>
  );
};
