import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Deployment } from 'kubernetes-types/apps/v1';
import { ResourceState } from '../constants';
import { WorkloadModel } from './workload-model';

type RequiredDeployment = Required<Deployment> & Unstructured;

export class DeploymentModel extends WorkloadModel {
  public declare spec?: RequiredDeployment['spec'];
  public declare status?: RequiredDeployment['status'];

  constructor(
    public _rawYaml: RequiredDeployment,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get stateDisplay() {
    if (this.spec?.replicas === 0) {
      return ResourceState.STOPPED;
    } else if (this.spec?.replicas !== this.status?.readyReplicas) {
      return ResourceState.UPDATING;
    }
    return ResourceState.READY;
  }
}
