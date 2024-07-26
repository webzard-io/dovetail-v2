import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { Event } from 'kubernetes-types/core/v1';
import { ResourceModel } from './resource-model';

export class EventModel extends ResourceModel {
  constructor(
    public _rawYaml: Unstructured & Event,
    _globalStore: GlobalStore
  ) {
    super(_rawYaml, _globalStore);
    this.id = _rawYaml.metadata.uid || _rawYaml.id;
  }
}
