import { i18n } from 'i18next';
import { DataField } from '../components/ShowContent';
import { AgeColumnRenderer } from '../hooks/useEagleTable/columns';
import { ResourceConfig } from '../types';

export const ResourcesConfig: ResourceConfig[] = [
  {
    name: 'configmaps',
    kind: 'ConfigMap',
    basePath: '/api/v1',
    apiVersion: 'v1',
    parent: 'core',
    columns: (i18n: i18n) => [AgeColumnRenderer(i18n)],
    showFields: (i18n: i18n) => [[], [DataField(i18n)], []],
  },
  {
    name: 'secrets',
    kind: 'Secret',
    basePath: '/api/v1',
    apiVersion: 'v1',
    parent: 'core',
    columns: (i18n: i18n) => [AgeColumnRenderer(i18n)],
    showFields: (i18n: i18n) => [[], [DataField(i18n)], []],
  },
];
