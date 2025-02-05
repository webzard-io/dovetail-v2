import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { PersistentVolume } from 'kubernetes-types/core/v1';
import { get } from 'lodash-es';
import { ResourceState } from 'src/constants';
import { parseSi } from '../utils/unit';
import { ResourceModel } from './resource-model';

type RequiredPersistentVolume = Required<PersistentVolume> & Unstructured;

export class PersistentVolumeModel extends ResourceModel {
  declare public spec: PersistentVolume['spec'];

  constructor(
    public _rawYaml: RequiredPersistentVolume,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }

  get phase() {
    return this._rawYaml.status.phase;
  }

  get stateDisplay() {
    switch (this.phase) {
      case 'Pending':
        return ResourceState.PENDING;
      case 'Bound':
        return ResourceState.BOUND;
      case 'Failed':
        return ResourceState.FAILED;
      case 'Available':
        return ResourceState.AVAILABLE;
      case 'Released':
        return ResourceState.RELEASED;
      default:
        return ResourceState.UNKNOWN;
    }
  }

  get csi() {
    return this._rawYaml.spec.csi?.driver;
  }

  get pvc() {
    return this._rawYaml.spec.claimRef?.name;
  }

  get pvcNamespace() {
    return this._rawYaml.spec.claimRef?.namespace;
  }

  get pvcUid() {
    return this._rawYaml.spec.claimRef?.uid;
  }

  get storageBytes() {
    return parseSi(get(this._rawYaml, ['spec', 'capacity', 'storage']));
  }
}
