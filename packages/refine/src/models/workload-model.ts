import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { DaemonSet, Deployment, StatefulSet } from 'kubernetes-types/apps/v1';
import { PodList } from 'kubernetes-types/core/v1';
import { cloneDeep, get, set, sumBy } from 'lodash';
import { TIMESTAMP_LABEL } from '../constants';
import { matchSelector } from '../utils/match-selector';
import { PodModel } from './pod-model';
import { WorkloadBaseModel } from './workload-base-model';

type WorkloadTypes = Required<Deployment | StatefulSet | DaemonSet> & Unstructured;

export class WorkloadModel extends WorkloadBaseModel {
  public restarts = 0;
  public declare spec?: WorkloadTypes['spec'];
  public declare status?: WorkloadTypes['status'];

  constructor(
    public _rawYaml: WorkloadTypes,
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
      this.spec?.selector ? matchSelector(p as PodModel, this.spec?.selector) : false
    );
    const result = sumBy(myPods, 'restartCount');
    this.restarts = result;
  }

  redeploy(): WorkloadTypes {
    const rawYaml = this._globalStore.restoreItem(this);
    const newOne = cloneDeep(rawYaml);
    const path = 'spec.template.metadata.annotations';
    const annotations = get(newOne, path, {});
    set(newOne, path, {
      ...annotations,
      [TIMESTAMP_LABEL]: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
    });
    return newOne as WorkloadTypes;
  }

  scale(value: number): WorkloadTypes {
    const rawYaml = this._globalStore.restoreItem(this);
    const newOne = cloneDeep(rawYaml);
    if (newOne.kind === 'Deployment' || newOne.kind === 'StatefulSet') {
      set(newOne, 'spec.replicas', value);
    }
    return newOne as WorkloadTypes;
  }
}
