import { BASE_INIT_VALUE } from 'src/constants/k8s';
import { ResourceModel } from 'src/models';
import { ResourceConfig } from 'src/types';

export function getInitialValues<Model extends ResourceModel = ResourceModel>(config: ResourceConfig<Model>) {
  return config.initValue || {
    apiVersion: config.apiVersion,
    kind: config.kind,
    ...BASE_INIT_VALUE,
    spec: {},
  };
}
