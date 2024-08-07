import { Loading } from '@cloudtower/eagle';
import { useNavigation, useParsed, useShow } from '@refinedev/core';
import { Drawer } from 'antd';
import React from 'react';
import { ResourceModel } from '../../models';
import { ShowConfig, ShowContent } from '../ShowContent';

type Props<Model extends ResourceModel> = {
  showConfig: ShowConfig<Model>;
  formatter?: (r: Model) => Model;
};

export const DrawerShow = <Model extends ResourceModel>(
  props: Props<Model>
) => {
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
      {isLoading ? <Loading /> : <ShowContent {...props} />}
    </Drawer>
  );
};
