import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import React from 'react';
import { IngressModel } from '../../models';
import { ResourceLink } from '../ResourceLink';

const LinkStyle = css`
  padding: 0 !important;
`;

export const IngressRulesComponent: React.FC<{
  ingress: IngressModel;
}> = ({ ingress }) => {
  const kit = useUIKit();

  const result = ingress.flattenedRules.map(r => {
    const divider = ' > ';

    let pre = <span>{r.fullPath}</span>;
    if (r.fullPath.includes('http') && !r.fullPath.includes('*')) {
      pre = (
        <kit.Link className={LinkStyle} href={r.fullPath} target="_blank">
          {r.fullPath}
        </kit.Link>
      );
    }

    return (
      <kit.overflowTooltip
        key={r.fullPath}
        content={
          <>
            {pre}
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
