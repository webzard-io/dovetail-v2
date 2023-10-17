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
  constructor(public rawYaml: WithId<T>) {
    super(rawYaml);
  }

  get status(): T['status'] {
    return this.rawYaml.status;
  }
  get spec(): T['spec'] {
    return this.rawYaml.spec;
  }

  get imageNames() {
    const containers =
      // cronjob
      this.rawYaml.spec && 'jobTemplate' in this.rawYaml.spec
        ? this.rawYaml.spec.jobTemplate.spec?.template.spec?.containers
        : // other wokload
        this.rawYaml.spec && 'template' in this.rawYaml.spec
        ? this.rawYaml.spec?.template.spec?.containers
        : [];

    return containers?.map(container => shortenedImage(container.image || '')) || [];
  }

  get restartCount() {
    // TODO: need count from pods
    return 0;
  }

  redeploy() {
    const newOne = cloneDeep(this.rawYaml);
    const path = 'spec.template.metadata.annotations';
    const annotations = get(newOne, path, {});
    set(newOne, path, {
      ...annotations,
      [TIMESTAMP_LABEL]: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
    });
    return newOne;
  }

  scale(value: number) {
    const newOne = cloneDeep(this.data);
    if (newOne.kind === 'Deployment' || newOne.kind === 'StatefulSet') {
      set(newOne, 'spec.replicas', value);
    }
    return newOne;
  }
}
