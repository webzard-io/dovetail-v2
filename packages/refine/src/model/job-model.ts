import { Job } from 'kubernetes-types/batch/v1';
import { WithId } from '../types';
import { elapsedTime, getSecondsDiff } from '../utils/time';
import { WorkloadModel } from './workload-model';

export class JobModel extends WorkloadModel<Job> {
  constructor(public data: WithId<Job>) {
    super(data);
  }

  get duration() {
    const completionTime = this.data.status?.completionTime;
    const startTime = this.data.status?.startTime;

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
    return `${this.data.status?.succeeded || 0}/${this.data.spec?.completions}`;
  }
}
