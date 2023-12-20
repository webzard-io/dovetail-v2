import { i18n } from 'i18next';
import { ResourceModel } from 'k8s-api-provider';
import { ShowField } from '../components/ShowContent';
import { Column } from '../components/Table';

export enum RESOURCE_GROUP {
  WORKLOAD = 'WORKLOAD',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  CLUSTER = 'CLUSTER',
}

export type WithId<T> = T & { id: string };

export type ResourceConfig<Model extends ResourceModel = ResourceModel> = {
  name: string;
  kind: string;
  basePath: string;
  apiVersion: string;
  label: string;
  parent?: RESOURCE_GROUP;
  formatter?: (v: Model) => Model;
  initValue?: Record<string, unknown>;
  columns?: (i18n: i18n) => Column<Model>[];
  showFields?: (i18n: i18n) => ShowField<Model>[][];
  Dropdown?: React.FC<{ data: Model }>;
  isCustom?: boolean;
};
