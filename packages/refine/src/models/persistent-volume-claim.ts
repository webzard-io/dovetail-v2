import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { PersistentVolumeClaim } from 'kubernetes-types/core/v1';
import { ResourceModel } from './resource-model';

type RequiredPersistentClaimVolume = Required<PersistentVolumeClaim> & Unstructured;

export class PersistentVolumeClaimModel extends ResourceModel {
  constructor(
    public _rawYaml: RequiredPersistentClaimVolume,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }
}
