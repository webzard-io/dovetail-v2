import { i18n as I18nType } from 'i18next';
import type {
  NetworkPolicyIngressRule,
  NetworkPolicyEgressRule,
} from 'kubernetes-types/networking/v1';
import React from 'react';
import { NetworkPolicyRulesTable } from 'src/components/NetworkPolicyRulesTable';
import { PodContainersTable } from 'src/components/PodContainersTable';
import { PodLog } from 'src/components/PodLog';
import {
  ResourceModel,
  IngressModel,
  JobModel,
  CronJobModel,
  PodModel,
} from 'src/models';
import {
  ShowTab,
  EventsTableTabField,
  IngressRulesTableTabField,
  DataField,
  JobsField,
} from './fields';

export const EventsTab = <Model extends ResourceModel>(
  i18n: I18nType
): ShowTab<Model> => ({
  title: i18n.t('dovetail.event'),
  key: 'events',
  groups: [
    {
      areas: [
        {
          fields: [EventsTableTabField()],
        },
      ],
    },
  ],
});

export const IngressRulesTab = <Model extends IngressModel>(
  i18n: I18nType
): ShowTab<Model> => ({
  title: i18n.t('dovetail.rule'),
  key: 'ingres-rules',
  groups: [
    {
      areas: [
        {
          fields: [IngressRulesTableTabField()],
        },
      ],
    },
  ],
});

export const NetworkPolicyIngressRulesTab = <Model extends ResourceModel>(
  i18n: I18nType
): ShowTab<Model> => ({
  title: i18n.t('dovetail.ingress_rule'),
  key: 'network-policy-ingress-rule',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'Ingress',
              path: ['spec', 'ingress'],
              renderContent: ingress => {
                return (
                  <NetworkPolicyRulesTable
                    ingressOrEgress={ingress as NetworkPolicyIngressRule[]}
                  />
                );
              },
            },
          ],
        },
      ],
    },
  ],
});

export const NetworkPolicyEgressRulesTab = <Model extends ResourceModel>(
  i18n: I18nType
): ShowTab<Model> => ({
  title: i18n.t('dovetail.egress_rule'),
  key: 'network-policy-egress-rule',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'Egress',
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
        },
      ],
    },
  ],
});

export const DataTab = <Model extends ResourceModel>(i18n: I18nType): ShowTab<Model> => ({
  title: i18n.t('dovetail.data'),
  key: 'data',
  groups: [
    {
      areas: [
        {
          fields: [DataField()],
        },
      ],
    },
  ],
});

export const PodLogTab = <Model extends PodModel>(i18n: I18nType): ShowTab<Model> => ({
  title: i18n.t('dovetail.log'),
  key: 'pod-log',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'log',
              path: [],
              renderContent: (_, record) => {
                return <PodLog pod={record} />;
              },
            },
          ],
        },
      ],
    },
  ],
});
