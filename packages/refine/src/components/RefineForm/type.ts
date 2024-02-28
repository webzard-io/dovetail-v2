export type RefineFormField = {
  path: string[];
  key: string;
  label: string;
  type?: 'number';
};

export type RefineFormConfig = {
  fields: RefineFormField[];
};
