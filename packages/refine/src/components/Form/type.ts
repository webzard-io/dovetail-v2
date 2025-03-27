import React from 'react';
import { Control } from 'react-hook-form';
import { FormType } from 'src/types/resource';

export type RefineFormValidator = (
  value: unknown,
  formValue: unknown,
  formMode: FormType
) => { isValid: boolean; errorMsg: string };

export type RefineFormField = {
  path: string[];
  key: string;
  label: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  type?: 'number';
  validators?: RefineFormValidator[];
  disabledWhenEdit?: boolean;
  render?: (
    value: unknown,
    onChange: (event: unknown) => void,
    formValue: unknown,
    onBlur: () => void,
    action: 'edit' | 'create',
    control: Control,
  ) => React.ReactElement;
};
