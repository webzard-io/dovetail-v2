import { i18n as I18n } from 'i18next';
import { BasicGroup } from 'src/components/ShowContent/groups';
import {
  AgeColumnRenderer,
  NameSpaceColumnRenderer,
  PVAccessModeColumnRenderer,
  PVCapacityColumnRenderer,
  PVModeColumnRenderer,
  PVPhaseColumnRenderer,
  PVStorageClassColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { RESOURCE_GROUP } from 'src/types';

export const PersistentVolumeConfig = (i18n: I18n) => ({
  name: 'persistentvolumes',
  basePath: '/api/v1',
  apiVersion: 'v1',
  kind: 'PersistentVolume',
  parent: RESOURCE_GROUP.STORAGE,
  label: 'PersistentVolumes',
  initValue: {},
  columns: () => [
    NameSpaceColumnRenderer(i18n),
    PVCapacityColumnRenderer(i18n),
    PVStorageClassColumnRenderer(i18n),
    PVPhaseColumnRenderer(i18n),
    PVModeColumnRenderer(i18n),
    PVAccessModeColumnRenderer(i18n),
    AgeColumnRenderer(i18n),
  ],
  showConfig: () => ({
    tabs: [
      {
        title: i18n.t('dovetail.detail'),
        key: 'detail',
        groups: [
          BasicGroup(i18n, {
            basicFields: [],
          }),
        ],
      },
    ],
  }),
});
