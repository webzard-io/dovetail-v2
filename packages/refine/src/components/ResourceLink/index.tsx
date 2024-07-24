import { Link } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useGo, useNavigation } from '@refinedev/core';

import React from 'react';

type Props = {
  resourceName: string;
  namespace: string;
  resourceId: string;
};

const LinkStyle = css`
  padding: 0 !important;
`;

export const ResourceLink: React.FC<Props> = props => {
  const { resourceName, namespace, resourceId } = props;
  const navigation = useNavigation();
  const go = useGo();
  const onClick = () => {
    go({
      to: navigation.showUrl(resourceName, ''),
      query: {
        id: namespace ? `${namespace}/${resourceId}` : resourceId,
      },
      options: {
        keepQuery: true,
      },
    });
  };

  return (
    <Link className={LinkStyle} onClick={onClick}>
      {resourceId}
    </Link>
  );
};
