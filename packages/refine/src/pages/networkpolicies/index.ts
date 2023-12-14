import { RuleCountColumnRenderer } from '../../hooks/useEagleTable/columns';
  import { PodSelectorColumnRenderer } from '../../hooks/useEagleTable/columns';
  import { IngressEgressRulesField } from '../../components/ShowContent/fields';
  import { i18n } from 'i18next';
  import { RESOURCE_GROUP, ResourceConfig, WithId } from '../../types';
  import { ResourceModel } from '../../model';
  import { NetworkPolicy } from 'kubernetes-types/networking/v1';
  
  //
  
  const NETWORKPOLICY_INIT_VALUE = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'NetworkPolicy',
    metadata: {
      name: '',
      namespace: 'default',
      annotations: {},
      labels: {},
    },
    spec: {
      podSelector: {},
      policyTypes: [],
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
      RuleCountColumnRenderer(i18n),
      PodSelectorColumnRenderer(i18n),
    ],
    showFields: (i18n: i18n) => [[], [], [IngressEgressRulesField(i18n)]],
    initValue: NETWORKPOLICY_INIT_VALUE,
  };
  