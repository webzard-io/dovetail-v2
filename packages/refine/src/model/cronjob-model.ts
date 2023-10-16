import { CronJob } from 'kubernetes-types/batch/v1';
import { set, cloneDeep } from 'lodash-es';
import { WithId } from '../types';
import { WorkloadModel } from './workload-model';

export class CronJobModel extends WorkloadModel<CronJob> {
  constructor(public data: WithId<CronJob>) {
    super(data);
  }

  suspend() {
    const newOne = cloneDeep(this.data);
    if (this.data.kind === 'CronJob') {
      set(newOne, 'spec.suspend', true);
    }
    return newOne;
  }

  resume() {
    const newOne = cloneDeep(this.data);
    if (this.data.kind === 'CronJob') {
      set(newOne, 'spec.suspend', false);
    }
    return newOne;
  }
}
