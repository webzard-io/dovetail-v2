import { i18n } from 'i18next';
import React from 'react';
import { TextTags } from '../../components';
import {
  ServiceTypeField,
  ClusterIpField,
  SessionAffinityField,
  BasicGroup,
  ServicePodsGroup,
  ConditionsGroup,
} from '../../components/ShowContent';
import { SERVICE_CLUSTER_IP_INIT_VALUE } from '../../constants';
import {
  AgeColumnRenderer,
  ServiceInClusterAccessColumnRenderer,
  ServiceOutClusterAccessColumnRenderer,
  ServiceTypeColumnRenderer,
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
    ServiceInClusterAccessColumnRenderer(i18n),
    ServiceOutClusterAccessColumnRenderer(i18n),
    {
      key: 'dnsRecord',
      title: i18n.t('dovetail.dns_record'),
      display: true,
      dataIndex: 'dnsRecord',
    },
    {
      key: 'podSelector',
      title: 'Pod Selector',
      display: true,
      dataIndex: ['spec', 'selector'],
      width: 200,
      render(value) {
        return <TextTags value={value} />;
      },
    },
    {
      key: 'displayPortMapping',
      title: i18n.t('dovetail.port_mapping'),
      display: true,
      dataIndex: ['displayPortMapping'],
      width: 200,
      render(value) {
        const content = value.map((v: string) => <div key={v}>{v}</div>);
        return <>{content}</>;
      },
    },
    AgeColumnRenderer(i18n),
  ],
  showConfig: () => ({
    tabs: [{
      title: i18n.t('dovetail.detail'),
      key: 'detail',
      groups: [
        BasicGroup(i18n, {
          basicFields: [
            ServiceTypeField(i18n),
            ClusterIpField(i18n),
            SessionAffinityField(i18n),
          ]
        }),
        ServicePodsGroup(),
        ConditionsGroup(i18n)
      ]
    },],
  }),
  initValue: SERVICE_CLUSTER_IP_INIT_VALUE,
});
