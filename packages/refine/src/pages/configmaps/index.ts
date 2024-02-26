import { i18n } from 'i18next';
import { DataTab, BasicGroup, } from '../../components/ShowContent';
import { AgeColumnRenderer } from '../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const ConfigMapConfig = (i18n: i18n): ResourceConfig<ResourceModel> => ({
  name: 'configmaps',
  kind: 'ConfigMap',
  basePath: '/api/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.STORAGE,
  label: 'ConfigMaps',
  columns: () => [AgeColumnRenderer(i18n)],
  showConfig: () => ({
    tabs: [
      {
        title: i18n.t('dovetail.detail'),
        key: 'detail',
        groups: [BasicGroup(i18n)]
      },
      DataTab(i18n)
    ],
  }),
});
