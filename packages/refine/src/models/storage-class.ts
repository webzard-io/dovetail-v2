import { GlobalStore, Unstructured } from 'k8s-api-provider';
import type { StorageClass } from 'kubernetes-types/storage/v1';
import { ResourceModel } from './resource-model';

type RequiredStorageClass = Required<StorageClass> & Unstructured;

export class StorageClassModel extends ResourceModel {
  constructor(
    public _rawYaml: RequiredStorageClass,
    public _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
  }
}
