import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { DaemonSet, Deployment, StatefulSet } from 'kubernetes-types/apps/v1';
import type { CronJob, Job } from 'kubernetes-types/batch/v1';
import { Pod, Node } from 'kubernetes-types/core/v1';
import { shortenedImage } from '../utils/string';
import { ResourceModel } from './resource-model';

type WorkloadBaseTypes = Required<
  Deployment | StatefulSet | Job | DaemonSet | CronJob | Pod | Node
> &
  Unstructured;

export class WorkloadBaseModel extends ResourceModel<WorkloadBaseTypes> {
  constructor(
    public _rawYaml: WorkloadBaseTypes,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get imageNames() {
    const containers =
      // cronjob
      this._rawYaml.spec && 'jobTemplate' in this._rawYaml.spec
        ? this._rawYaml.spec.jobTemplate.spec?.template.spec?.containers
        : // other wokload
        this._rawYaml.spec && 'template' in this._rawYaml.spec
          ? this._rawYaml.spec?.template.spec?.containers
          : [];

    return containers?.map(container => shortenedImage(container.image || '')) || [];
  }
}
