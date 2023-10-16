import type { DaemonSet, Deployment, StatefulSet } from 'kubernetes-types/apps/v1';
import type { CronJob, Job } from 'kubernetes-types/batch/v1';
import { Pod } from 'kubernetes-types/core/v1';
import { set, get, cloneDeep } from 'lodash-es';
import { TIMESTAMP_LABEL } from '../constants/k8s';
import { WithId } from '../types';
import { shortenedImage } from '../utils/string';
import { ResourceModel } from './resource-model';

type WorkloadTypes = Deployment | StatefulSet | Job | DaemonSet | CronJob | Pod;
export class WorkloadModel<
  T extends WorkloadTypes = WorkloadTypes,
> extends ResourceModel {
  constructor(public data: WithId<T>) {
    super(data);
  }

  get status(): T['status'] {
    return this.data.status;
  }
  get spec(): T['spec'] {
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

  redeploy() {
    const newOne = cloneDeep(this.data);
    const path = 'spec.template.metadata.annotations';
    const annotations = get(newOne, path, {});
    set(newOne, path, {
      ...annotations,
      [TIMESTAMP_LABEL]: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
    });
    return newOne;
  }
}
