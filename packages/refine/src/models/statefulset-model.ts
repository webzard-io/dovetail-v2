import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { StatefulSet } from 'kubernetes-types/apps/v1';
import { WorkloadState } from '../constants';
import { WorkloadModel } from './workload-model';

type RequiredStatefulSet = Required<StatefulSet> & Unstructured;

export class StatefulSetModel extends WorkloadModel {
  public declare spec?: RequiredStatefulSet['spec'];
  public declare status?: RequiredStatefulSet['status'];

  constructor(
    public _rawYaml: RequiredStatefulSet,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get stateDisplay() {
    if (this.spec?.replicas === 0) {
      return WorkloadState.STOPPED;
    } else if (this.spec?.replicas !== this.status?.readyReplicas) {
      return WorkloadState.UPDATING;
    }
    return WorkloadState.READY;
  }
}
