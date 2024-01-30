import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { CronJob } from 'kubernetes-types/batch/v1';
import { set, cloneDeep } from 'lodash';
import { WorkloadState } from '../constants';
import { WorkloadBaseModel } from './workload-base-model';

type RequiredCronJob = Required<CronJob> & Unstructured;

export class CronJobModel extends WorkloadBaseModel {
  public declare spec?: RequiredCronJob['spec'];
  public declare status?: RequiredCronJob['status'];

  constructor(
    public _rawYaml: RequiredCronJob,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get stateDisplay() {
    if (!this.spec?.suspend) {
      return WorkloadState.SUSPENDED;
    }
    return WorkloadState.RUNNING;
  }

  suspend() {
    const newOne = cloneDeep(this._rawYaml);
    if (this._rawYaml.kind === 'CronJob') {
      set(newOne, 'spec.suspend', true);
    }
    return newOne;
  }

  resume() {
    const newOne = cloneDeep(this._rawYaml);
    if (this._rawYaml.kind === 'CronJob') {
      set(newOne, 'spec.suspend', false);
    }
    return newOne;
  }
}
