export type ShowField = {
  title: string;
  path: string[];
  render?: (val: unknown) => React.ReactElement;
};

export const MetadataFields: ShowField[] = [
  {
    title: '名字',
    path: ['metadata', 'name'],
  },
  {
    title: '名字空间',
    path: ['metadata', 'namespace'],
  },
  {
    title: '创建时间',
    path: ['metadata', 'creationTimestamp'],
  },
];
