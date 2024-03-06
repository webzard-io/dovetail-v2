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
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get displayType() {
    const type = this._rawYaml.spec.type;
    if (type === ServiceTypeEnum.ClusterIP && !this._rawYaml.spec.clusterIP) {
      return ServiceTypeEnum.Headless;
    }
    return type;
  }

  get dnsRecord() {
    return `${this._rawYaml.metadata.name}.${this._rawYaml.metadata.namespace}`;
  }

  get displayPortMapping() {
    return this._rawYaml.spec.ports?.map(p => {
      let servicePort = `${p.port}`;
      if (this._rawYaml.spec.clusterIP) {
        servicePort = `${this._rawYaml.spec.clusterIP}:${p.port}`;
      }
      return `${servicePort} > ${p.targetPort}/${p.protocol}`;
    });
  }
}
