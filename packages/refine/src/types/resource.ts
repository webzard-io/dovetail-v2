import { AntdDrawerProps } from '@cloudtower/eagle';
import { ShowField } from '../components/ShowContent';
import { Column } from '../components/Table';
import { ResourceModel } from '../models';

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
  columns?: () => Column<Model>[];
  showFields?: () => ShowField<Model>[][];
  Dropdown?: React.FC<{ record: Model }>;
  // If true, dovetail will not automatically render its router elements.
  // You should add its router elements manually.
  isCustom?: boolean;
  // If true, the show page will display in a drawer, not a new page.
  isDrawerShowMode?: boolean;
  drawerProps?: AntdDrawerProps;
};
