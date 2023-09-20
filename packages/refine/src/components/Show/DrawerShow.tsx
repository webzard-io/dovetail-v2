import { useUIKit } from '@cloudtower/eagle';
import { useNavigation, useParsed, useShow } from '@refinedev/core';
import { Drawer } from 'antd';
import React from 'react';
import { ShowField } from './Fields';
import { ShowContent } from './ShowContent';

export const DrawerShow: React.FC<{ fields: ShowField[] }> = ({ fields }) => {
  const kit = useUIKit();
  const parsed = useParsed();
  const nav = useNavigation();
  const { queryResult } = useShow({ id: parsed?.params?.id });
  const { isLoading } = queryResult;

  return (
    <Drawer
      title="Show Drawer"
      placement="right"
      onClose={() => nav.goBack()}
      width="50%"
      visible={!!parsed?.params?.id}
    >
      {isLoading ? <kit.loading /> : <ShowContent fields={fields} />}
    </Drawer>
  );
};
