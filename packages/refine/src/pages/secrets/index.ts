import { i18n } from 'i18next';
import { SECRET_OPAQUE_INIT_VALUE } from 'src/constants/k8s';
import { SecretDataGroup, BasicGroup } from '../../components/ShowContent';
import { AgeColumnRenderer, DataKeysColumnRenderer } from '../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const SecretsConfig = (i18n: i18n): ResourceConfig<ResourceModel> => ({
  name: 'secrets',
  kind: 'Secret',
  basePath: '/api/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.STORAGE,
  label: 'Secrets',
  initValue: SECRET_OPAQUE_INIT_VALUE,
  columns: () => [DataKeysColumnRenderer(i18n), AgeColumnRenderer(i18n)],
  showConfig: () => ({
    tabs: [
      {
        title: i18n.t('dovetail.detail'),
        key: 'detail',
        groups: [BasicGroup(i18n), SecretDataGroup()],
      },
    ],
  }),
});
