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

    return (
      <div key={r.fullPath}>
        <kit.Link disabled={!r.host} href={r.fullPath}>
          {r.fullPath}
        </kit.Link>
        <span>{divider}</span>
        <ResourceLink
          name="services"
          namespace={ingress.metadata.namespace || 'default'}
          resourceId={r.serviceName}
        />
      </div>
    );
  });

  return <>{result}</>;
};
