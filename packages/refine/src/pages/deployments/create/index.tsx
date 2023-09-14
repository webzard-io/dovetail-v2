import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import useEagleForm from '../../../hooks/useEagleForm';
import { FormProps } from 'antd/lib/form';
import { toLabelsRecord } from "../../../utils/labels";
import { useUIKit } from '@cloudtower/eagle';

export const DeploymentCreate: React.FC<FormProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useEagleForm();
  const kit = useUIKit();

  return (
    <kit.form
      {...formProps}
      onFinish={(values) => {
        (values as any).metadata.labels = toLabelsRecord(
          (values as any).metadata.labels
        );
        (values as any).spec.selector = {
          matchLabels: {
            'workload.user.cattle.io/workloadselector': 'apps.deployment-default-undefined',
          }
        };
        (values as any).spec.template.metadata = {
          labels: {
            'workload.user.cattle.io/workloadselector': 'apps.deployment-default-undefined',
          }
        };
        formProps.onFinish?.(values);
      }}
      style={{
        width: '500px'
      }}
      layout="vertical"
    >
      <kit.form.Item
        label="Name"
        name={["metadata", "name"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <kit.input />
      </kit.form.Item>
      <kit.form.List name={["metadata", "labels"]}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field) => {
                return (
                  <kit.space key={field.key}>
                    <kit.form.Item
                      label="key"
                      name={[field.name, "key"]}
                      style={{ width: "300px" }}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <kit.input />
                    </kit.form.Item>

                    <kit.form.Item
                      label="value"
                      name={[field.name, "value"]}
                      style={{ width: "300px" }}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <kit.input />
                    </kit.form.Item>
                    <kit.button type="text" onClick={() => remove(field.name)}>
                      Remove
                    </kit.button>
                  </kit.space>
                );
              })}
              <kit.form.Item>
                <kit.button
                  type="dashed"
                  onClick={() => {
                    add({ key: '', value: '' });
                  }}
                  style={{ marginTop: 20 }}
                >
                  Add Label
                </kit.button>
              </kit.form.Item>
            </>
          );
        }}
      </kit.form.List>
      <kit.form.List name={["metadata", "annotations"]}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field) => {
                return (
                  <kit.space key={field.key}>
                    <kit.form.Item
                      label="key"
                      name={[field.name, "key"]}
                      style={{ width: "300px" }}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <kit.input />
                    </kit.form.Item>

                    <kit.form.Item
                      label="value"
                      name={[field.name, "value"]}
                      style={{ width: "300px" }}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <kit.input />
                    </kit.form.Item>
                    <kit.button type="text" onClick={() => remove(field.name)}>
                      Remove
                    </kit.button>
                  </kit.space>
                );
              })}
              <kit.form.Item>
                <kit.button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ marginTop: 20 }}
                >
                  Add Annotation
                </kit.button>
              </kit.form.Item>
            </>
          );
        }}
      </kit.form.List>
      <kit.form.List name={['spec', 'template', 'spec', 'containers']}>
        {(fields, { add, remove }) => {
          return (
            <>
              {
                fields.map((field) => (
                  <kit.space key={field.key}>
                    <kit.form.Item label="Container name" name={[field.name, 'name']}>
                      <kit.input></kit.input>
                    </kit.form.Item>
                    <kit.form.Item label="Container image" name={[field.name, 'image']}>
                      <kit.input />
                    </kit.form.Item>
                    <kit.button type="text" onClick={() => remove(field.name)}>
                      Remove
                    </kit.button>
                  </kit.space>
                ))
              }
              <kit.form.Item>
                <kit.button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ marginTop: 20 }}
                >
                  Add Container
                </kit.button>
              </kit.form.Item>
            </>
          )
        }}
      </kit.form.List>
      <kit.form.Item>
        <kit.button {...saveButtonProps} type="primary">Save</kit.button>
      </kit.form.Item>
    </kit.form>
  );
};
