import type { OwnerReference } from 'kubernetes-types/meta/v1';
import React, { useContext } from 'react';
import ValueDisplay from 'src/components/ValueDisplay';
import { ConfigsContext } from '../../contexts';
import { ResourceLink } from '../ResourceLink';

type Props = {
  ownerReference: OwnerReference;
  namespace: string;
};

export const ReferenceLink: React.FC<Props> = props => {
  const { ownerReference, namespace } = props;
  const configs = useContext(ConfigsContext);

  // no ReplicaSet page, show plain text
  if (ownerReference.kind === 'ReplicaSet') {
    return <span>{ownerReference.name}</span>;
  }

  const resource = Object.values(configs).find(c => c.kind === ownerReference.kind);

  if (!resource) {
    return <ValueDisplay value="" />;
  }

  return (
    <ResourceLink
      name={ownerReference.name}
      resourceName={resource.name || ''}
      namespace={namespace}
    />
  );
};
