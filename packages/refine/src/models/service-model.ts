import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Service } from 'kubernetes-types/core/v1';
import { ResourceModel } from './resource-model';

export type ServiceType = Required<Unstructured & Service>;

export enum ServiceTypeEnum {
  ClusterIP = 'ClusterIP',
  NodePort = 'NodePort',
  LoadBalancer = 'LoadBalancer',
  ExternalName = 'ExternalName',
  Headless = 'Headless',
}

export class ServiceModel extends ResourceModel<ServiceType> {
  constructor(
    public _rawYaml: ServiceType,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get displayType() {
    const spec = this._rawYaml.spec;
    const type = spec.type;
    if (
      type === ServiceTypeEnum.ClusterIP &&
      (!spec.clusterIP || spec.clusterIP === 'None')
    ) {
      return ServiceTypeEnum.Headless;
    }
    return type;
  }

  get dnsRecord() {
    return `${this._rawYaml.metadata.name}.${this._rawYaml.metadata.namespace}`;
  }

  get displayPortMapping() {
    return this._rawYaml.spec.ports?.map(p => {
      let link = '';
      if (this._rawYaml.spec.clusterIP && this._rawYaml.spec.clusterIP !== 'None') {
        link = `${this._rawYaml.spec.clusterIP}:${p.port}`;
      }
      return {
        servicePort: p.port,
        nodePort: p.nodePort,
        link,
        targetPort: p.targetPort,
        protocol: p.protocol,
      };
    });
  }
}
