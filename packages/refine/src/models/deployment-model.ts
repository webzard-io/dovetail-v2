import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { Deployment } from 'kubernetes-types/apps/v1';
import { ResourceState } from '../constants';
import { ReplicaSetModel } from './replicaset-model';
import { WorkloadModel } from './workload-model';

type RequiredDeployment = Required<Deployment> & Unstructured;

export class DeploymentModel extends WorkloadModel {
  public declare spec?: RequiredDeployment['spec'];
  public declare status?: RequiredDeployment['status'];

  constructor(public _rawYaml: RequiredDeployment, _globalStore: GlobalStore) {
    super(_rawYaml, _globalStore);
  }

  override async init() {
    await super.init();
  }

  getReplicaSets(replicaSets: ReplicaSetModel[]) {
    // 通过ownerReference匹配ReplicaSets
    return replicaSets.filter(rs => {
      const ownerRef = rs.metadata?.ownerReferences?.find(
        ref =>
          ref.kind === 'Deployment' &&
          ref.apiVersion === 'apps/v1' &&
          ref.name === this.name &&
          ref.uid === this.metadata.uid
      );
      return !!ownerRef && rs.metadata?.namespace === this.metadata.namespace;
    }) as ReplicaSetModel[];
  }

  get stateDisplay() {
    if (this.spec?.replicas === 0) {
      return ResourceState.STOPPED;
    } else if (this.spec?.replicas !== this.status?.readyReplicas) {
      return ResourceState.UPDATING;
    }
    return ResourceState.READY;
  }

  get revision() {
    return this.metadata?.annotations?.['deployment.kubernetes.io/revision'];
  }

  get isPaused() {
    return !!this.spec?.paused;
  }

  getCurrentReplicaSet(replicaSets: ReplicaSetModel[]) {
    const myReplicaSets = this.getReplicaSets(replicaSets);

    return myReplicaSets.find(rs => rs.revision === this.revision);
  }
}
