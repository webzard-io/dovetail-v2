import { Form, Input, TabMenu, Button } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { i18n as I18nType } from 'i18next';
import { Deployment } from 'kubernetes-types/apps/v1';
import { merge, cloneDeep } from 'lodash-es';
import React, { useState, useCallback } from 'react';
import { RefineFormSection, RefineFormField } from 'src/components/Form/type';
import { DeploymentModel } from 'src/models/deployment-model';
import { RefineFormConfig, CommonFormConfig } from 'src/types';
import { FormType } from 'src/types/resource';
import { immutableSet } from 'src/utils/object';

const FormWrapper = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;

const FormItem = Form.Item;

interface Step1Value {
  name?: string;
  namespace?: string;
}

function Step1({
  value,
  onChange,
  i18n,
}: {
  value?: Step1Value;
  onChange: (value: Step1Value) => void;
  i18n: I18nType;
}) {
  return (
    <div className={FormWrapper}>
      <FormItem label={i18n.t('dovetail.name')}>
        <Input
          value={value?.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newName = event.target.value;

            onChange({ ...value, name: newName });
          }}
        />
      </FormItem>
      <FormItem label={i18n.t('dovetail.namespace')}>
        <Input
          value={value?.namespace}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newName = event.target.value;

            onChange({ ...value, namespace: newName });
          }}
        />
      </FormItem>
    </div>
  );
}

interface ContainerValue {
  name?: string;
  image?: string;
}

function Step2({
  value = [],
  onChange,
  i18n,
}: {
  value?: ContainerValue[];
  onChange: (value: ContainerValue[]) => void;
  i18n: I18nType;
}) {
  const [selectedKey, setSelectedKey] = useState<string>('0');

  const handleContainerChange = useCallback(
    (index: number, path: string[], fieldValue: unknown) => {
      const newContainers = immutableSet(value, [index.toString(), ...path], fieldValue);

      onChange(newContainers);
    },
    [value, onChange]
  );

  return (
    <div className={FormWrapper}>
      <Button
        type="primary"
        onClick={() => {
          onChange([...value, { name: '', image: '' }]);
        }}
        style={{ marginBottom: 16 }}
      >
        {i18n.t('app.add_container')}
      </Button>
      <TabMenu
        tabs={
          value?.map((container, index) => ({
            key: index.toString(),
            title: i18n.t('app.container_index', { index: index + 1 }),
            children: (
              <div className={FormWrapper}>
                <FormItem label={i18n.t('app.container_name')}>
                  <Input
                    value={container?.name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const newName = event.target.value;

                      handleContainerChange(index, ['name'], newName);
                    }}
                  />
                </FormItem>
                <FormItem label={i18n.t('app.container_image')}>
                  <Input
                    value={container?.image}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const newImage = event.target.value;

                      handleContainerChange(index, ['image'], newImage);
                    }}
                  />
                </FormItem>
              </div>
            ),
          })) || []
        }
        selectedKey={selectedKey}
        onChange={setSelectedKey}
      />
    </div>
  );
}

interface DeploymentFormValue {
  step1?: Step1Value;
}

export function generatedDeploymentsFormConfig(
  i18n: I18nType
): RefineFormConfig & CommonFormConfig {
  return {
    formType: FormType.FORM,
    steps: [
      {
        title: i18n.t('dovetail.basic_info'),
      },
      {
        title: i18n.t('dovetail.container'),
      },
    ],
    fields({ step }) {
      const step1Fields: (RefineFormField | RefineFormSection)[] = [
        {
          key: 'step1',
          label: '',
          path: ['step1'],
          render: ({ field }) => (
            <Step1 value={field.value} onChange={field.onChange} i18n={i18n} />
          ),
        },
        {
          key: 'advancedSettings',
          title: i18n.t('app.advanced_settings'),
          collapsable: true,
          defaultCollapse: true,
          fields: () => [
            {
              key: 'annotations',
              label: i18n.t('dovetail.annotation'),
              path: ['metadata', 'annotations'],
            },
          ],
        },
      ];
      const step2Fields: RefineFormField[] = [
        {
          key: 'containers',
          label: '',
          path: ['spec', 'template', 'spec', 'containers'],
          render: ({ field }) => (
            <Step2 value={field.value} onChange={field.onChange} i18n={i18n} />
          ),
        },
      ];
      const stepsFields: (RefineFormSection | RefineFormField)[][] = [
        step1Fields,
        step2Fields,
      ];

      return stepsFields[step];
    },
    transformInitValues: values => {
      const deployment = cloneDeep(values) as Deployment;

      return {
        ...deployment,
        step1: {
          name: deployment.metadata?.name,
          namespace: deployment.metadata?.namespace,
        },
      };
    },
    transformApplyValues: values => {
      const deploymentFormValue = cloneDeep(values) as unknown as DeploymentFormValue;

      const result = merge({}, deploymentFormValue, {
        metadata: {
          name: deploymentFormValue.step1?.name,
          namespace: deploymentFormValue.step1?.namespace,
        },
      });

      delete result.step1;

      return result as unknown as DeploymentModel['_rawYaml'];
    },
  };
}
