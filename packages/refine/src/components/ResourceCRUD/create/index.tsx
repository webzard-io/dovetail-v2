import React, { useMemo } from 'react';
import YamlForm from 'src/components/YamlForm';
import { FormType } from 'src/types';
import { getInitialValues } from 'src/utils/form';
import { ResourceModel } from '../../../models';
import { ResourceConfig } from '../../../types';

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

  // the modals would render in ModalStack
  return config.formType === FormType.MODAL ? (
    null
  ) : (
    <YamlForm
      {...formProps}
    />
  );
}
