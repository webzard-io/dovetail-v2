import { useUIKit } from '@cloudtower/eagle';
import { useGo, useNavigation } from '@refinedev/core';

import React from 'react';

type Props = {
  name: string;
  namespace: string;
  resourceId: string;
};

export const ResourceLink: React.FC<Props> = props => {
  const { name, namespace, resourceId } = props;
  const kit = useUIKit();
  const navigation = useNavigation();
  const go = useGo();

  const onClick = () => {
    go({
      to: navigation.showUrl(name, ''),
      query: {
        id: `${namespace}/${resourceId}`,
      },
      options: {
        keepQuery: true,
      },
    });
  };

  return <kit.Link onClick={onClick}>{resourceId}</kit.Link>;
};
