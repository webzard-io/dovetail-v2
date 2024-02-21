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

    const pre = r.fullPath.includes('http') ? (
      <kit.Link href={r.fullPath}>{r.fullPath}</kit.Link>
    ) : (
      <span>{r.fullPath}</span>
    );

    return (
      <div key={r.fullPath}>
        {pre}
        <span>{divider}</span>
        <ResourceLink
          name="services"
          namespace={ingress.metadata.namespace || 'default'}
          resourceId={r.serviceName}
        />
        <span>:{r.servicePort}</span>
      </div>
    );
  });

  return <>{result}</>;
};
