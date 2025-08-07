import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Service } from 'kubernetes-types/core/v1';
import { IngressList } from 'kubernetes-types/networking/v1';
import { IngressModel } from './ingress-model';
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
  public ingresses: IngressModel[] = [];

  constructor(
    public _rawYaml: ServiceType,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  async init() {
    await this.getIngresses();
  }

  private async getIngresses() {
    const ingresses = (await this._globalStore.get('ingresses', {
      resourceBasePath: '/apis/networking.k8s.io/v1',
      kind: 'Ingress',
    })) as IngressList;
    
    // 查找引用了当前service的ingresses
    const myIngresses = ingresses.items.filter(ingress => {
      const rules = (ingress as IngressModel).getFlattenedRules([]);
      
      return rules.some(rule => 
        rule.serviceName === this.name
      );
    }) as IngressModel[];
    
    this.ingresses = myIngresses;
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
