import React from 'react';
import FormModal, { FormModalProps } from 'src/components/FormModal';
import YamlForm from 'src/components/YamlForm';
import { DEPLOYMENT_INIT_VALUE } from 'src/constants/k8s';

export const DeploymentForm: React.FC<FormModalProps> = (props) => {
  return (
    <FormModal
      {...props}
      renderForm={(formProps)=> (
        <YamlForm {...formProps} initialValues={DEPLOYMENT_INIT_VALUE} isShowLayout={false} />
      )}
    ></FormModal>
  );
};
