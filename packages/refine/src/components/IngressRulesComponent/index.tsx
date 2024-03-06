import { useUIKit } from '@cloudtower/eagle';
import React from 'react';
import { IngressModel } from '../../models';
import { ResourceLink } from '../ResourceLink';

export const IngressRulesComponent: React.FC<{
  ingress: IngressModel;
}> = ({ ingress }) => {
  const kit = useUIKit();

  const result = ingress.flattenedRules.map(r => {
    const divider = ' > ';

    let pre = <span>{r.fullPath}</span>;
    if (r.fullPath.includes('http') && !r.fullPath.includes('*')) {
      pre = <kit.Link href={r.fullPath}>{r.fullPath}</kit.Link>;
    }

    return (
      <div key={r.fullPath}>
        {pre}
        <span>{divider}</span>
        {
          r.serviceName ? (
            <>
              <ResourceLink
                name="services"
                namespace={ingress.metadata.namespace || 'default'}
                resourceId={r.serviceName}
              />
              <span>:{r.servicePort}</span>
            </>
          ) : r.resourceName
        }
      </div>
    );
  });

  return <>{result}</>;
};
