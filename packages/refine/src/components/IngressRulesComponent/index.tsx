import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { IngressModel } from '../../models';
import { ResourceLink } from '../ResourceLink';

const LinkStyle = css`
  padding: 0 !important;
`;

export function IngressFullPath({ fullPath }: { fullPath: string }) {
  const kit = useUIKit();

  if (fullPath.includes('http') && !fullPath.includes('*')) {
    return (
      <kit.Link className={LinkStyle} href={fullPath} target="_blank">
        {fullPath}
      </kit.Link>
    );
  }

  return <span>{fullPath}</span>;
}

export const IngressRulesComponent: React.FC<{
  ingress: IngressModel;
}> = ({ ingress }) => {
  const kit = useUIKit();

  const result = ingress.flattenedRules.map(r => {
    const divider = ' > ';

    return (
      <kit.overflowTooltip
        key={r.fullPath}
        content={
          <>
            <IngressFullPath fullPath={r.fullPath} />
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
