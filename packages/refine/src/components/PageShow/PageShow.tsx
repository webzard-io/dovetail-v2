import { useUIKit } from '@cloudtower/eagle';
import { useParsed, useShow } from '@refinedev/core';
import React from 'react';
import { ResourceModel } from '../../models';
import { ShowContent, ShowField } from '../ShowContent';

type Props<Model extends ResourceModel> = {
  fieldGroups: ShowField<Model>[][];
  formatter?: (r: Model) => Model;
  Dropdown?: React.FC<{ record: Model }>;
};
export const PageShow = <Model extends ResourceModel>(props: Props<Model>) => {
  const kit = useUIKit();
  const parsed = useParsed();
  const { queryResult } = useShow({ id: parsed?.params?.id });
  const { isLoading } = queryResult;

  return isLoading ? <kit.loading /> : <ShowContent {...props} />;
};
