import { useUIKit } from '@cloudtower/eagle';
import { useNavigation, useParsed, useShow } from '@refinedev/core';
import { Drawer } from 'antd';
import { ResourceModel } from 'k8s-api-provider';
import React from 'react';
import { ShowField, ShowContent } from '../ShowContent';

type Props<Model extends ResourceModel> = {
  fieldGroups: ShowField<Model>[][];
  formatter?: (r: Model) => Model;
};

export const DrawerShow = <Model extends ResourceModel>(
  props: Props<Model>
) => {
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
      {isLoading ? <kit.loading /> : <ShowContent {...props} />}
    </Drawer>
  );
};
