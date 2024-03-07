import React, { useMemo } from 'react';
import { YamlForm } from 'src/components';
import { getInitialValues } from 'src/utils/form';
import { ResourceModel } from '../../../models';
import { ResourceConfig } from '../../../types';
import { RefineFormPage } from '../../Form';

type Props<Model extends ResourceModel> = {
  config: ResourceConfig<Model>;
};

export function ResourceForm<Model extends ResourceModel>(props: Props<Model>) {
  const { config } = props;
  const formProps = useMemo(() => {
    return {
      initialValues: getInitialValues(config),
    };
  }, [config]);

  if (config.formConfig?.fields) {
    return <RefineFormPage config={config} />;
  }

  return <YamlForm {...formProps} />;
}
