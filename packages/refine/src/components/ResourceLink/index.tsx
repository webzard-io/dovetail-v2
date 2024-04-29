import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useGo, useNavigation } from '@refinedev/core';

import React from 'react';

type Props = {
  name: string;
  namespace: string;
  resourceId: string;
};

const LinkStyle = css`
  padding: 0 !important;
`;

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

  return (
    <kit.Link className={LinkStyle} onClick={onClick}>
      {resourceId}
    </kit.Link>
  );
};
