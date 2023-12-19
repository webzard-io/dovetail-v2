 import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Job } from 'kubernetes-types/batch/v1';
import { elapsedTime, getSecondsDiff } from '../utils/time';
import { WorkloadBaseModel } from './workload-base-model';

type RequiredJob = Required<Job> & Unstructured;

export class JobModel extends WorkloadBaseModel {
  declare public spec?: RequiredJob['spec'];
  declare public status?: RequiredJob['status'];

  constructor(public _rawYaml: RequiredJob, public _globalStore: GlobalStore) {
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
    return `${this._rawYaml.status?.succeeded || 0}/${
      this._rawYaml.spec?.completions
    }`;
  }
}
