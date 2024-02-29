export type RefineFormValidator = (
  value: unknown,
  formValue: unknown
) => { isValid: boolean; errorMsg: string };

export type RefineFormField = {
  path: string[];
  key: string;
  label: string;
  type?: 'number';
  validators?: RefineFormValidator[];
  render?: React.FC<{
    value: unknown;
    onChange: (event: unknown) => void;
    onBlur: () => void;
  }>;
};

export type RefineFormConfig = {
  fields: RefineFormField[];
};
