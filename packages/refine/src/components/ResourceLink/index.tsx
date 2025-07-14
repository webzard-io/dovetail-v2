import { Link } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useCan, useGo, useNavigation } from '@refinedev/core';
import React from 'react';
import { AccessControlAuth } from 'src/constants';
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
  const { resourceKind: resourceName, namespace, name, uid, displayName } = props;
  const navigation = useNavigation();
  const go = useGo();

  const { data } = useCan({
    resource: resourceName,
    action: AccessControlAuth.Read,
    params: {
      namespace,
    },
  });

  const isCanRead = data?.can;

  if (!isCanRead) {
    return <span>{name}</span>;
  }

  const onClick = () => {
    go({
      to: navigation.showUrl(resourceName, ''),
      query: {
        id: namespace ? `${namespace}/${name}` : name,
        uid,
      },
      options: {
        keepQuery: true,
      },
    });
  };

  return name ? (
    <Link className={LinkStyle} onClick={onClick} title={displayName || name}>
      {displayName || name}
    </Link>
  ) : (
    <ValueDisplay value="" />
  );
};
