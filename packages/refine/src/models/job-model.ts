import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Job } from 'kubernetes-types/batch/v1';
import { ResourceState } from '../constants';
import { getSecondsDiff } from '../utils/time';
import { WorkloadBaseModel } from './workload-base-model';

type RequiredJob = Required<Job> & Unstructured;

export class JobModel extends WorkloadBaseModel {
  public restarts = 0;
  public declare spec?: RequiredJob['spec'];
  public declare status?: RequiredJob['status'];

  constructor(
    public _rawYaml: RequiredJob,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  override async init() {
    await this.getRestarts();
  }

  private async getRestarts() {
    this.restarts = await this.fetchRestarts(
      this.spec?.selector,
      this.metadata.namespace
    );
  }

  get duration() {
    const completionTime = this._rawYaml.status?.completionTime;
    const startTime = this._rawYaml.status?.startTime;

    if (!completionTime && startTime) {
      return getSecondsDiff(startTime, new Date().toString());
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

  get podCountDisplay() {
    const count =
      (this.status?.active || 0) +
      (this.status?.succeeded || 0) +
      (this.status?.failed || 0);

    return `${this.succeeded}/${count}`;
  }

  get succeeded() {
    return this._rawYaml.status?.succeeded || 0;
  }

  get completions() {
    return this._rawYaml.spec?.completions;
  }

  get stateDisplay() {
    if (!this.spec?.completions && !this.status?.succeeded) {
      return ResourceState.RUNNING;
    }
    if (
      this.spec?.completions === this.status?.succeeded ||
      this.status?.conditions?.some(c => c.type === 'Complete' && c.status === 'True')
    ) {
      return ResourceState.COMPLETED;
    }
    if (this.status?.conditions?.some(c => c.type === 'Failed' && c.status === 'True')) {
      return ResourceState.ABNORMAL;
    }
    if (
      this.status?.conditions?.some(c => c.type === 'Suspended' && c.status === 'True')
    ) {
      return ResourceState.SUSPENDED;
    }
    return ResourceState.RUNNING;
  }
}
