import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { NetworkPolicy } from 'kubernetes-types/networking/v1';
import { ResourceModel } from './resource-model';

type NetworkPolicyTypes = Required<NetworkPolicy> & Unstructured;

export class NetworkPolicyModel extends ResourceModel<NetworkPolicyTypes> {
  constructor(
    public _rawYaml: NetworkPolicyTypes,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }
}
