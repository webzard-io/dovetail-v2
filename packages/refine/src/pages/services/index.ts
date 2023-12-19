import { i18n } from 'i18next';
import { ResourceModel } from 'k8s-api-provider';
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
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const ServicesConfig: ResourceConfig<ResourceModel> = {
  name: 'services',
  kind: 'Service',
  basePath: '/api/v1',
  apiVersion: 'v1',
  label: 'Services',
  parent: RESOURCE_GROUP.NETWORK,
  columns: (i18n: i18n) => [ServiceTypeColumnRenderer(i18n), AgeColumnRenderer(i18n)],
  showFields: (i18n: i18n) => [
    [],
    [ServiceTypeField(i18n), ClusterIpField(i18n), SessionAffinityField(i18n)],
    [ServicePodsField(i18n), ConditionsField(i18n)],
  ],
};
