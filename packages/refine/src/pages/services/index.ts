import { i18n } from 'i18next';
import {
  ConditionsField,
  ServiceTypeField,
  ClusterIpField,
  SessionAffinityField,
  ServicePodsField,
} from '../../components/ShowContent';
import {
  AgeColumnRenderer,
  ServiceTypeColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../model';
import { RESOURCE_GROUP, Resource, ResourceConfig } from '../../types';
import { SERVICE_INIT_VALUE } from 'src/constants/k8s';

export const ServicesConfig: ResourceConfig<Resource, ResourceModel> = {
  name: 'services',
  kind: 'Service',
  basePath: '/api/v1',
  apiVersion: 'v1',
  label: 'Services',
  parent: RESOURCE_GROUP.NETWORK,
  columns: (i18n: i18n) => [ServiceTypeColumnRenderer(), AgeColumnRenderer()],
  showFields: (i18n: i18n) => [
    [],
    [ServiceTypeField(), ClusterIpField(), SessionAffinityField()],
    [ServicePodsField(), ConditionsField()],
  ],
  initValue: SERVICE_INIT_VALUE
};
