import { Column } from '../../components';
import K8sDropdown from '../../components/K8sDropdown';
import {
  ConditionsField,
  ImageField,
  PodsField,
  ShowField,
  StartTimeField,
} from '../../components/ShowContent';
import { JOB_INIT_VALUE } from '../../constants/k8s';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  DurationColumnRenderer,
  CompletionsCountColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { JobModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const JobConfig: ResourceConfig<JobModel> = {
  name: 'jobs',
  kind: 'Job',
  basePath: '/apis/batch/v1',
  apiVersion: 'batch/v1',
  label: 'Jobs',
  parent: RESOURCE_GROUP.WORKLOAD,
  columns: () =>
    [
      WorkloadImageColumnRenderer(),
      CompletionsCountColumnRenderer(),
      DurationColumnRenderer(),
      AgeColumnRenderer(),
    ] as Column<JobModel>[],
  showFields: () =>
    [
      [],
      [StartTimeField(), ImageField()],
      [PodsField(), ConditionsField()],
    ] as ShowField<JobModel>[][],
  initValue: JOB_INIT_VALUE,
  Dropdown: K8sDropdown,
};
