import { Job } from 'kubernetes-types/batch/v1';
import { WithId } from '../types';
import { WorkloadModel } from './workload-model';

export class JobModel extends WorkloadModel {
  constructor(public data: WithId<Job>) {
    super(data);
  }

  get duration() {
    //TODO: Full version. https://github.com/rancher/dashboard/blob/4892bb7c95d8a5eba5feed056261deb473e3cc08/shell/models/batch.job.js#L5
    return this.data.status?.startTime;
  }
}
