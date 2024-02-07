import { useUIKit } from '@cloudtower/eagle';
import { useGo, useNavigation } from '@refinedev/core';
import type { OwnerReference } from 'kubernetes-types/meta/v1';

import React, { useContext } from 'react';
import { ConfigsContext } from '../../contexts';

type Props = {
  ownerReference: OwnerReference;
  namespace: string;
};

export const ReferenceLink: React.FC<Props> = props => {
  const { ownerReference, namespace } = props;
  const kit = useUIKit();
  const navigation = useNavigation();
  const go = useGo();
  const configs = useContext(ConfigsContext);

  // no ReplicaSet page, show plain text
  if (ownerReference.kind === 'ReplicaSet') {
    return <span>{ownerReference.name}</span>;
  }

  const resource = Object.values(configs).find(c => c.kind === ownerReference.kind);

  const onClick = () => {
    go({
      to: navigation.showUrl(resource?.name || '', ''),
      query: {
        id: `${namespace}/${ownerReference.name}`,
      },
      options: {
        keepQuery: true,
      },
    });
  };

  if (!resource) {
    return <span>-</span>;
  }

  return (
    <kit.button type="link" onClick={onClick}>
      {ownerReference.name}
    </kit.button>
  );
};
