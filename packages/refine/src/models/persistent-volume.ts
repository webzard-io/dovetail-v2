import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { PersistentVolume } from 'kubernetes-types/core/v1';
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

  get csi() {
    return this._rawYaml.spec.csi?.driver;
  }

  get pvc() {
    return this._rawYaml.spec.claimRef?.name;
  }
}
