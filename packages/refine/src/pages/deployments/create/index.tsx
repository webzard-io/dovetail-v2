import { FormProps } from 'antd/lib/form';
import React from 'react';
import FormModal from 'src/components/FormModal';
import { DEPLOYMENT_INIT_VALUE } from 'src/constants/k8s';

export const DeploymentForm: React.FC<FormProps> = () => {
  return null && <FormModal
    resource="deployments"
    formProps={{ initialValues: DEPLOYMENT_INIT_VALUE }}
  />;
};
