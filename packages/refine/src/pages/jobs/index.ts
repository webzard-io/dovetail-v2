import { i18n } from 'i18next';
import { Job } from 'kubernetes-types/batch/v1';
import {
  ConditionsField,
  ImageField,
  PodsField,
  StartTimeField,
} from '../../components/ShowContent';
import { WorkloadDropdown } from '../../components/WorkloadDropdown';
import { JOB_INIT_VALUE } from '../../constants/k8s';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
  NameSpaceColumnRenderer,
  PhaseColumnRenderer,
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
  Dropdown: WorkloadDropdown
};
