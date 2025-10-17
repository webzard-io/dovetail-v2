import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { ReplicaSet } from 'kubernetes-types/apps/v1';
import { PodList } from 'kubernetes-types/core/v1';
import { sumBy } from 'lodash';
import { matchSelector } from '../utils/match-selector';
import { PodModel } from './pod-model';
import { ResourceModel } from './resource-model';

type RequiredReplicaSet = Required<ReplicaSet> & Unstructured;

export class ReplicaSetModel extends ResourceModel<RequiredReplicaSet> {
  public pods: PodModel[] = [];
  public restarts = 0;
  public declare spec?: RequiredReplicaSet['spec'];
  public declare status?: RequiredReplicaSet['status'];

  constructor(
    public _rawYaml: RequiredReplicaSet,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  async init() {
    await this.getPods();
  }

  private async getPods() {
    const pods = (await this._globalStore.get('pods', {
      resourceBasePath: '/api/v1',
      kind: 'Pod',
    })) as PodList;
    
    // 通过selector匹配pods
    const myPods = pods.items.filter(pod =>
      matchSelector(pod as PodModel, this.spec?.selector, this.metadata.namespace)
    ) as PodModel[];

    this.pods = myPods;
    
    // 计算重启次数
    this.restarts = sumBy(this.pods, pod => pod.restarts || 0);
  }

  get ownerDeploymentName() {
    // 获取所属的Deployment名称
    const ownerRef = this.metadata.ownerReferences?.find(
      ref => ref.kind === 'Deployment' && ref.apiVersion === 'apps/v1'
    );
    return ownerRef?.name;
  }

  get revision() {
    return this.metadata?.annotations?.['deployment.kubernetes.io/revision'];
  }
}
