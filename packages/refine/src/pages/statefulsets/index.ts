import { i18n } from 'i18next';
import { ReplicasDropdown } from 'src/components/Dropdowns/ReplicasDropdown';
import {
  ImageField,
  ReplicaField,
  AreaType,
  BasicGroup,
  PodsGroup,
  ConditionsGroup,
  EventsTab,
} from 'src/components/ShowContent';
import { STATEFULSET_INIT_VALUE } from 'src/constants/k8s';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameSpaceColumnRenderer,
  StateDisplayColumnRenderer,
  ReplicasColumnRenderer,
  WorkloadRestartsColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { StatefulSetModel } from 'src/models/statefulset-model';
import { ResourceConfig } from 'src/types';
import { RESOURCE_GROUP } from 'src/types';

export const StatefulSetConfig = (i18n: i18n): ResourceConfig<StatefulSetModel> => ({
  name: 'statefulsets',
  basePath: '/apis/apps/v1',
  kind: 'StatefulSet',
  apiVersion: 'apps/v1',
  parent: RESOURCE_GROUP.WORKLOAD,
  initValue: STATEFULSET_INIT_VALUE,
  columns: () => ([
    StateDisplayColumnRenderer(i18n),
    NameSpaceColumnRenderer(i18n),
    WorkloadImageColumnRenderer(i18n),
    WorkloadRestartsColumnRenderer(i18n),
    ReplicasColumnRenderer(i18n),
    AgeColumnRenderer(i18n),
  ]),
  showConfig: () => ({
    tabs: [
      {
        title: i18n.t('dovetail.detail'),
        key: 'detail',
        groups: [
          BasicGroup(i18n, {
            upAreas: [{
              type: AreaType.Inline,
              fields: [ReplicaField()],
            }],
            basicFields: [ImageField(i18n),]
          }),
          PodsGroup(),
          ConditionsGroup(i18n)
        ]
      },
      EventsTab(i18n)
    ]
  }),
  Dropdown: ReplicasDropdown,
});

