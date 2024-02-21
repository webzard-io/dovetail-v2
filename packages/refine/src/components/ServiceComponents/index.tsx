import React from 'react';
import { useTranslation } from 'react-i18next';
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

export const ServiceOutClusterAccessComponent: React.FC<Props> = ({ service }) => {
  const i18n = useTranslation();
  const spec = service._rawYaml.spec;
  switch (spec.type) {
    case ServiceTypeEnum.NodePort:
      const content = spec.ports
        ?.filter(v => !!v)
        .map(p => (
          <li key={p.nodePort}>
            {i18n.t('dovetail.any_node_ip')}: {p.nodePort}
          </li>
        ));
      return <ul>{content}</ul>;
    case ServiceTypeEnum.LoadBalancer:
      const children = spec.externalIPs?.map(ip => <li key={ip}>{ip}</li>);
      return <ul>{children}</ul>;
    default:
      return <div>-</div>;
  }
};
