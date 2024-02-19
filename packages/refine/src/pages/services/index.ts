import { i18n } from 'i18next';
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

export const ServicesConfig = (i18n: i18n): ResourceConfig<ResourceModel> => ({
  name: 'services',
  kind: 'Service',
  basePath: '/api/v1',
  apiVersion: 'v1',
  label: 'Services',
  parent: RESOURCE_GROUP.NETWORK,
  columns: () => [ServiceTypeColumnRenderer(i18n), AgeColumnRenderer(i18n)],
  showConfig: () => ({
    groups: [
      {
        fields: [
          ServiceTypeField(i18n),
          ClusterIpField(i18n),
          SessionAffinityField(i18n),
        ],
      },
    ],
    tabs: [ServicePodsField(), ConditionsField(i18n)],
  }),
  initValue: SERVICE_INIT_VALUE,
});
