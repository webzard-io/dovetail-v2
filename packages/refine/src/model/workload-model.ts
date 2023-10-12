import type { DaemonSet, Deployment, StatefulSet } from 'kubernetes-types/apps/v1';
import type { CronJob, Job } from 'kubernetes-types/batch/v1';
import { Pod } from 'kubernetes-types/core/v1';
import { WithId } from '../types';
import { shortenedImage } from '../utils/string';
import { ResourceModel } from './resource-model';

export class WorkloadModel extends ResourceModel {
  constructor(
    public data: WithId<Deployment | StatefulSet | Job | DaemonSet | CronJob | Pod>
  ) {
    super(data);
  }

  get status() {
    return this.data.status;
  }
  get spec() {
    return this.data.spec;
  }

  get imageNames() {
    const containers =
      // cronjob
      this.data.spec && 'jobTemplate' in this.data.spec
        ? this.data.spec.jobTemplate.spec?.template.spec?.containers
        : // other wokload
        this.data.spec && 'template' in this.data.spec
        ? this.data.spec?.template.spec?.containers
        : [];

    return containers?.map(container => shortenedImage(container.image || '')) || [];
  }

  get restartCount() {
    // TODO: need count from pods
    return 0;
  }
}
