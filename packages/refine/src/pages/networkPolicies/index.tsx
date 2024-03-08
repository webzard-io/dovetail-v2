import { i18n } from 'i18next';
import type { LabelSelector } from 'kubernetes-types/meta/v1';
import React from 'react';
import {
  BasicGroup,
  NetworkPolicyIngressRulesTab,
  NetworkPolicyEgressRulesTab,
  PodSelectorGroup,
} from 'src/components/ShowContent';
import { Column, Tags } from '../../components';
import K8sDropdown from '../../components/K8sDropdown';
import { NETWORK_POLICY_INIT_VALUE } from '../../constants/k8s';
import { AgeColumnRenderer } from '../../hooks/useEagleTable/columns';
import { NetworkPolicyModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig, FormType } from '../../types';

export const NetworkPolicyConfig = (i18n: i18n): ResourceConfig<NetworkPolicyModel> => ({
  name: 'networkpolicies',
  kind: 'NetworkPolicy',
  basePath: '/apis/networking.k8s.io/v1',
  apiVersion: 'networking.k8s.io/v1',
  label: 'NetworkPolicies',
  parent: RESOURCE_GROUP.NETWORK,
  columns: () =>
    [
      {
        key: 'podSelector',
        display: true,
        dataIndex: ['spec', 'podSelector', 'matchLabels'],
        title: i18n.t('dovetail.pod_selector'),
        sortable: false,
        render(matchLabels) {
          return <Tags value={matchLabels} />;
        },
      },
      AgeColumnRenderer(i18n),
    ] as Column<NetworkPolicyModel>[],
  showConfig: () => ({
    tabs: [
      {
        title: i18n.t('dovetail.detail'),
        key: 'detail',
        groups: [
          BasicGroup(i18n, {
            basicFields: [{
              key: 'podSelector',
              title: i18n.t('dovetail.pod_selector'),
              path: ['spec', 'podSelector'],
              col: 12,
              renderContent: podSelector => {
                return <Tags value={(podSelector as LabelSelector).matchLabels} />;
              },
            }]
          }),
          PodSelectorGroup(i18n),
        ]
      },
      NetworkPolicyIngressRulesTab(i18n),
      NetworkPolicyEgressRulesTab(i18n),
    ],
  }),
  initValue: NETWORK_POLICY_INIT_VALUE,
  Dropdown: K8sDropdown,
  formConfig: {
    formType: FormType.MODAL,
  },
});
