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

export const ServicesConfig: ResourceConfig<Resource, ResourceModel> = {
  name: 'services',
  kind: 'Service',
  basePath: '/api/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.NETWORK,
  columns: (i18n: i18n) => [ServiceTypeColumnRenderer(i18n), AgeColumnRenderer(i18n)],
  showFields: (i18n: i18n) => [
    [],
    [ServiceTypeField(i18n), ClusterIpField(i18n), SessionAffinityField(i18n)],
    [ServicePodsField(i18n), ConditionsField(i18n)],
  ],
};
