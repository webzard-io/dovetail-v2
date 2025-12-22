import { css } from '@linaria/core';
import { i18n as I18nType } from 'i18next';
import { Unstructured } from 'k8s-api-provider';
import { ConfigMap, Secret } from 'kubernetes-types/core/v1';
import { Condition } from 'kubernetes-types/meta/v1';
import type {
  NetworkPolicyIngressRule,
  NetworkPolicyEgressRule,
} from 'kubernetes-types/networking/v1';
import React from 'react';
import { LabelsAndAnnotationsShow } from 'src/components/LabelsAndAnnotationsShow';
import { NetworkPolicyRulesViewer } from 'src/components/NetworkPolicyRulesViewer';
import { PodLog } from 'src/components/PodLog';
import { ResourceModel, PodModel, ServiceModel, IngressModel } from 'src/models';
import { NetworkPolicyModel } from 'src/models';
import { ConditionsTable } from '../ConditionsTable';
import {
  ShowTab,
  EventsTableTabField,
  PortsTableField,
  DataField,
  SecretDataField,
} from './fields';
import { IngressRulesTableTabField } from './fields';

export const EventsTab = <Model extends ResourceModel>({
  i18n,
  size,
}: {
  i18n: I18nType;
  size?: 'small' | 'medium';
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.event'),
  key: 'events',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [EventsTableTabField({ size })],
        },
      ],
    },
  ],
});

export const ConditionsTab = <Model extends ResourceModel>({
  i18n,
  size,
}: {
  i18n: I18nType;
  size?: 'small' | 'medium';
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.condition'),
  key: 'conditions',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'Conditions',
              path: ['status', 'conditions'],
              renderContent: value => {
                return (
                  <div
                    style={{
                      padding: size === 'small' ? '0 12px' : '0 24px',
                      height: '100%',
                    }}
                  >
                    <ConditionsTable conditions={value as Condition[]} />
                  </div>
                );
              },
            },
          ],
        },
      ],
    },
  ],
});

export const LabelAnnotationsTab = <Model extends ResourceModel>({
  i18n,
  size,
}: {
  i18n: I18nType;
  size?: 'small' | 'medium';
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.label_annotations'),
  key: 'label-annotations',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'label-annotations',
              path: [],
              renderContent: (_, record) => {
                return (
                  <LabelsAndAnnotationsShow
                    labels={record.metadata?.labels as Record<string, string>}
                    annotations={record.metadata?.annotations as Record<string, string>}
                    size={size}
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

export const PodLogTab = <Model extends PodModel>(
  i18n: I18nType,
  apiUrl: string
): ShowTab<Model> => ({
  title: i18n.t('dovetail.log'),
  key: 'pod-log',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'log',
              path: [],
              renderContent: (_, record) => {
                return <PodLog pod={record} apiUrl={apiUrl} />;
              },
            },
          ],
        },
      ],
    },
  ],
});

export const PortsTab = <Model extends ServiceModel>({
  i18n,
}: {
  i18n: I18nType;
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.port'),
  key: 'ports',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [PortsTableField()],
        },
      ],
    },
  ],
});

export const IngressRulesTab = <Model extends IngressModel>({
  i18n,
}: {
  i18n: I18nType;
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.rule'),
  key: 'ingress-rules',
  background: 'white',
  groups: [
    {
      areas: [{ fields: [IngressRulesTableTabField()] }],
    },
  ],
});

export const DataTab = <
  Model extends ResourceModel<Unstructured & (ConfigMap | Secret)>
>({
  i18n,
}: {
  i18n: I18nType;
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.data'),
  key: 'data',
  background: 'white',
  groups: [
    {
      areas: [{ fields: [DataField(i18n)] }],
    },
  ],
});

export const SecretDataTab = <Model extends ResourceModel>({
  i18n,
}: {
  i18n: I18nType;
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.data'),
  key: 'secret-data',
  background: 'white',
  groups: [
    {
      areas: [{ fields: [SecretDataField()] }],
    },
  ],
});

const NetworkPolicyRulesViewerStyle = css`
  padding: 16px 24px;
  width: 100%;
  height: 100%;
  min-height: 300px;
`;

export const NetworkPolicyIngressRulesTab = <Model extends NetworkPolicyModel>({
  i18n,
}: {
  i18n: I18nType;
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.ingress_rule'),
  key: 'ingress-rules',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'Ingress',
              path: ['spec', 'ingress'],
              render: ingress => {
                return (
                  <div className={NetworkPolicyRulesViewerStyle}>
                    <NetworkPolicyRulesViewer
                      ingressOrEgress={ingress as NetworkPolicyIngressRule[]}
                    />
                  </div>
                );
              },
            },
          ],
        },
      ],
    },
  ],
});

export const NetworkPolicyEgressRulesTab = <Model extends NetworkPolicyModel>({
  i18n,
}: {
  i18n: I18nType;
}): ShowTab<Model> => ({
  title: i18n.t('dovetail.egress_rule'),
  key: 'egress-rules',
  background: 'white',
  groups: [
    {
      areas: [
        {
          fields: [
            {
              key: 'Egress',
              path: ['spec', 'egress'],
              render: egress => {
                return (
                  <div className={NetworkPolicyRulesViewerStyle}>
                    <NetworkPolicyRulesViewer
                      ingressOrEgress={egress as NetworkPolicyEgressRule[]}
                    />
                  </div>
                );
              },
            },
          ],
        },
      ],
    },
  ],
});
