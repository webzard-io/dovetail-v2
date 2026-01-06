import { FormProps } from 'antd/lib/form';
import React, { useContext } from 'react';
import { YamlForm } from 'src/components';
import { POD_INIT_VALUE } from 'src/constants/k8s';
import ConfigsContext from 'src/contexts/configs';

export const PodForm: React.FC<FormProps> = () => {
  const configs = useContext(ConfigsContext);
  const config = configs['pods'];

  return <YamlForm initialValuesForCreate={POD_INIT_VALUE} resourceConfig={config} />;
};
