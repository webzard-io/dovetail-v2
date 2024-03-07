import { FormProps } from 'antd/lib/form';
import React from 'react';
import { YamlForm } from 'src/components';
import { POD_INIT_VALUE } from 'src/constants/k8s';

export const PodForm: React.FC<FormProps> = () => {
  return <YamlForm initialValues={POD_INIT_VALUE} />;
};
