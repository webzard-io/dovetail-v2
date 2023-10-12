import { Resource } from '../types';

export class ResourceModel implements Resource {
  public id!: Resource['id'];
  public apiVersion!: Resource['apiVersion'];
  public kind!: Resource['kind'];
  public metadata!: Resource['metadata'];

  constructor(public data: Resource) {
    this.id = data.id;
    this.apiVersion = data.apiVersion;
    this.kind = data.kind;
    this.metadata = data.metadata;
  }

  get name() {
    return this.data.metadata?.name;
  }
  get namespace() {
    return this.data.metadata?.namespace;
  }
  get labels() {
    return this.data.metadata?.labels;
  }
  get annotations() {
    return this.data.metadata?.annotations;
  }
}
