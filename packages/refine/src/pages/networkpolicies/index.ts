import { RulesCountColumnRenderer } from '../../hooks/useEagleTable/columns';
import { PodSelectorColumnRenderer } from '../../hooks/useEagleTable/columns';
import { i18n } from 'i18next';
import { RESOURCE_GROUP, ResourceConfig, WithId } from '../../types';
import { ResourceModel } from '../../model';
import { NetworkPolicy } from 'kubernetes-types/networking/v1';

const NETWORK_POLICY_INIT_VALUE = {
  apiVersion: 'networking.k8s.io/v1',
  kind: 'NetworkPolicy',
  metadata: {
    name: 'example-network-policy',
    namespace: 'default',
  },
  spec: {
    podSelector: {
      matchLabels: {
        role: 'db',
      },
    },
    policyTypes: ['Ingress', 'Egress'],
    ingress: [
      {
        from: [
          {
            podSelector: {
              matchLabels: {
                role: 'frontend',
              },
            },
          },
        ],
      },
    ],
    egress: [
      {
        to: [
          {
            podSelector: {
              matchLabels: {
                role: 'api',
              },
            },
          },
        ],
      },
    ],
  },
};

export const NetworkPolicyConfig: ResourceConfig<WithId<NetworkPolicy>, ResourceModel> = {
  name: 'networkpolicies',
  kind: 'NetworkPolicy',
  basePath: '/apis/networking.k8s.io/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.NETWORK,
  label: 'Network Policies',
  columns: (i18n: i18n) => [
    RulesCountColumnRenderer(i18n),
    PodSelectorColumnRenderer(i18n),
  ],
  showFields: (i18n: i18n) => [[], [], []],
  initValue: NETWORK_POLICY_INIT_VALUE,
};
