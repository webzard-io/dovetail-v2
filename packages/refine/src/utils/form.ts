import { BASE_INIT_VALUE } from 'src/constants/k8s';
import { ResourceModel } from 'src/models';
import { ResourceConfig } from 'src/types';

export function getInitialValues<Model extends ResourceModel = ResourceModel>(
  resourceConfig: Pick<ResourceConfig<Model>, 'apiVersion' | 'kind' | 'initValue'>
) {
  return (
    resourceConfig.initValue || {
      apiVersion: resourceConfig.apiVersion,
      kind: resourceConfig.kind,
      ...BASE_INIT_VALUE,
      spec: {},
    }
  );
}
