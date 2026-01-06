import React, { useMemo } from 'react';
import { YamlForm, YamlFormProps } from 'src/components';
import { getInitialValues } from 'src/utils/form';
import { ResourceModel } from '../../../models';
import { FormType, ResourceConfig } from '../../../types';
import { RefineFormPage } from '../../Form';

type Props<Model extends ResourceModel> = {
  resourceConfig: ResourceConfig<Model>;
};

export function ResourceForm<Model extends ResourceModel>(props: Props<Model>) {
  const { resourceConfig: resourceConfig } = props;
  const formProps: YamlFormProps<Model> = useMemo(() => {
    return {
      initialValues: getInitialValues(resourceConfig),
      transformInitValues: resourceConfig.formConfig?.transformInitValues,
      transformApplyValues: resourceConfig.formConfig?.transformApplyValues,
      resourceConfig,
    };
  }, [resourceConfig]);

  if (resourceConfig.formConfig?.formType === FormType.FORM) {
    return <RefineFormPage config={resourceConfig} />;
  }

  return <YamlForm<Model> {...formProps} />;
}
