import { DataField } from '../../components/ShowContent';
import { AgeColumnRenderer } from '../../hooks/useEagleTable/columns';
import { ResourceModel } from '../../models';
import { RESOURCE_GROUP, ResourceConfig } from '../../types';

export const ConfigMapConfig: ResourceConfig<ResourceModel> = {
  name: 'configmaps',
  kind: 'ConfigMap',
  basePath: '/api/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.STORAGE,
  label: 'ConfigMaps',
  columns: () => [AgeColumnRenderer()],
  showFields: () => [[], [], [DataField()]],
  isDrawerShowMode: true,
};
