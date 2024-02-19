import { i18n } from 'i18next';
import { FormType } from 'src/types';
import { Column } from '../../components';
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
  StateDisplayColumnRenderer,
  WorkloadRestartsColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { JobModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const JobConfig = (i18n: i18n): ResourceConfig<JobModel> => ({
  name: 'jobs',
  kind: 'Job',
  basePath: '/apis/batch/v1',
  apiVersion: 'batch/v1',
  label: 'Jobs',
  parent: RESOURCE_GROUP.WORKLOAD,
  columns: () =>
    [
      StateDisplayColumnRenderer(i18n),
      WorkloadImageColumnRenderer(i18n),
      CompletionsCountColumnRenderer(i18n),
      WorkloadRestartsColumnRenderer(i18n),
      DurationColumnRenderer(i18n),
      AgeColumnRenderer(i18n),
    ] as Column<JobModel>[],
  showConfig: () => ({
    descriptions: [],
    groups: [
      {
        fields: [StartTimeField(i18n), ImageField(i18n)],
      },
    ],
    tabs: [PodsField(), ConditionsField(i18n)],
  }),
  initValue: JOB_INIT_VALUE,
  Dropdown: K8sDropdown,
  formType: FormType.MODAL,
});
