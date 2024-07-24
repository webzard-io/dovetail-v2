import {
  GlobalStore,
  Unstructured,
  UnstructuredList,
  IProviderPlugin,
  DataList,
} from 'k8s-api-provider';
import {
  CronJobModel,
  DaemonSetModel,
  DeploymentModel,
  EventModel,
  IngressModel,
  JobModel,
  PodModel,
  ResourceModel,
  StatefulSetModel,
  NetworkPolicyModel,
  ServiceModel,
  NodeModel,
  StorageClassModel,
  PersistentVolumeModel,
  PersistentVolumeClaimModel,
} from '../models';

export class ModelPlugin implements IProviderPlugin<ResourceModel> {
  _globalStore?: GlobalStore;

  private ModelMap = new Map(
    Object.entries({
      Deployment: DeploymentModel,
      DaemonSet: DaemonSetModel,
      StatefulSet: StatefulSetModel,
      CronJob: CronJobModel,
      Job: JobModel,
      Pod: PodModel,
      Event: EventModel,
      Ingress: IngressModel,
      NetworkPolicy: NetworkPolicyModel,
      Service: ServiceModel,
      Node: NodeModel,
      StorageClass: StorageClassModel,
      PersistentVolume: PersistentVolumeModel,
      PersistentVolumeClaim: PersistentVolumeClaimModel,
    })
  );

  init(globalStore: GlobalStore) {
    this._globalStore = globalStore;
  }

  async processData(res: UnstructuredList) {
    const { kind, apiVersion } = res;
    const items = await Promise.all(
      res.items.map(item => {
        const newItem = { ...item };
        newItem.kind = kind.replace(/List$/g, '');
        newItem.apiVersion = apiVersion;
        return this.processItem(newItem);
      })
    );
    return {
      ...res,
      items,
    } as DataList<ResourceModel>;
  }

  async processItem(item: Unstructured): Promise<ResourceModel> {
    const Model = this.ModelMap.get(item.kind!) || ResourceModel;
    const result = new Model(item as never, this._globalStore!);
    await result.init();
    return result as ResourceModel;
  }

  restoreData(res: DataList<ResourceModel>): UnstructuredList {
    const newRes: UnstructuredList = { ...res };
    newRes.items = res.items.map(item => this.restoreItem(item));
    return res;
  }

  restoreItem(item: ResourceModel): Unstructured {
    return item._rawYaml;
  }

  setModelMap(key: string, model: ResourceModel) {
    this.ModelMap.set(key, model as any);
  }
}

export const modelPlugin = new ModelPlugin();
