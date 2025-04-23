import { Link } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useGo, useNavigation } from '@refinedev/core';
import React from 'react';
import { ValueDisplay } from '../ValueDisplay';

type Props = {
  resourceKind: string;
  namespace: string;
  name: string;
  displayName?: string;
  uid?: string;
};

const LinkStyle = css`
  padding: 0 !important;
`;

export const ResourceLink: React.FC<Props> = props => {
  const { resourceKind: resourceName, namespace, name: resourceId, uid, displayName } = props;
  const navigation = useNavigation();
  const go = useGo();
  const onClick = () => {
    go({
      to: navigation.showUrl(resourceName, ''),
      query: {
        id: namespace ? `${namespace}/${resourceId}` : resourceId,
        uid,
      },
      options: {
        keepQuery: true,
      },
    });
  };

  return resourceId ? (
    <Link className={LinkStyle} onClick={onClick} title={displayName || resourceId}>
      {displayName || resourceId}
    </Link>
  ) : (
    <ValueDisplay value="" />
  );
};
