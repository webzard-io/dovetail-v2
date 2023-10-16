import { i18n } from 'i18next';
import { DataField } from '../components/ShowContent';
import { AgeColumnRenderer } from '../hooks/useEagleTable/columns';
import { ResourceModel } from '../model';
import { RESOURCE_GROUP, Resource, ResourceConfig } from '../types';

export const SecretsConfig: ResourceConfig<Resource, ResourceModel> = {
  name: 'secrets',
  kind: 'Secret',
  basePath: '/api/v1',
  apiVersion: 'v1',
  parent: RESOURCE_GROUP.CORE,
  columns: (i18n: i18n) => [AgeColumnRenderer(i18n)],
  showFields: (i18n: i18n) => [[], [DataField(i18n)], []],
};
