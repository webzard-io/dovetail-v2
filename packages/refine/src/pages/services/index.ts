import {
  ConditionsField,
  ServiceTypeField,
  ClusterIpField,
  SessionAffinityField,
  ServicePodsField,
} from '../../components/ShowContent';
import { SERVICE_INIT_VALUE } from '../../constants';
import {
  AgeColumnRenderer,
  ServiceTypeColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const ServicesConfig: ResourceConfig<ResourceModel> = {
  name: 'services',
  kind: 'Service',
  basePath: '/api/v1',
  apiVersion: 'v1',
  label: 'Services',
  parent: RESOURCE_GROUP.NETWORK,
  columns: () => [ServiceTypeColumnRenderer(), AgeColumnRenderer()],
  showFields: () => [
    [],
    [ServiceTypeField(), ClusterIpField(), SessionAffinityField()],
    [ServicePodsField(), ConditionsField()],
  ],
  initValue: SERVICE_INIT_VALUE,
  isDrawerShowMode: true,
};
