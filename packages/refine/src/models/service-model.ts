import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Service } from 'kubernetes-types/core/v1';
import { ResourceModel } from './resource-model';

export type ServiceType = Required<Unstructured & Service>;

export class ServiceModel extends ResourceModel<ServiceType> {
  constructor(
    public _rawYaml: ServiceType,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  inClusterAccess() {
    if (
      this._rawYaml.spec.type &&
      ['ClusterIP', 'NodePort', 'LoadBalancer'].includes(this._rawYaml.spec.type)
    ) {
      return this._rawYaml.spec.clusterIP;
    }
    return this._rawYaml.spec.externalName;
  }

  // outClusterAccess() {
  //   switch (this._rawYaml.spec.type) {
  //     case 'NodePort':
  //       return this._rawYaml.spec.port;
  //     case 'LoadBalancer':
  //       return this._rawYaml.spec.externalIPs;
  //     default:
  //       return undefined;
  //   }
  // }
}
