import { i18n } from 'i18next';
import { Job } from 'kubernetes-types/batch/v1';
import K8sDropdown from '../../components/K8sDropdown';
import {
  ConditionsField,
  ImageField,
  PodsField,
  StartTimeField,
} from '../../components/ShowContent';
import { JOB_INIT_VALUE } from '../../constants/k8s';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  DurationColumnRenderer,
  CompletionsCountColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { JobModel } from '../../model';
import { RESOURCE_GROUP, ResourceConfig, WithId } from '../../types';

export const JobConfig: ResourceConfig<WithId<Job>, JobModel> = {
  name: 'jobs',
  kind: 'Job',
  basePath: '/apis/batch/v1',
  apiVersion: 'batch/v1',
  label: 'Jobs',
  parent: RESOURCE_GROUP.WORKLOAD,
  formatter: d => new JobModel(d),
  columns: (i18n: i18n) => [
    WorkloadImageColumnRenderer(),
    CompletionsCountColumnRenderer(),
    DurationColumnRenderer(),
    AgeColumnRenderer(),
  ],
  showFields: (i18n: i18n) => [
    [],
    [StartTimeField(), ImageField()],
    [PodsField(), ConditionsField()],
  ],
  initValue: JOB_INIT_VALUE,
  Dropdown: K8sDropdown,
};
