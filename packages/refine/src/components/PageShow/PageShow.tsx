import { useUIKit } from '@cloudtower/eagle';
import { useParsed, useShow } from '@refinedev/core';
import React from 'react';
import { ResourceModel } from '../../model';
import { Resource, ShowField } from '../../types';
import { ShowContent } from '../ShowContent';

type Props<Raw extends Resource, Model extends ResourceModel> = {
  fieldGroups: ShowField<Model>[][];
  formatter: (r: Raw) => Model;
  Dropdown?: React.FC<{ data: Model }>;
};
export const PageShow = <Raw extends Resource, Model extends ResourceModel>(
  props: Props<Raw, Model>
) => {
  const kit = useUIKit();
  const parsed = useParsed();
  const { queryResult } = useShow({ id: parsed?.params?.id });
  const { isLoading } = queryResult;

  return isLoading ? <kit.loading /> : <ShowContent {...props} />;
};
