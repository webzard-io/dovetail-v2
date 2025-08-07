import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { DaemonSet, Deployment, StatefulSet } from 'kubernetes-types/apps/v1';
import { PodList } from 'kubernetes-types/core/v1';
import { cloneDeep, get, set, sumBy } from 'lodash';
import { REDEPLOY_TIMESTAMP_KEY } from '../constants';
import { matchSelector } from '../utils/match-selector';
import { IngressModel } from './ingress-model';
import { PodModel } from './pod-model';
import { ServiceModel } from './service-model';
import { WorkloadBaseModel } from './workload-base-model';

type WorkloadTypes = Required<Deployment | StatefulSet | DaemonSet> & Unstructured;

export class WorkloadModel extends WorkloadBaseModel {
  public restarts = 0;
  public declare spec?: WorkloadTypes['spec'];
  public declare status?: WorkloadTypes['status'];
  public services: ServiceModel[] = [];
  public ingresses: IngressModel[] = [];

  constructor(
    public _rawYaml: WorkloadTypes,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  override async init() {
    await this.getRestarts();
    await this.getServices();
    await this.getIngresses();
  }

  private async getRestarts() {
    const pods = (await this._globalStore.get('pods', {
      resourceBasePath: '/api/v1',
      kind: 'Pod',
    })) as PodList;
    const myPods = pods.items.filter(p =>
      matchSelector(p as PodModel, this.spec?.selector, this.metadata.namespace)
    );
    const result = sumBy(myPods, 'restarts');
    this.restarts = result;
  }

  private async getServices() {
    const services = await this._globalStore.get('services', {
      resourceBasePath: '/api/v1',
      kind: 'Service',
    });
    const myServices = services.items.filter(p =>
      matchSelector(p as ServiceModel, this.spec?.selector, this.metadata.namespace)
    ) as ServiceModel[];
    
    this.services = myServices;
  }

  private async getIngresses() {
    // 通过关联的services获取所有ingresses，避免重复
    const allIngresses = new Map<string, IngressModel>();
    
    for (const service of this.services) {
      for (const ingress of service.ingresses) {
        const key = `${ingress.namespace}-${ingress.name}`;
        allIngresses.set(key, ingress);
      }
    }
    
    this.ingresses = Array.from(allIngresses.values());
  }

  get replicas() {
    return this.spec && 'replicas' in this.spec ? this.spec.replicas : 0;
  }

  get readyReplicas() {
    return this.status && 'readyReplicas' in this.status ? this.status.readyReplicas : 0;
  }

  get appKey() {
    return `${this.kind}-${this.name}-${this.namespace}`;
  }

  redeploy(): WorkloadTypes {
    const rawYaml = this._globalStore.restoreItem(this);
    const newOne = cloneDeep(rawYaml);
    const path = 'spec.template.metadata.annotations';
    const annotations = get(newOne, path, {});
    set(newOne, path, {
      ...annotations,
      [REDEPLOY_TIMESTAMP_KEY]: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
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
