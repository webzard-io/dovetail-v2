import { FormProps } from 'antd/lib/form';
import React from 'react';
import YamlForm from 'src/components/YamlForm';
import { STATEFULSET_INIT_VALUE } from 'src/constants/k8s';

export const StatefulSetForm: React.FC<FormProps> = () => {
  return <YamlForm initialValues={STATEFULSET_INIT_VALUE} />;
};
