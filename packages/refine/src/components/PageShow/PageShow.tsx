import { useUIKit } from '@cloudtower/eagle';
import { useParsed, useShow } from '@refinedev/core';
import React from 'react';
import { ShowContent, ShowField } from '../ShowContent';

type Props = {
  fieldGroups: ShowField[][];
};
export const PageShow: React.FC<Props> = ({ fieldGroups }) => {
  const kit = useUIKit();
  const parsed = useParsed();
  const { queryResult } = useShow({ id: parsed?.params?.id });
  const { isLoading } = queryResult;

  return isLoading ? <kit.loading /> : <ShowContent fieldGroups={fieldGroups} />;
};
