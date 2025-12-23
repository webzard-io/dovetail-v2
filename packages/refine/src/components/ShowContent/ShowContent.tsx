import { useParsed, useResource } from '@refinedev/core';
import React from 'react';
import K8sDropdown from 'src/components/Dropdowns/K8sDropdown';
import { ResourceModel } from '../../models';
import { ShowContentView, ShowContentViewProps } from './ShowContentView';

type Props<Model extends ResourceModel> = React.PropsWithChildren<
  Omit<ShowContentViewProps<Model>, 'id' | 'resourceName'>
>;

export const ShowContent = <Model extends ResourceModel>(props: Props<Model>) => {
  const { showConfig, formatter, Dropdown = K8sDropdown, children } = props;
  const parsed = useParsed();
  const { resource } = useResource();
  const id = parsed?.params?.id;

  return (
    <ShowContentView
      id={id as string}
      resourceName={resource?.name || ''}
      showConfig={showConfig}
      formatter={formatter}
      Dropdown={Dropdown}
    >
      {children}
    </ShowContentView>
  );
};
