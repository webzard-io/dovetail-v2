import { Job } from 'kubernetes-types/batch/v1';
import { WithId } from '../types';
import { elapsedTime, getSecondsDiff } from '../utils/time';
import { WorkloadModel } from './workload-model';

export class JobModel extends WorkloadModel<Job> {
  constructor(public rawYaml: WithId<Job>) {
    super(rawYaml);
  }

  get duration() {
    const completionTime = this.rawYaml.status?.completionTime;
    const startTime = this.rawYaml.status?.startTime;

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
    return `${this.rawYaml.status?.succeeded || 0}/${this.rawYaml.spec?.completions}`;
  }
}
