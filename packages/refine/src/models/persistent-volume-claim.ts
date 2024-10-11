import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { PersistentVolumeClaim } from 'kubernetes-types/core/v1';
import { cloneDeep, set } from 'lodash-es';
import { ResourceModel } from './resource-model';

type RequiredPersistentClaimVolume = Required<PersistentVolumeClaim> & Unstructured;

export class PersistentVolumeClaimModel extends ResourceModel {
  public declare spec: Required<PersistentVolumeClaim>['spec'];

  constructor(
    public _rawYaml: RequiredPersistentClaimVolume,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get phase() {
    return this._rawYaml.status.phase;
  }

  get pv() {
    return this._rawYaml.spec.volumeName;
  }

  public updateDistributeStorage(distributeStorage: number) {
    const yaml = cloneDeep(this._globalStore.restoreItem(this));

    return set(yaml, 'spec.resources.requests.storage', `${distributeStorage}Gi`);
  }
}
