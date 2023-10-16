import { FormProps } from 'antd/lib/form';
import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { JOB_INIT_VALUE } from 'src/constants/k8s';

export const JobForm: React.FC<FormProps> = () => {
  return <YamlForm initialValues={JOB_INIT_VALUE} />;
};
