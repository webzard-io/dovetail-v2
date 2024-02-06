import { useUIKit } from '@cloudtower/eagle';
import { useGo, useNavigation } from '@refinedev/core';
import type { OwnerReference } from 'kubernetes-types/meta/v1';

import React from 'react';

type Props = {
  ownerReference: OwnerReference;
  namespace: string;
};

export const ReferenceLink: React.FC<Props> = props => {
  const { ownerReference, namespace } = props;
  const kit = useUIKit();
  const navigation = useNavigation();
  const go = useGo();

  const onClick = () => {
    go({
      to: navigation.showUrl(`${ownerReference.kind.toLowerCase()}s`, ''),
      query: {
        id: `${namespace}/${ownerReference.name}`,
      },
      options: {
        keepQuery: true,
      },
    });
  };

  return (
    <kit.button type="link" onClick={onClick}>
      {ownerReference.name}
    </kit.button>
  );
};
