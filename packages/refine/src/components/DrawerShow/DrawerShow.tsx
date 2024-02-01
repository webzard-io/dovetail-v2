import { useUIKit, AntdDrawerProps } from '@cloudtower/eagle';
import { useNavigation, useParsed, useShow } from '@refinedev/core';
import React from 'react';
import { ResourceModel } from '../../models';
import { ShowField, ShowContent } from '../ShowContent';

type Props<Model extends ResourceModel> = {
  fieldGroups: ShowField<Model>[][];
  formatter?: (r: Model) => Model;
  drawerProps?: AntdDrawerProps;
};

export const DrawerShow = <Model extends ResourceModel>(props: Props<Model>) => {
  const kit = useUIKit();
  const parsed = useParsed();
  const nav = useNavigation();
  const { queryResult } = useShow({ id: parsed?.params?.id });
  const { isLoading } = queryResult;

  return (
    <kit.antdDrawer
      placement="right"
      onClose={() => nav.goBack()}
      width={'50%'}
      visible={!!parsed?.params?.id}
      {...props.drawerProps}
    >
      {isLoading ? <kit.loading /> : <ShowContent {...props} />}
    </kit.antdDrawer>
  );
};
