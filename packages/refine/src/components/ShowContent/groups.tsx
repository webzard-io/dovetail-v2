import { i18n as I18nType } from 'i18next';
import React from 'react';
import { PodContainersTable } from 'src/components/PodContainersTable';
import { ResourceModel, WorkloadBaseModel, ServiceModel, JobModel, CronJobModel, PodModel } from 'src/models';
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
} from './fields';

export const BasicGroup = <Model extends ResourceModel>(
  i18n: I18nType,
  { upAreas = [], downAreas = [], basicFields = [] }: { upAreas?: ShowArea<Model>[]; downAreas?: ShowArea<Model>[]; basicFields?: ShowField<Model>[] } = {}
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
        AgeField(i18n)
      ]
    },
    ...downAreas
  ]
});

export const PodsGroup = <Model extends WorkloadBaseModel>(): ShowGroup<Model> => ({
  title: 'Pod',
  areas: [{
    fields: [PodsField()]
  }]
});

export const PodContainersGroup = <Model extends PodModel>(i18n: I18nType): ShowGroup<Model> => ({
  title: i18n.t('dovetail.container'),
  areas: [{
    fields: [{
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
    }]
  }]
});

export const ServicePodsGroup = <Model extends ServiceModel>(): ShowGroup<Model> => ({
  title: 'Pod',
  areas: [{
    fields: [ServicePodsField()]
  }]
});

export const ConditionsGroup = <Model extends ResourceModel>(i18n: I18nType): ShowGroup<Model> => ({
  title: i18n.t('dovetail.condition'),
  areas: [{
    fields: [ConditionsField()]
  }]
});

export const JobsGroup = <Model extends JobModel | CronJobModel>(): ShowGroup<Model> => ({
  title: 'Job',
  areas: [{
    fields: [JobsField()]
  }]
});
