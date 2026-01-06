import { FormProps } from 'antd/lib/form';
import React, { useContext } from 'react';
import { YamlForm } from 'src/components';
import { CRONJOB_INIT_VALUE } from 'src/constants/k8s';
import ConfigsContext from 'src/contexts/configs';

export const CronJobForm: React.FC<FormProps> = () => {
  const configs = useContext(ConfigsContext);
  const config = configs['cronjobs'];

  return <YamlForm initialValuesForCreate={CRONJOB_INIT_VALUE} resourceConfig={config} />;
};
