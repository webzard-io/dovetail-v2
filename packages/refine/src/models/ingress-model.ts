import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { Ingress } from 'kubernetes-types/networking/v1';
import { ResourceModel } from './resource-model';

type IngressTypes = Required<Ingress> & Unstructured;

type RuleItem = {
  serviceName: string;
  fullPath: string;
  pathType: string;
  host?: string;
  servicePort?: number;
};

export class IngressModel extends ResourceModel<IngressTypes> {
  flattenedRules: RuleItem[];
  constructor(
    public _rawYaml: IngressTypes,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);

    this.flattenedRules =
      this._rawYaml.spec.rules?.reduce<RuleItem[]>((res, rule) => {
        const paths = rule.http?.paths.map(p => {
          return {
            serviceName: p.backend.service?.name || '',
            fullPath: rule.host ? `${rule.host}${p.path}` : p.path || '',
            pathType: p.pathType,
            servicePort: p.backend.service?.port?.number,
            host: rule.host,
          };
        });
        return [...res, ...(paths || [])];
      }, []) || [];
  }
}
