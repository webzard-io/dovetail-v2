import { useUIKit } from '@cloudtower/eagle';
import { useParsed, useShow } from '@refinedev/core';
import React from 'react';
import { ShowContent } from './ShowContent';

type ShowField = {
  title: string;
  path: string[];
  render?: (val: unknown) => React.ReactElement;
};

export const usePageShow = (fields: ShowField[]) => {
  const kit = useUIKit();
  const parsed = useParsed();
  const { queryResult } = useShow({ id: parsed?.params?.id });
  const { isLoading } = queryResult;

  return isLoading ? <kit.loading /> : <ShowContent fields={fields} />;
};
