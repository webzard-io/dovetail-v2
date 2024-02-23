export * from './create';
export * from './list';
export * from './show';
import { i18n } from 'i18next';
import {
  ConditionsField,
  ImageField,
  PodsField,
  ReplicaField,
  NamespaceField,
  LabelsField,
  AnnotationsField,
  AgeField,
  EventsTableTabField,
  AreaType,
} from 'src/components/ShowContent/fields';
import { WorkloadDropdown } from 'src/components/WorkloadDropdown';
import { STATEFULSET_INIT_VALUE } from 'src/constants/k8s';
import {
  AgeColumnRenderer,
  WorkloadImageColumnRenderer,
  NameColumnRenderer,
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
  label: 'StatefulSets',
  initValue: STATEFULSET_INIT_VALUE,
  columns: () => ([
    StateDisplayColumnRenderer(i18n),
    NameColumnRenderer(i18n),
    NameSpaceColumnRenderer(i18n),
    WorkloadImageColumnRenderer(i18n),
    WorkloadRestartsColumnRenderer(i18n),
    ReplicasColumnRenderer(i18n),
    AgeColumnRenderer(i18n),
  ]),
  showConfig: () => ({
    tabs: [{
      title: i18n.t('dovetail.detail'),
      groups: [{
        title: i18n.t('dovetail.basic_info'),
        areas: [{
          type: AreaType.Inline,
          fields: [ReplicaField(), ReplicaField()],
        }, {
          fields: [
            NamespaceField(i18n),
            ImageField(i18n),
            LabelsField(i18n),
            AnnotationsField(i18n),
            AgeField(i18n),
          ],
        }]
      }, {
        title: 'Pods',
        areas: [{
          fields: [PodsField()]
        }]
      }, {
        title: i18n.t('dovetail.condition'),
        areas: [{
          fields: [ConditionsField()]
        }]
      }]
    }, {
      title: i18n.t('dovetail.event'),
      groups: [{
        areas: [{
          fields: [EventsTableTabField()]
        }]
      }]
    }]
  }),
  Dropdown: WorkloadDropdown,
});

