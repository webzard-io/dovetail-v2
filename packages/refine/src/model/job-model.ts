import { Job } from 'kubernetes-types/batch/v1';
import { WithId } from '../types';
import { elapsedTime, getSecondsDiff } from '../utils/time';
import { WorkloadModel } from './workload-model';

export class JobModel extends WorkloadModel {
  constructor(public data: WithId<Job>) {
    super(data);
  }

  get duration() {
    const completionTime = this.data.status?.completionTime;
    const startTime = this.data.status?.startTime;

    if (!startTime || !completionTime) {
      return 0;
    }

    return getSecondsDiff(startTime, completionTime);
  }

  get durationDisplay() {
    return elapsedTime(this.duration).label;
  }
  get completionsDisplay() {
    return `${this.data.status?.succeeded || 0}/${this.data.spec?.completions}`;
  }
}
