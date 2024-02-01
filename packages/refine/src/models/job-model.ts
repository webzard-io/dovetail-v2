import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Job } from 'kubernetes-types/batch/v1';
import { WorkloadState } from '../constants';
import { elapsedTime, getSecondsDiff } from '../utils/time';
import { WorkloadBaseModel } from './workload-base-model';

type RequiredJob = Required<Job> & Unstructured;

export class JobModel extends WorkloadBaseModel {
  public declare spec?: RequiredJob['spec'];
  public declare status?: RequiredJob['status'];

  constructor(
    public _rawYaml: RequiredJob,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get duration() {
    const completionTime = this._rawYaml.status?.completionTime;
    const startTime = this._rawYaml.status?.startTime;

    if (!completionTime && startTime) {
      return getSecondsDiff(startTime, Date.now().toString());
    }

    if (completionTime && startTime) {
      return getSecondsDiff(startTime, completionTime);
    }

    return 0;
  }

  get durationDisplay() {
    return elapsedTime(this.duration).label;
  }

  get completionsDisplay() {
    return `${this._rawYaml.status?.succeeded || 0}/${this._rawYaml.spec?.completions}`;
  }

  get stateDisplay() {
    if (!this.spec?.completions && !this.status?.succeeded) {
      return WorkloadState.RUNNING;
    }
    if (this.spec?.completions === this.status?.succeeded) {
      return WorkloadState.COMPLETED;
    }
    if (this.status?.conditions?.some(c => c.type === 'Failed' && c.status === 'True')) {
      return WorkloadState.FAILED;
    }
    if (
      this.status?.conditions?.some(c => c.type === 'Suspended' && c.status === 'True')
    ) {
      return WorkloadState.SUSPENDED;
    }
    return WorkloadState.RUNNING;
  }
}
