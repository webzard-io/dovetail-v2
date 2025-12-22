import { OverflowTooltip } from '@cloudtower/eagle';
import { useList } from '@refinedev/core';
import { Service } from 'kubernetes-types/core/v1';
import React from 'react';
import { LinkFallback } from 'src/components/LinkFallback';
import { IngressModel } from '../../models';
import { ResourceLink } from '../ResourceLink';

export const IngressRulesComponent: React.FC<{
  ingress: IngressModel;
}> = ({ ingress }) => {
  const { data: serviceData } = useList<Service>({
    resource: 'services',
    meta: {
      kind: 'Service',
      apiVersion: 'v1',
    },
  });

  const flattenedRules = serviceData?.data
    ? ingress.getFlattenedRules(serviceData?.data)
    : [];

  const result = flattenedRules.map(r => {
    const arrow = ' → ';
    const divider = ' | ';

    const secretName = ingress.spec.tls?.find(({ hosts }) =>
      hosts?.includes(r.host || '')
    )?.secretName;

    let tooltip = r.fullPath;
    if (r.serviceName) {
      tooltip += `${arrow}${r.serviceName}:${r.servicePort}`;
    }
    if (secretName) {
      tooltip += `${divider}${secretName}`;
    }

    return (
      <OverflowTooltip
        key={r.fullPath}
        content={
          <>
            <LinkFallback fullPath={r.fullPath} />
            <span>{arrow}</span>
            {r.serviceName ? (
              <>
                <ResourceLink
                  resourceName="services"
                  namespace={ingress.metadata.namespace || 'default'}
                  name={r.serviceName}
                />
                <span>:{r.servicePort}</span>
              </>
            ) : (
              r.resourceName
            )}
            {secretName ? (
              <>
                <span>{divider}</span>
                <ResourceLink
                  resourceName="secrets"
                  namespace={ingress.metadata.namespace || 'default'}
                  name={secretName}
                />
              </>
            ) : undefined}
          </>
        }
        tooltip={tooltip}
      />
    );
  });

  return <>{result}</>;
};
