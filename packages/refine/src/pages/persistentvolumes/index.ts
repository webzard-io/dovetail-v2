import { i18n as I18n } from 'i18next';
import { BasicGroup } from 'src/components/ShowContent/groups';
import {
  AgeColumnRenderer,
  PVAccessModeColumnRenderer,
  PVCapacityColumnRenderer,
  PVVolumeModeColumnRenderer,
  PVPhaseColumnRenderer,
  PVStorageClassColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { RESOURCE_GROUP, ResourceConfig } from 'src/types';
import { PVAccessModeField, PVCapacityField, PVPhaseField, PVStorageClassField, PVVolumeModeField } from '../../components';
import { PersistentVolumeModel } from '../../models';

export const PersistentVolumeConfig = (i18n: I18n): ResourceConfig<PersistentVolumeModel> => ({
  name: 'persistentvolumes',
  basePath: '/api/v1',
  apiVersion: 'v1',
  kind: 'PersistentVolume',
  parent: RESOURCE_GROUP.STORAGE,
  label: 'PersistentVolumes',
  initValue: {},
  columns: () => [
    PVCapacityColumnRenderer(i18n),
    PVStorageClassColumnRenderer(i18n),
    PVPhaseColumnRenderer(i18n),
    PVVolumeModeColumnRenderer(i18n),
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
            basicFields: [
              PVCapacityField(i18n),
              PVStorageClassField(i18n),
              PVPhaseField(i18n),
              PVVolumeModeField(i18n),
              PVAccessModeField(i18n)
            ],
          }),
        ],
      },
    ],
  }),
});
