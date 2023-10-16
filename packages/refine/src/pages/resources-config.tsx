import { i18n } from 'i18next';
import { Job } from 'kubernetes-types/batch/v1';
import {
  DataField,
  ConditionsField,
  ImageField,
  PodsField,
  StartTimeField,
} from '../components/ShowContent';
import { JOB_INIT_VALUE } from '../constants/k8s';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
  DurationColumnRenderer,
  CompletionsCountColumnRenderer,
} from '../hooks/useEagleTable/columns';
import { JobModel, ResourceModel } from '../model';
import { RESOURCE_GROUP, Resource, ResourceConfig, WithId } from '../types';

export const ResourcesConfig = [
  {
    name: 'jobs',
    kind: 'Job',
    basePath: '/apis/batch/v1',
    apiVersion: 'batch/v1',
    parent: RESOURCE_GROUP.WORKLOAD,
    formatter: d => new JobModel(d),
    columns: (i18n: i18n) => [
      PhaseColumnRenderer(i18n),
      NameColumnRenderer(i18n),
      NameSpaceColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      CompletionsCountColumnRenderer(i18n),
      DurationColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
    ],
    showFields: (i18n: i18n) => [
      [],
      [StartTimeField(i18n), ImageField(i18n)],
      [PodsField(i18n), ConditionsField(i18n)],
    ],
    initValue: JOB_INIT_VALUE,
  } as ResourceConfig<WithId<Job>, JobModel>,
  {
    name: 'configmaps',
    kind: 'ConfigMap',
    basePath: '/api/v1',
    apiVersion: 'v1',
    parent: RESOURCE_GROUP.CORE,
    columns: (i18n: i18n) => [AgeColumnRenderer(i18n)],
    showFields: (i18n: i18n) => [[], [DataField(i18n)], []],
  } as ResourceConfig<Resource, ResourceModel>,
  {
    name: 'secrets',
    kind: 'Secret',
    basePath: '/api/v1',
    apiVersion: 'v1',
    parent: RESOURCE_GROUP.CORE,
    columns: (i18n: i18n) => [AgeColumnRenderer(i18n)],
    showFields: (i18n: i18n) => [[], [DataField(i18n)], []],
  } as ResourceConfig<Resource, ResourceModel>,
];
