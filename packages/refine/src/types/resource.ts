import { FormModalProps } from 'src/components/FormModal';
import { RefineFormConfig } from '../components/RefineForm';
import { ShowConfig } from '../components/ShowContent';
import { Column } from '../components/Table';
import { ResourceModel } from '../models';

export enum RESOURCE_GROUP {
  WORKLOAD = 'WORKLOAD',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  CLUSTER = 'CLUSTER',
  SERVICE = 'SERVICE',
  SERVICE_AND_NETWORK = 'SERVICE_AND_NETWORK',
}

export enum FormType {
  PAGE = 'PAGE',
  MODAL = 'MODAL',
}

export type WithId<T> = T & { id: string };

export type ResourceConfig<Model extends ResourceModel = ResourceModel> = {
  name: string;
  kind: string;
  basePath: string;
  apiVersion: string;
  label: string;
  description?: string;
  parent?: RESOURCE_GROUP;
  formatter?: (v: Model) => Model;
  initValue?: Record<string, unknown>;
  columns?: () => Column<Model>[];
  showConfig?: () => ShowConfig<Model>;
  Dropdown?: React.FC<{ record: Model }>;
  formType?: FormType;
  FormModal?: React.FC<FormModalProps>;
  isCustom?: boolean;
  formConfig?: RefineFormConfig;
};
