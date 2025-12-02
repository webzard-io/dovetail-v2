import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { IngressClass } from 'kubernetes-types/networking/v1';
import { ResourceModel } from './resource-model';

type RequiredIngressClass = Required<IngressClass> & Unstructured;

export class IngressClassModel extends ResourceModel<RequiredIngressClass> {
  public declare spec?: RequiredIngressClass['spec'];

  constructor(public _rawYaml: RequiredIngressClass, _globalStore: GlobalStore) {
    super(_rawYaml, _globalStore);
  }

  get isDefault() {
    return (
      this._rawYaml.metadata?.annotations?.[
        'ingressclass.kubernetes.io/is-default-class'
      ] === 'true'
    );
  }

  get controller() {
    return this.spec?.controller;
  }
}
