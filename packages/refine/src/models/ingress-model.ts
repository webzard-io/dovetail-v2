import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { Ingress, IngressRule } from 'kubernetes-types/networking/v1';
import { ResourceModel } from './resource-model';

type IngressTypes = Required<Ingress> & Unstructured;

export type RuleItem = {
  serviceName?: string;
  resourceName?: string;
  fullPath: string;
  pathType: string;
  host?: string;
  servicePort?: number | string;
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
            resourceName: p.backend.resource?.name || '',
            serviceName: p.backend.service?.name || '',
            fullPath: this.getFullPath(rule, p.path),
            pathType: p.pathType,
            servicePort: p.backend.service?.port?.number || p.backend.service?.port?.name,
            host: rule.host,
          };
        });
        return [...res, ...(paths || [])];
      }, []) || [];
  }

  private getFullPath(rule: IngressRule, path = '') {
    if (!rule.host) {
      return path || '';
    }
    const hostValue = rule.host || '';
    const protocal = this._rawYaml.spec.tls ? 'https://' : 'http://';
    return `${protocal}${hostValue}${path}`;
  }
}
