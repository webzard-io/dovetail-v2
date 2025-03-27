import { i18n as I18n } from 'i18next';
import { BasicGroup, StorageClassPvGroup } from 'src/components/ShowContent/groups';
import { STORAGE_CLASS_INIT_VALUE } from 'src/constants/k8s';
import {
  NameSpaceColumnRenderer,
  ProvisionerColumnRenderer,
  AgeColumnRenderer,
  SCAllowExpandColumnRenderer
} from 'src/hooks/useEagleTable/columns';
import { StorageClassModel } from 'src/models';
import { RESOURCE_GROUP, ResourceConfig } from 'src/types';
import { StorageClassProvisionerField } from '../../components';
import { generateStorageClassFormConfig } from './form';

export const StorageClassConfig = (i18n: I18n): ResourceConfig<StorageClassModel> => ({
  name: 'storageclasses',
  basePath: '/apis/storage.k8s.io/v1',
  kind: 'StorageClass',
  apiVersion: 'storage.k8s.io/v1',
  parent: RESOURCE_GROUP.STORAGE,
  displayName: i18n.t('dovetail.storage_class'),
  initValue: STORAGE_CLASS_INIT_VALUE,
  formConfig: generateStorageClassFormConfig({
    isEnabledZbs: true,
    isEnabledElf: false,
    isVmKsc: true,
  }),
  columns: () => [
    NameSpaceColumnRenderer(i18n),
    ProvisionerColumnRenderer(i18n),
    SCAllowExpandColumnRenderer(i18n),
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
                fields: [StorageClassProvisionerField(i18n)],
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
