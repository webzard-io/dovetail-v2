import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { DaemonSet } from 'kubernetes-types/apps/v1';
import { WorkloadState } from '../constants';
import { WorkloadModel } from './workload-model';

type RequiredDaemonSet = Required<DaemonSet> & Unstructured;

export class DaemonSetModel extends WorkloadModel {
  public declare spec?: RequiredDaemonSet['spec'];
  public declare status?: RequiredDaemonSet['status'];

  constructor(
    public _rawYaml: RequiredDaemonSet,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get stateDisplay() {
    if (this.status?.desiredNumberScheduled !== this.status?.numberReady) {
      return WorkloadState.UPDATEING;
    }
    return WorkloadState.READY;
  }
}
