import { i18n } from 'i18next';
import type { LabelSelector } from 'kubernetes-types/meta/v1';
import type {
  NetworkPolicyIngressRule,
  NetworkPolicyEgressRule,
} from 'kubernetes-types/networking/v1';
import React from 'react';
import { Column, Tags } from '../../components';
import K8sDropdown from '../../components/K8sDropdown';
import { NetworkPolicyRulesTable } from '../../components/NetworkPolicyRulesTable';
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
        title: 'Pod Selector',
        sortable: false,
        render(matchLabels) {
          return <Tags value={matchLabels} />;
        },
      },
      AgeColumnRenderer(i18n),
    ] as Column<NetworkPolicyModel>[],
  showConfig: () => ({
    descriptions: [],
    groups: [
      {
        fields: [
          {
            key: 'podSelector',
            title: 'Pod Selector',
            path: ['spec', 'podSelector'],
            col: 12,
            renderContent: podSelector => {
              return <Tags value={(podSelector as LabelSelector).matchLabels} />;
            },
          },
        ],
      },
    ],
    tabs: [
      {
        key: 'Ingress',
        title: 'Ingress Rules',
        path: ['spec', 'ingress'],
        renderContent: ingress => {
          return (
            <NetworkPolicyRulesTable
              ingressOrEgress={ingress as NetworkPolicyIngressRule[]}
            />
          );
        },
      },
      {
        key: 'Egress',
        title: 'Egress Rules',
        path: ['spec', 'egress'],
        renderContent: egress => {
          return (
            <NetworkPolicyRulesTable
              ingressOrEgress={egress as NetworkPolicyEgressRule[]}
            />
          );
        },
      },
    ],
  }),
  initValue: NETWORK_POLICY_INIT_VALUE,
  Dropdown: K8sDropdown,
  formType: FormType.MODAL,
});
