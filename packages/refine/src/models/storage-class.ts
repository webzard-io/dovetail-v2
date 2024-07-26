import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { PersistentVolumeList } from 'kubernetes-types/core/v1';
import type { StorageClass } from 'kubernetes-types/storage/v1';
import { PersistentVolumeModel } from './persistent-volume';
import { ResourceModel } from './resource-model';

type RequiredStorageClass = Required<StorageClass> & Unstructured;

export class StorageClassModel extends ResourceModel {
  pvs: PersistentVolumeModel[] = [];

  constructor(
    public _rawYaml: RequiredStorageClass,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  override async init() {
    const pvs = (await this._globalStore.get('persistentvolumes', {
      resourceBasePath: '/api/v1',
      kind: 'PersistentVolume',
    })) as PersistentVolumeList;
    this.pvs = pvs.items.filter(
      pv => pv.spec?.storageClassName === this.metadata.name
    ) as PersistentVolumeModel[];
  }
}
