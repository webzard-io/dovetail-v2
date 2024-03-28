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
  render?: (
    value: unknown,
    onChange: (event: unknown) => void,
    formValue: unknown,
    onBlur: () => void
  ) => React.ReactElement;
};
