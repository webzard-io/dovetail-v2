import React, { useMemo } from 'react';
import FormModal from 'src/components/FormModal';
import YamlForm from 'src/components/YamlForm';
import { BASE_INIT_VALUE } from 'src/constants/k8s';
import { FormType } from 'src/types';
import { ResourceModel } from '../../../models';
import { ResourceConfig } from '../../../types';

type Props<Model extends ResourceModel> = {
  config: ResourceConfig<Model>;
};

export function ResourceForm<Model extends ResourceModel>(props: Props<Model>) {
  const { config } = props;
  const formProps = useMemo(() => {
    return {
      initialValues: config.initValue || {
        apiVersion: config.apiVersion,
        kind: config.kind,
        ...BASE_INIT_VALUE,
        spec: {},
      }
    };
  }, [config]);


  return config.formType === FormType.MODAL ? (
    null
  ) : (
    <YamlForm
      {...formProps}
    />
  );
}
