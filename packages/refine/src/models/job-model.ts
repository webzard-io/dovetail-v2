import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Job } from 'kubernetes-types/batch/v1';
import { PodList } from 'kubernetes-types/core/v1';
import { sumBy } from 'lodash';
import { WorkloadState } from '../constants';
import { matchSelector } from '../utils/match-selector';
import { getSecondsDiff } from '../utils/time';
import { PodModel } from './pod-model';
import { WorkloadBaseModel } from './workload-base-model';

type RequiredJob = Required<Job> & Unstructured;

export class JobModel extends WorkloadBaseModel {
  public restarts = 0;
  public declare spec?: RequiredJob['spec'];
  public declare status?: RequiredJob['status'];

  constructor(
    public _rawYaml: RequiredJob,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  override async init() {
    await this.getRestarts();
  }

  private async getRestarts() {
    const pods = (await this._globalStore.get('pods', {
      resourceBasePath: '/api/v1',
      kind: 'Pod',
    })) as PodList;
    const myPods = pods.items.filter(p =>
      matchSelector(p as PodModel, this.spec?.selector, this.metadata.namespace)
    );
    const result = sumBy(myPods, 'restartCount');
    this.restarts = result;
  }

  get duration() {
    const completionTime = this._rawYaml.status?.completionTime;
    const startTime = this._rawYaml.status?.startTime;

    if (!completionTime && startTime) {
      return getSecondsDiff(startTime, (new Date()).toString());
    }

    if (completionTime && startTime) {
      return getSecondsDiff(startTime, completionTime);
    }

    return 0;
  }

  get completionsDisplay() {
    if (this._rawYaml.spec.parallelism && !this._rawYaml.spec.completions) {
      return `0/1 of ${this._rawYaml.spec.parallelism}`;
    }
    return `${this._rawYaml.status?.succeeded || 0}/${this._rawYaml.spec?.completions}`;
  }

  get succeeded() {
    return this._rawYaml.status?.succeeded || 0;
  }

  get completions() {
    return this._rawYaml.spec?.completions;
  }

  get stateDisplay() {
    if (!this.spec?.completions && !this.status?.succeeded) {
      return WorkloadState.RUNNING;
    }
    if (
      this.spec?.completions === this.status?.succeeded ||
      this.status?.conditions?.some(c => c.type === 'Complete' && c.status === 'True')
    ) {
      return WorkloadState.COMPLETED;
    }
    if (this.status?.conditions?.some(c => c.type === 'Failed' && c.status === 'True')) {
      return WorkloadState.FAILED;
    }
    if (
      this.status?.conditions?.some(c => c.type === 'Suspended' && c.status === 'True')
    ) {
      return WorkloadState.SUSPENDED;
    }
    return WorkloadState.RUNNING;
  }
}
