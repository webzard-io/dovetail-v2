import { i18n as I18nType } from 'i18next';
import { Unstructured } from 'k8s-api-provider';
import { NetworkPolicy } from 'kubernetes-types/networking/v1';
import type {
  NetworkPolicyIngressRule,
  NetworkPolicyEgressRule,
} from 'kubernetes-types/networking/v1';
import React from 'react';
import { NetworkPolicyRulesViewer } from 'src/components/NetworkPolicyRulesViewer';
import { PodContainersTable } from 'src/components/PodContainersTable';
import {
  ResourceModel,
  WorkloadBaseModel,
  ServiceModel,
  JobModel,
  CronJobModel,
  PodModel,
  IngressModel,
  ServiceType,
  StorageClassModel,
} from 'src/models';
import {
  ShowField,
  ShowArea,
  ShowGroup,
  NamespaceField,
  LabelsField,
  AnnotationsField,
  AgeField,
  PodsField,
  ConditionsField,
  ServicePodsField,
  JobsField,
  SecretDataField,
  IngressRulesTableTabField,
  PodSelectorField,
  PortsTableField,
  DataField,
  StorageClassPvField,
} from './fields';

export const BasicGroup = <Model extends ResourceModel>(
  i18n: I18nType,
  {
    upAreas = [],
    downAreas = [],
    basicFields = [],
  }: {
    upAreas?: ShowArea<Model>[];
    downAreas?: ShowArea<Model>[];
    basicFields?: ShowField<Model>[];
  } = {}
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.basic_info'),
  areas: [
    ...upAreas,
    {
      fields: [
        NamespaceField(i18n),
        ...basicFields,
        LabelsField(i18n),
        AnnotationsField(i18n),
        AgeField(i18n),
      ],
    },
    ...downAreas,
  ],
});

export const PodsGroup = <Model extends WorkloadBaseModel>(): ShowGroup<Model> => ({
  title: 'Pod',
  areas: [
    {
      fields: [PodsField()],
    },
  ],
});

export const PodContainersGroup = <Model extends PodModel>(
  i18n: I18nType
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.container'),
  areas: [
    {
      fields: [
        {
          key: 'container',
          path: [],
          renderContent: (_, record) => {
            return (
              <PodContainersTable
                containerStatuses={record.status?.containerStatuses || []}
                initContainerStatuses={record.status?.initContainerStatuses || []}
              />
            );
          },
        },
      ],
    },
  ],
});

export const ServicePodsGroup = <Model extends ServiceModel>(): ShowGroup<Model> => ({
  title: 'Pod',
  areas: [
    {
      fields: [ServicePodsField()],
    },
  ],
});

export const ConditionsGroup = <Model extends ResourceModel>(
  i18n: I18nType
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.condition'),
  areas: [
    {
      fields: [ConditionsField()],
    },
  ],
});

export const SecretDataGroup = <Model extends ResourceModel>(): ShowGroup<Model> => ({
  areas: [
    {
      fields: [SecretDataField()],
    },
  ],
});

export const JobsGroup = <Model extends JobModel | CronJobModel>(): ShowGroup<Model> => ({
  title: 'Job',
  areas: [
    {
      fields: [JobsField()],
    },
  ],
});

export const IngressRulesGroup = <Model extends IngressModel>(
  i18n: I18nType
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.rule'),
  areas: [
    {
      fields: [IngressRulesTableTabField()],
    },
  ],
});

export const PodSelectorGroup = <
  Model extends ResourceModel<ServiceType | (NetworkPolicy & Unstructured)>,
>(
  i18n: I18nType
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.pod_selector'),
  areas: [
    {
      fields: [PodSelectorField()],
    },
  ],
});

export const PortsGroup = <Model extends ServiceModel>(
  i18n: I18nType
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.port'),
  areas: [
    {
      fields: [PortsTableField()],
    },
  ],
});

export const DataGroup = <Model extends ResourceModel>(
  i18n: I18nType
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.data'),
  areas: [
    {
      fields: [DataField(i18n)],
    },
  ],
});

export const NetworkPolicyIngressRulesGroup = <Model extends ResourceModel>(
  i18n: I18nType
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.ingress_rule'),
  areas: [
    {
      fields: [
        {
          key: 'Ingress',
          path: ['spec', 'ingress'],
          renderContent: ingress => {
            return (
              <NetworkPolicyRulesViewer
                ingressOrEgress={ingress as NetworkPolicyIngressRule[]}
                kind={` ${i18n.t('dovetail.ingress_rule')}`}
              />
            );
          },
        },
      ],
    },
  ],
});

export const NetworkPolicyEgressRulesGroup = <Model extends ResourceModel>(
  i18n: I18nType
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.egress_rule'),
  areas: [
    {
      fields: [
        {
          key: 'Egress',
          path: ['spec', 'egress'],
          renderContent: egress => {
            return (
              <NetworkPolicyRulesViewer
                ingressOrEgress={egress as NetworkPolicyEgressRule[]}
                kind={` ${i18n.t('dovetail.egress_rule')}`}
              />
            );
          },
        },
      ],
    },
  ],
});

export const StorageClassPvGroup = <Model extends StorageClassModel>(
  i18n: I18nType
): ShowGroup<Model> => ({
  title: i18n.t('dovetail.persistent_volumn'),
  areas: [
    {
      fields: [StorageClassPvField()],
    },
  ],
});
