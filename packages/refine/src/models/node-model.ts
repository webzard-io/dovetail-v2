import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { Node } from 'kubernetes-types/core/v1';
import { WorkloadBaseModel } from './workload-base-model';

type RequiredNode = Required<Node> & Unstructured;

export enum NodeRole {
  ControlPlane = 'Control Plane',
  Worker = 'Worker'
}

export class NodeModel extends WorkloadBaseModel {
  constructor(
    public _rawYaml: RequiredNode,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get role() {
    return 'node-role.kubernetes.io/control-plane' in (this.metadata.labels || {}) ? NodeRole.ControlPlane : NodeRole.Worker;
  }
}
