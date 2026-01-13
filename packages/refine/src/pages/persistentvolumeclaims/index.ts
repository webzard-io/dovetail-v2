import { i18n as I18n } from 'i18next';
import { BasicGroup } from 'src/components/ShowContent/groups';
import {
  AgeColumnRenderer,
  PVAccessModeColumnRenderer,
  PVCStorageColumnRenderer,
  PVVolumeModeColumnRenderer,
  PVPhaseColumnRenderer,
  PVStorageClassColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { RESOURCE_GROUP, ResourceConfig } from 'src/types';
import {
  PVAccessModeField,
  PVCStorageField,
  PVPhaseField,
  PVStorageClassField,
  PVVolumeModeField,
} from '../../components';
import { PersistentVolumeClaimModel } from '../../models';

export const PersistentVolumeClaimConfig = (
  i18n: I18n
): ResourceConfig<PersistentVolumeClaimModel> => ({
  name: 'persistentvolumeclaims',
  basePath: '/api/v1',
  apiVersion: 'v1',
  kind: 'PersistentVolumeClaim',
  parent: RESOURCE_GROUP.STORAGE,
  displayName: i18n.t('dovetail.pvc'),
  initValue: {},
  columns: () => [
    PVCStorageColumnRenderer(i18n),
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
              PVCStorageField({ i18n }),
              PVStorageClassField(i18n),
              PVPhaseField(i18n),
              PVVolumeModeField(i18n),
              PVAccessModeField(i18n),
            ],
          }),
        ],
      },
    ],
  }),
});
