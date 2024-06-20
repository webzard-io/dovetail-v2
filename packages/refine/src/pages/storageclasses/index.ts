import { i18n as I18n } from 'i18next';
import { BasicGroup, StorageClassPvGroup } from 'src/components/ShowContent/groups';
import { STORAGE_CLASS_INIT_VALUE } from 'src/constants/k8s';
import {
  NameSpaceColumnRenderer,
  ProvisionerColumnRenderer,
  FsTypeColumnRenderer,
  AgeColumnRenderer,
} from 'src/hooks/useEagleTable/columns';
import { RESOURCE_GROUP } from 'src/types';
import { StorageClassFsTypeField, StorageClassProvisionerField } from '../../components';
import { generateStorageClassFormConfig } from './form';

export const StorageClassConfig = (i18n: I18n) => ({
  name: 'storageclasses',
  basePath: '/apis/storage.k8s.io/v1',
  kind: 'StorageClass',
  parent: RESOURCE_GROUP.STORAGE,
  label: 'StorageClasses',
  initValue: STORAGE_CLASS_INIT_VALUE,
  formConfig: generateStorageClassFormConfig({
    isEnabledZbs: true,
    isEnabledElf: false,
    isVmKsc: true,
  }),
  columns: () => [
    NameSpaceColumnRenderer(i18n),
    ProvisionerColumnRenderer(i18n),
    FsTypeColumnRenderer(i18n),
    AgeColumnRenderer(i18n),
  ],
  showConfig: () => ({
    tabs: [
      {
        title: i18n.t('dovetail.detail'),
        key: 'detail',
        groups: [
          BasicGroup(i18n, {
            downAreas: [
              {
                fields: [
                  StorageClassProvisionerField(i18n),
                  StorageClassFsTypeField(i18n),
                ],
              },
            ],
          }),
          StorageClassPvGroup(i18n),
        ],
      },
    ],
  }),
});

export * from './form';
