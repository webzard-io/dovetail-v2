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
} from '../models';

const ModelMap = {
  Deployment: DeploymentModel,
  DaemonSet: DaemonSetModel,
  StatefulSet: StatefulSetModel,
  CronJob: CronJobModel,
  Job: JobModel,
  Pod: PodModel,
  Event: EventModel,
  Ingress: IngressModel,
};

class ModelPlugin implements IProviderPlugin<ResourceModel> {
  _globalStore?: GlobalStore;

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
    const Model = ModelMap[item.kind as keyof typeof ModelMap] || ResourceModel;
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
}

export const modelPlugin = new ModelPlugin();
