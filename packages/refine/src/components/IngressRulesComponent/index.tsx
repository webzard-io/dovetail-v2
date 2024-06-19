import { OverflowTooltip } from '@cloudtower/eagle';
import React from 'react';
import { LinkFallback } from 'src/components/LinkFallback';
import { IngressModel } from '../../models';
import { ResourceLink } from '../ResourceLink';

export const IngressRulesComponent: React.FC<{
  ingress: IngressModel;
}> = ({ ingress }) => {
  const result = ingress.flattenedRules.map(r => {
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
                  name="services"
                  namespace={ingress.metadata.namespace || 'default'}
                  resourceId={r.serviceName}
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
