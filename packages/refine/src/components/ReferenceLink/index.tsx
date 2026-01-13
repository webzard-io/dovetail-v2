import { useList } from '@refinedev/core';
import type { OwnerReference } from 'kubernetes-types/meta/v1';
import React, { useContext } from 'react';
import ValueDisplay from 'src/components/ValueDisplay';
import { ConfigsContext } from '../../contexts';
import { DeploymentModel, PodModel, ReplicaSetModel } from '../../models';
import { ResourceLink } from '../ResourceLink';

type Props = {
  ownerReference: OwnerReference;
  namespace: string;
  pod: PodModel;
};

export const ReferenceLink: React.FC<Props> = props => {
  const { ownerReference, namespace, pod } = props;
  const configs = useContext(ConfigsContext);
  const { data: deploymentsData } = useList<DeploymentModel>({
    resource: 'deployments',
    meta: {
      kind: 'Deployment',
      resourceBasePath: '/apis/apps/v1',
    },
    pagination: {
      mode: 'off',
    },
  });
  const { data: replicaSetsData } = useList<ReplicaSetModel>({
    resource: 'replicasets',
    meta: {
      kind: 'ReplicaSet',
      resourceBasePath: '/apis/apps/v1',
    },
    pagination: {
      mode: 'off',
    },
  });

  // no ReplicaSet page, show plain text
  if (ownerReference.kind === 'ReplicaSet') {
    const deployment = pod.getBelongToDeployment(
      deploymentsData?.data || [],
      replicaSetsData?.data || []
    );

    return (
      <ResourceLink
        name={deployment?.name || ''}
        resourceName="deployments"
        namespace={namespace}
      />
    );
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
