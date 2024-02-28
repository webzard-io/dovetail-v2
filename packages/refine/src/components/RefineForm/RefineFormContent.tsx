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
      <Form.Item key={c.key} label={c.label} labelCol={{ flex: '0 0 216px' }}>
        <Controller
          control={control}
          name={c.path.join('.')}
          render={({ field: { onChange, onBlur, value, name } }) => {
            switch (c.type) {
              case 'number':
                return (
                  <Fields.Integer
                    input={{ value, onChange, onBlur, name, onFocus: () => null }}
                    meta={{}}
                  />
                );
              default:
                return (
                  <Fields.String
                    input={{ value, onChange, onBlur, name, onFocus: () => null }}
                    meta={{}}
                  />
                );
            }
          }}
        />
      </Form.Item>
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
