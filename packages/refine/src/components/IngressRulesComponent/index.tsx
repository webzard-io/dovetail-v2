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
    }
  });
  const flattenedRules = serviceData?.data ? ingress.getFlattenedRules(serviceData?.data) : [];

  const result = flattenedRules.map(r => {
    const divider = ' > ';

    return (
      <OverflowTooltip
        key={r.fullPath}
        content={
          <>
            <LinkFallback fullPath={r.fullPath} />
            <span>{divider}</span>
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
          </>
        }
        tooltip={`${r.fullPath}${divider}:${r.servicePort}`}
      />
    );
  });

  return <>{result}</>;
};
