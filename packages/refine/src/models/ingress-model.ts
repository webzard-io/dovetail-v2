import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { Ingress } from 'kubernetes-types/networking/v1';
import { ResourceModel } from './resource-model';

type IngressTypes = Required<Ingress> & Unstructured;

export class IngressModel extends ResourceModel<IngressTypes> {
  constructor(
    public _rawYaml: IngressTypes,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }
}
