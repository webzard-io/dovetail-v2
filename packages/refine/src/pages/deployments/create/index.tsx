import { FormProps } from 'antd/lib/form';
import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { DEPLOYMENT_INIT_VALUE } from 'src/constants/k8s';

export const DeploymentForm: React.FC<FormProps> = () => {
  return <YamlForm initialValues={DEPLOYMENT_INIT_VALUE} />;
};
