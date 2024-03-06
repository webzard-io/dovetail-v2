import { Link } from '@cloudtower/eagle';
import React from 'react';
import { ServiceModel, ServiceTypeEnum } from '../../models';

type Props = {
  service: ServiceModel;
};

export const ServiceInClusterAccessComponent: React.FC<Props> = ({ service }) => {
  const spec = service._rawYaml.spec;
  switch (spec.type) {
    case ServiceTypeEnum.ExternalName:
      return <div>{spec.externalName}</div>;
    default:
      return <div>{spec.clusterIP || '-'}</div>;
  }
};

export const ServiceOutClusterAccessComponent: React.FC<
  Props & { clusterVip: string; separator?: string; }
> = ({ service, clusterVip, separator = '\n' }) => {
  const spec = service._rawYaml.spec;
  let content: string | React.ReactNode[] | undefined = '-';

  switch (spec.type) {
    case ServiceTypeEnum.NodePort:
      content = spec.ports
        ?.filter(v => !!v)
        .map(p => (
          <li key={p.nodePort}>
            <Link target="_blank" href={`http://${clusterVip}:${p.nodePort}`}>
              {clusterVip}:{p.nodePort}
            </Link>
          </li>
        ));
      return <ul>{content}</ul>;
    case ServiceTypeEnum.LoadBalancer:
      content = spec.externalIPs?.join(separator);
      break;
    default:
      content = '-';
      break;
  }

  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      {content || '-'}
    </div>
  );
};
