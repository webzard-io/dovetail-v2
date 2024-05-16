import { i18n } from 'i18next';
import React from 'react';
import { TextTags } from '../../components';
import {
  ServiceTypeField,
  PortsGroup,
  BasicGroup,
  ServicePodsGroup,
  ConditionsGroup,
  ServiceInnerClusterAccessField,
  ServiceOutClusterAccessField,
  PodSelectorGroup,
} from '../../components/ShowContent';
import { SERVICE_CLUSTER_IP_INIT_VALUE } from '../../constants';
import {
  AgeColumnRenderer,
  ServiceInClusterAccessColumnRenderer,
  ServiceOutClusterAccessColumnRenderer,
  ServiceTypeColumnRenderer,
  PortMappingColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { ServiceModel } from '../../models/service-model';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const ServicesConfig = (i18n: i18n): ResourceConfig<ServiceModel> => ({
  name: 'services',
  kind: 'Service',
  basePath: '/api/v1',
  apiVersion: 'v1',
  label: 'Services',
  parent: RESOURCE_GROUP.NETWORK,
  columns: () => [
    ServiceTypeColumnRenderer(i18n),
    ServiceInClusterAccessColumnRenderer(),
    ServiceOutClusterAccessColumnRenderer(),
    {
      key: 'dnsRecord',
      title: i18n.t('dovetail.dns_record'),
      display: true,
      dataIndex: 'dnsRecord',
    },
    {
      key: 'podSelector',
      title: i18n.t('dovetail.pod_selector'),
      display: true,
      dataIndex: ['spec', 'selector'],
      width: 200,
      render(value) {
        return <TextTags value={value} />;
      },
    },
    PortMappingColumnRenderer(i18n, '192.168.1.1'),
    AgeColumnRenderer(i18n),
  ],
  showConfig: () => ({
    tabs: [
      {
        title: i18n.t('dovetail.detail'),
        key: 'detail',
        groups: [
          BasicGroup(i18n, {
            basicFields: [
              ServiceTypeField(i18n),
              {
                key: 'dnsRecord',
                title: i18n.t('dovetail.dns_record'),
                path: ['dnsRecord'],
              },
              ServiceInnerClusterAccessField(),
              ServiceOutClusterAccessField(),
            ],
          }),
          PodSelectorGroup(i18n),
          PortsGroup(i18n),
          ConditionsGroup(i18n),
          ServicePodsGroup(),
        ],
      },
    ],
  }),
  initValue: SERVICE_CLUSTER_IP_INIT_VALUE,
});
