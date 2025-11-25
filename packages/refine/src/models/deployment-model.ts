import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { Deployment } from 'kubernetes-types/apps/v1';
import { ReplicaSetList } from 'kubernetes-types/apps/v1';
import { ResourceState } from '../constants';
import { ReplicaSetModel } from './replicaset-model';
import { WorkloadModel } from './workload-model';

type RequiredDeployment = Required<Deployment> & Unstructured;

export class DeploymentModel extends WorkloadModel {
  public declare spec?: RequiredDeployment['spec'];
  public declare status?: RequiredDeployment['status'];
  public replicaSets: ReplicaSetModel[] = [];

  constructor(
    public _rawYaml: RequiredDeployment,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  override async init() {
    await super.init();
    await this.getReplicaSets();
  }

  private async getReplicaSets() {
    const replicaSets = (await this._globalStore.get('replicasets', {
      resourceBasePath: '/apis/apps/v1',
      kind: 'ReplicaSet',
    })) as ReplicaSetList;

    // 通过ownerReference匹配ReplicaSets
    const myReplicaSets = replicaSets.items.filter(rs => {
      const ownerRef = rs.metadata?.ownerReferences?.find(
        ref => ref.kind === 'Deployment' &&
          ref.apiVersion === 'apps/v1' &&
          ref.name === this.name &&
          ref.uid === this.metadata.uid
      );
      return !!ownerRef && rs.metadata?.namespace === this.metadata.namespace;
    }) as ReplicaSetModel[];

    this.replicaSets = myReplicaSets;
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

  get currentReplicaSet() {
    return this.replicaSets.find(rs => rs.revision === this.revision);
  }
}
