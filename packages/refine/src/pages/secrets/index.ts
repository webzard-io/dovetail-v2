import { i18n } from 'i18next';
import { ResourceModel } from 'k8s-api-provider';
import { SecretDataField } from '../../components/ShowContent';
import { AgeColumnRenderer } from '../../hooks/useEagleTable/columns';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const SecretsConfig: ResourceConfig<ResourceModel> = {
  name: 'secrets',
  kind: 'Secret',
  basePath: '/api/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.STORAGE,
  label: 'Secrets',
  columns: (i18n: i18n) => [AgeColumnRenderer(i18n)],
  showFields: (i18n: i18n) => [[], [], [SecretDataField(i18n)]],
};
