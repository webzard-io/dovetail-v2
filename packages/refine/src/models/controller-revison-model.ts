import { GlobalStore, Unstructured } from 'k8s-api-provider';
import { ControllerRevision } from 'kubernetes-types/apps/v1';
import { ResourceModel } from './resource-model';

type RequiredControllerRevision = Required<ControllerRevision> & Unstructured;

export class ControllerRevisionModel extends ResourceModel<RequiredControllerRevision> {
  constructor(public _rawYaml: RequiredControllerRevision, _globalStore: GlobalStore) {
    super(_rawYaml, _globalStore);
  }

  get revision() {
    return this._rawYaml.revision;
  }
}
