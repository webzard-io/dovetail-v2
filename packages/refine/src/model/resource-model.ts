import { Unstructured } from 'k8s-api-provider';

export type Resource = Unstructured & {
  id: string;
};

export class ResourceModel implements Resource {
  public id!: Resource['id'];
  public apiVersion!: Resource['apiVersion'];
  public kind!: Resource['kind'];
  public metadata!: Resource['metadata'];

  constructor(public data: Resource) {
    Object.assign(this, { ...data });
  }

  get name() {
    return this.data.metadata.name;
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
