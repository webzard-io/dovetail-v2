import { i18n } from 'i18next';
import { ResourceModel } from 'k8s-api-provider';
import { ObjectMeta } from 'kubernetes-types/meta/v1';
import { ShowField } from '../components/ShowContent';
import { Column } from '../components/Table';

export enum RESOURCE_GROUP {
  WORKLOAD = 'WORKLOAD',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  CLUSTER = 'CLUSTER',
}

export type WithId<T> = T & { id: string };

export interface Resource {
  id: string;
  apiVersion?: string;
  /**
   * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   */
  kind?: string;
  /**
   * Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
   */
  metadata?: ObjectMeta;
}

export type ResourceConfig<
  Raw extends Resource = Resource,
  Model extends ResourceModel = ResourceModel
> = {
  name: string;
  kind: string;
  basePath: string;
  apiVersion: string;
  label: string;
  parent?: RESOURCE_GROUP;
  formatter?: (v: Raw) => Model;
  initValue?: Record<string, unknown>;
  columns?: (i18n: i18n) => Column<Model>[];
  showFields?: (i18n: i18n) => ShowField<Model>[][];
  Dropdown?: React.FC<{ data: Model }>;
  isCustom?: boolean;
};
