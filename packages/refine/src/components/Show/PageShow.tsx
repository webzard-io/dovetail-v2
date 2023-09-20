import { useUIKit } from '@cloudtower/eagle';
import { useParsed, useShow } from '@refinedev/core';
import React from 'react';
import { ShowField } from './Fields';
import { ShowContent } from './ShowContent';

export const PageShow: React.FC<{ fields: ShowField[] }> = ({ fields }) => {
  const kit = useUIKit();
  const parsed = useParsed();
  const { queryResult } = useShow({ id: parsed?.params?.id });
  const { isLoading } = queryResult;

  return isLoading ? <kit.loading /> : <ShowContent fields={fields} />;
};
