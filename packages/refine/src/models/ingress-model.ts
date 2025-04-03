import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Service } from 'kubernetes-types/core/v1';
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
  constructor(
    public _rawYaml: IngressTypes,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  private getFullPath(rule: IngressRule, path = '', port?: number) {
    if (!rule.host) {
      return path || '';
    }

    const hostValue = rule.host || '';
    const protocal = this._rawYaml.spec.tls ? 'https://' : 'http://';
    const portText = port ? `:${port}` : '';
    return `${protocal}${hostValue}${portText}${path}`;
  }

  public getFlattenedRules(services: Service[]) {
    const protocal = !!this._rawYaml.spec.tls ? 'https' : 'http';
    const servicePort = services
      .find(s => s.metadata?.name === 'contour-envoy' && s.spec?.type === 'NodePort')
      ?.spec?.ports?.find(p => p.name === protocal);

    return this._rawYaml.spec.rules?.reduce<RuleItem[]>((res, rule) => {
      const paths = rule.http?.paths.map(p => {
        return {
          resourceName: p.backend.resource?.name || '',
          serviceName: p.backend.service?.name || '',
          fullPath: this.getFullPath(rule, p.path, servicePort?.nodePort),
          pathType: p.pathType,
          servicePort: p.backend.service?.port?.number || p.backend.service?.port?.name,
          host: rule.host,
        };
      });
      return [...res, ...(paths || [])];
    }, []) || [];
  }
}
