import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { DaemonSet, Deployment, StatefulSet } from 'kubernetes-types/apps/v1';
import type { CronJob, Job } from 'kubernetes-types/batch/v1';
import { Pod, PodList, Node } from 'kubernetes-types/core/v1';
import { sumBy } from 'lodash';
import { matchSelector } from '../utils/match-selector';
import { shortenedImage } from '../utils/string';
import { PodModel } from './pod-model';
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

  protected async fetchRestarts(
    selector: Record<string, string> | { matchLabels?: Record<string, string> } | undefined,
    namespace?: string
  ): Promise<number> {
    const pods = (await this._globalStore.get('pods', {
      resourceBasePath: '/api/v1',
      kind: 'Pod',
    })) as PodList;
    const myPods = pods.items.filter(p =>
      matchSelector(p as PodModel, selector, namespace)
    );
    return sumBy(myPods, 'restarts');
  }
}
