import { i18n } from 'i18next';
import { FormType } from 'src/types';
import { Column } from '../../components';
import K8sDropdown from '../../components/Dropdowns/K8sDropdown';
import {
  ImageField,
  StartTimeField,
  BasicGroup,
  PodsGroup,
  ConditionsGroup,
  ReplicaField,
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
    tabs: [{
      title: i18n.t('dovetail.detail'),
      key: 'detail',
      groups: [
        BasicGroup(i18n, {
          basicFields: [
            StartTimeField(i18n),
            ImageField(i18n),
          ],
          upAreas: [{
            fields: [ReplicaField()]
          }]
        }),
        PodsGroup(),
        ConditionsGroup(i18n)
      ]
    }],
  }),
  initValue: JOB_INIT_VALUE,
  Dropdown: K8sDropdown,
  formConfig: {
    formType: FormType.MODAL,
  }
});
