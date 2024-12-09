import { UseFormProps } from '@refinedev/react-hook-form';
import { YamlFormProps } from '../components';
import { FormModalProps, RefineFormField } from '../components/Form';
import { Column, InternalTableProps } from '../components/InternalBaseTable';
import { ShowConfig } from '../components/ShowContent';
import { ResourceModel } from '../models';

export enum RESOURCE_GROUP {
  WORKLOAD = 'WORKLOAD',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  CLUSTER = 'CLUSTER',
  SERVICE = 'SERVICE',
  SERVICE_AND_NETWORK = 'SERVICE_AND_NETWORK',
  CONFIG = 'CONFIG',
  NODE_MANAGEMENT = 'NODE_MANAGEMENT',
  PROJECT = 'PROJECT',
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
  displayName?: string;
  hideListToolBar?: boolean;
  hideNamespacesFilter?: boolean;
  hideEdit?: boolean;
  hideCreate?: boolean;
  description?: string;
  parent?: string;
  formatter?: (v: Model) => Model;
  initValue?: Record<string, unknown>;
  columns?: () => Column<Model>[];
  noShow?: boolean;
  showConfig?: () => ShowConfig<Model>;
  Dropdown?: React.FC<{ record: Model }>;
  tableProps?: Partial<InternalTableProps<Model>>;
  isCustom?: boolean;
  createButtonText?: string;
  formConfig?: {
    fields?: (props: {
      record?: Model;
      records: Model[];
      action: 'create' | 'edit';
    }) => RefineFormField[];
    saveButtonText?: string;
    renderForm?: (props: YamlFormProps) => React.ReactNode;
    formType?: FormType;
    transformInitValues?: (values: Record<string, unknown>) => Record<string, unknown>;
    transformApplyValues?: (values: Record<string, unknown>) => Model['_rawYaml'];
    formTitle?: string | ((action: 'create' | 'edit') => string);
    formDesc?: string | ((action: 'create' | 'edit') => string);
    labelWidth?: string;
    formatError?: (errorBody: unknown) => string;
    refineCoreProps?: UseFormProps['refineCoreProps'];
    useFormProps?: UseFormProps;
    isDisabledChangeMode?: boolean;
    CustomFormModal?: React.FC<FormModalProps>;
  };
};
