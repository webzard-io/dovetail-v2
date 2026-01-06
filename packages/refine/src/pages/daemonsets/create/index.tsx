import { FormProps } from 'antd/lib/form';
import React, { useContext } from 'react';
import { YamlForm } from 'src/components';
import { DAEMONSET_INIT_VALUE } from 'src/constants/k8s';
import ConfigsContext from 'src/contexts/configs';

export const DaemonSetForm: React.FC<FormProps> = () => {
  const configs = useContext(ConfigsContext);
  const config = configs['daemonsets'];

  return (
    <YamlForm initialValuesForCreate={DAEMONSET_INIT_VALUE} resourceConfig={config} />
  );
};
