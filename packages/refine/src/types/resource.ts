import { UseFormProps } from '@refinedev/react-hook-form';
import { Unstructured } from 'k8s-api-provider';
import { YamlFormProps } from '../components';
import { RefineFormField } from '../components/Form';
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
  hideListToolBar?: boolean;
  hideNamespacesFilter?: boolean;
  description?: string;
  parent?: RESOURCE_GROUP;
  formatter?: (v: Model) => Model;
  initValue?: Record<string, unknown>;
  columns?: () => Column<Model>[];
  noShow?: boolean;
  showConfig?: () => ShowConfig<Model>;
  Dropdown?: React.FC<{ record: Model }>;
  isCustom?: boolean;
  formConfig?: {
    fields?: (props: {
      record?: Model;
      records: Model[];
      action: 'create' | 'edit';
    }) => RefineFormField[];
    renderForm?: (props: YamlFormProps) => React.ReactNode;
    formType?: FormType;
    transformInitValues?: (values: Unstructured) => Unstructured;
    transformApplyValues?: (values: Unstructured) => Unstructured;
    formTitle?: string | ((action: 'create' | 'edit') => string);
    formDesc?: string;
    formatError?: (errorBody: any) => string;
    refineCoreProps?: UseFormProps['refineCoreProps'];
  };
};
