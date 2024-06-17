import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { Node } from 'kubernetes-types/core/v1';
import { WorkloadBaseModel } from './workload-base-model';

type RequiredNode = Required<Node> & Unstructured;

export enum NodeRole {
  ControlPlane = 'Control Plane',
  Worker = 'Worker',
}

export class NodeModel extends WorkloadBaseModel {
  constructor(
    public _rawYaml: RequiredNode,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get role() {
    return 'node-role.kubernetes.io/control-plane' in (this.metadata.labels || {})
      ? NodeRole.ControlPlane
      : NodeRole.Worker;
  }

  get ip() {
    return this._rawYaml.status.addresses?.find(add => add.type === 'InternalIP')
      ?.address;
  }

  get nodeGroupName() {
    return this.metadata.labels?.['cape.infrastructure.cluster.x-k8s.io/node-group'];
  }

  get isControlPlane() {
    if (!this?.metadata?.labels) return false;

    return 'node-role.kubernetes.io/control-plane' in this.metadata.labels;
  }
}
