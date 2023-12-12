import { ResourceModel } from '..';

export * from './resource';
export * from './metric';

export type ShowField<Model extends ResourceModel> = {
  key: string;
  title: string;
  path: string[];
  render?: (val: unknown, record: Model) => React.ReactElement | undefined;
};
