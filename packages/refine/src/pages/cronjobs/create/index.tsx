import { FormProps } from 'antd/lib/form';
import React from 'react';
import { YamlForm } from 'src/components';
import { CRONJOB_INIT_VALUE } from 'src/constants/k8s';

export const CronJobForm: React.FC<FormProps> = () => {
  return <YamlForm initialValues={CRONJOB_INIT_VALUE} />;
};
