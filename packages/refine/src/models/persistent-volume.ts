import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { PersistentVolume } from 'kubernetes-types/core/v1';
import { ResourceModel } from './resource-model';

type RequiredPersistentVolume = Required<PersistentVolume> & Unstructured;

export class PersistentVolumeModel extends ResourceModel {
  constructor(
    public _rawYaml: RequiredPersistentVolume,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }
}
