import { i18n } from 'i18next';
import { DataGroup, BasicGroup } from '../../components/ShowContent';
import {
  AgeColumnRenderer,
  DataKeysColumnRenderer,
} from '../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const ConfigMapConfig = (i18n: i18n): ResourceConfig<ResourceModel> => ({
  name: 'configmaps',
  kind: 'ConfigMap',
  basePath: '/api/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.STORAGE,
  label: 'ConfigMaps',
  description:
    'ConfigMap 常用于存储工作负载所需的配置信息，许多应用程序会从配置文件、命令行参数或环境变量中读取配置信息。',
  columns: () => [DataKeysColumnRenderer(i18n), AgeColumnRenderer(i18n)],
  showConfig: () => ({
    tabs: [
      {
        title: i18n.t('dovetail.detail'),
        key: 'detail',
        groups: [BasicGroup(i18n), DataGroup(i18n)],
      },
    ],
  }),
  customPath: {
    list: '/custom-config-map-path',
    show: '/custom-config-map-path/show',
  },
});
