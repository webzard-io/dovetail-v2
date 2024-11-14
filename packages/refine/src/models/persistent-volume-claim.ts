import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { PersistentVolumeClaim } from 'kubernetes-types/core/v1';
import { cloneDeep, set, get } from 'lodash-es';
import { ResourceState } from 'src/constants';
import { parseSi } from '../utils/unit';
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

  get stateDisplay() {
    switch (this.phase) {
      case 'Pending':
        return ResourceState.PENDING;
      case 'Bound':
        return ResourceState.BOUND;
      case 'Lost':
        return ResourceState.LOST;
      case 'Failed':
        return ResourceState.FAILED;
    }
  }

  get storageBytes() {
    return parseSi(get(this._rawYaml, 'spec.resources.requests.storage') || '0Gi');
  }

  public updateDistributeStorage(distributeStorage: number) {
    const yaml = cloneDeep(this._globalStore.restoreItem(this));

    return set(yaml, 'spec.resources.requests.storage', `${distributeStorage}Gi`);
  }
}
