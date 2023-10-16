import { FormProps } from 'antd/lib/form';
import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { DAEMONSET_INIT_VALUE } from 'src/constants/k8s';

export const DaemonSetForm: React.FC<FormProps> = () => {
  return <YamlForm initialValues={DAEMONSET_INIT_VALUE} />;
};
