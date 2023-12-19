import { SecretDataField } from '../../components/ShowContent';
import { AgeColumnRenderer } from '../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const SecretsConfig: ResourceConfig<ResourceModel> = {
  name: 'secrets',
  kind: 'Secret',
  basePath: '/api/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.STORAGE,
  label: 'Secrets',
  columns: () => [AgeColumnRenderer()],
  showFields: () => [[], [], [SecretDataField()]],
};
