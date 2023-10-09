import { ResourceType } from '../types/resource';

export class ResourceModel {
  constructor(public data: ResourceType) {}

  get name() {
    return this.data.metadata.name;
  }
  get id() {
    return this.data.id;
  }
  get namespace() {
    return this.data.metadata.namespace;
  }
  get labels() {
    return this.data.metadata.labels;
  }
  get annotations() {
    return this.data.metadata.annotations;
  }
}
