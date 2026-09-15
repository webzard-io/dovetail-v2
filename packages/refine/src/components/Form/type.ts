import React from 'react';
import {
  Control,
  UseFormTrigger,
  FieldValues,
  ControllerRenderProps,
} from 'react-hook-form';
import { ResourceModel } from 'src/models';
import { FormType } from 'src/types/resource';

export enum FormItemLayout {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}

export type RefineFormValidator = (
  value: unknown,
  formValue: unknown,
  formMode: FormType
) =>
  | { isValid: boolean; errorMsg: string }
  | Promise<{ isValid: boolean; errorMsg: string }>;

export type RefineFormFieldRenderProps = {
  field: ControllerRenderProps<FieldValues, string>;
  fieldConfig: RefineFormField;
  action: 'edit' | 'create';
  control: Control;
  trigger: UseFormTrigger<FieldValues>;
  formValue: unknown;
};

export type RefineFormField = {
  path: string[];
  key: string;
  label: React.ReactNode | ((formValue: FieldValues) => React.ReactNode);
  placeholder?: string;
  helperText?: React.ReactNode;
  type?: 'number';
  validators?: RefineFormValidator[];
  isSkipValidationInYaml?: boolean;
  /**
   * YAML 模式的校验错误默认会在末尾附上字段 path，便于定位。
   * 当字段在 YAML 里没有对应 path（如它是文档的顶层 key）时，附上 path 反而误导，可用此项关闭。
   */
  isHidePathInYamlError?: boolean;
  disabledWhenEdit?: boolean;
  layout?: FormItemLayout;
  isHideErrorStatus?: boolean;
  render?: (props: RefineFormFieldRenderProps) => React.ReactElement;
  /**
   * 表单项条件渲染函数
   * @param formValue 表单值
   * @returns 是否渲染
   */
  condition?: (formValue: Record<string, unknown>, value: unknown) => boolean;
};

export type RefineFormSection<Model extends ResourceModel = ResourceModel> = {
  title: string;
  collapsable?: boolean;
  defaultCollapse?: boolean;
  fields: (props: {
    record?: Model;
    records: Model[];
    action: 'create' | 'edit';
    step?: number;
  }) => RefineFormField[];
};
