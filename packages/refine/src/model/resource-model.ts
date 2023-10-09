import { Unstructured } from 'k8s-api-provider';

export type Resource = Unstructured & {
  id: string
}

export class ResourceModel {
  constructor(public data: Resource) {}

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
