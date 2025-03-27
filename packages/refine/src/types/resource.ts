import { UseFormProps } from '@refinedev/react-hook-form';
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

/**
 * 表单容器类型
 */
export enum FormContainerType {
  PAGE = 'PAGE',
  MODAL = 'MODAL',
}

/**
 * 表单类型
 */
export enum FormType {
  YAML = 'YAML',
  FORM = 'FORM',
}

/**
 * 允许切换的表单模式
 */
export enum FormMode {
  FORM = 'FORM',
  YAML = 'YAML',
}

export type WithId<T> = T & { id: string };

export type RefineFormConfig<Model extends ResourceModel = ResourceModel> = {
  formType: FormType.FORM;
  /**
 * 表单字段配置函数
 * @param props 包含记录和动作类型的配置对象
 * @returns 表单字段配置数组
 */
  fields?: (props: {
    record?: Model;
    records: Model[];
    action: 'create' | 'edit';
  }) => RefineFormField[];
  /** Refine Core 的表单属性 */
  refineCoreProps?: UseFormProps['refineCoreProps'];
  /** React Hook Form 的配置属性 */
  useFormProps?: UseFormProps;
  /** 是否禁用切换表单模式（在 YAML 和表单之间切换） */
  isDisabledChangeMode?: boolean;
  /** 表单标签的宽度
   * 默认是 216px
   */
  labelWidth?: string;
  /**
 * 自定义表单渲染函数
 * @returns React节点
 */
  renderForm?: () => React.ReactNode;
};

export type YamlFormConfig = {
  formType: FormType.YAML;
};

export type ErrorBody = {
  kind: string;
  apiVersion: string;
  metadata: object;
  status: string;
  message: string;
  reason: string;
  details: {
    name: string;
    group: string;
    kind: string;
    causes?: {
      reason: string;
      message: string;
      field: string;
    }[];
  };
  code: number;
};

export type CommonFormConfig<Model extends ResourceModel = ResourceModel> = {
  /** 自定义表单模态框组件 */
  CustomFormModal?: React.FC<FormModalProps>;
  /**
   * 初始值转换函数
   * @param values 原始值
   * @returns 转换后的值
   */
  transformInitValues?: (values: Record<string, unknown>) => Record<string, unknown>;
  /**
   * 提交值转换函数，转换为 YAML 格式
   * @param values 表单值
   * @returns YAML格式的数据
   */
  transformApplyValues?: (values: Record<string, unknown>) => Model['_rawYaml'];
  /** 表单容器类型：页面形式或模态框形式
   * PAGE 或者 MODAL
  */
  formContainerType?: FormContainerType;
  /**
   * 表单标题，可以是字符串或根据操作类型返回不同标题的函数
   * @param action 操作类型：create 或 edit
   */
  formTitle?: string | ((action: 'create' | 'edit') => string);
  /**
   * 表单描述，可以是字符串或根据操作类型返回不同描述的函数
   * @param action 操作类型：create 或 edit
   */
  formDesc?: string | ((action: 'create' | 'edit') => string);
  /** 保存按钮文本 */
  saveButtonText?: string;
  /**
   * 错误信息格式化函数，待完善
   * @param errorBody 错误信息体
   * @returns 格式化后的错误信息
   */
  formatError?: (errorBody: ErrorBody) => string;
  /**
   * 路径映射，用于在表单中映射路径
   */
  pathMap?: { from: string[]; to: string[] }[];
};

export type ResourceConfig<Model extends ResourceModel = ResourceModel> = {
  /** 资源名称，用于 API 调用和路由。
   * 默认复数形式，如：deployments
   */
  name: string;
  /** Kubernetes 资源类型
   * 如：Deployment
   */
  kind: string;
  /** API 请求的基础路径
   * 实际效果为：{apiUrl}{basePath}{apiVersion}{name}
   */
  basePath: string;
  /** Kubernetes API 版本，会影响请求 URL
   * 实际效果为：{apiUrl}{basePath}{apiVersion}{name}
  */
  apiVersion: string;
  /** 资源在界面上显示的名称 */
  displayName?: string;
  /** 是否隐藏列表页的工具栏。会连标题和描述一起去掉 */
  hideListToolBar?: boolean;
  /** 是否隐藏命名空间过滤器 */
  hideNamespacesFilter?: boolean;
  /** 是否隐藏编辑功能。会隐藏 Dropdown 和详情中的编辑按钮 */
  hideEdit?: boolean;
  /** 是否隐藏创建功能 */
  hideCreate?: boolean;
  /** 资源的描述信息 */
  description?: string;
  /** 父级资源名称，用于建立资源层级关系。在 Dovetail2 中用不到这个 */
  parent?: string;
  /** 格式化数据参数，目前暂未完全实现，可能会删除 */
  formatter?: (v: Model) => Model;
  /** 创建资源时的初始值 */
  initValue?: Record<string, unknown>;
  /** 定义资源列表的表格列配置 */
  columns?: () => Column<Model>[];
  /** 是否禁用详情页面。禁用后，表格的名称将无法点击。仅对配置型表格有效。 */
  noShow?: boolean;
  /** 详情页面的配置 */
  showConfig?: () => ShowConfig<Model>;
  /** 自定义下拉菜单组件 */
  Dropdown?: React.FC<{ record: Model }>;
  /** 表格组件的额外属性配置。会被传递给表格组件。仅对配置型表格有效。 */
  tableProps?: Partial<InternalTableProps<Model>>;
  /** 是否为自定义资源。
   * 开启后，Dovetail不会为该资源创建路由，也不会渲染默认的UI组件。
   */
  isCustom?: boolean;
  /** 创建按钮的文本 */
  createButtonText?: string;
  /** 删除操作的提示文本
   * 默认是：该操作无法被撤回。
   */
  deleteTip?: string;
  /** 表单相关配置 */
  formConfig?: (RefineFormConfig<Model> | YamlFormConfig) & CommonFormConfig<Model>;
};
