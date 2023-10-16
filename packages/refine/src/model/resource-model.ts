import { Resource } from '../types';

export class ResourceModel implements Resource {
  public id!: Resource['id'];
  public apiVersion!: Resource['apiVersion'];
  public kind!: Resource['kind'];
  public metadata!: Resource['metadata'];

  constructor(public rawYaml: Resource) {
    this.id = rawYaml.id;
    this.apiVersion = rawYaml.apiVersion;
    this.kind = rawYaml.kind;
    this.metadata = rawYaml.metadata;
  }

  get name() {
    return this.rawYaml.metadata?.name;
  }
  get namespace() {
    return this.rawYaml.metadata?.namespace;
  }
  get labels() {
    return this.rawYaml.metadata?.labels;
  }
  get annotations() {
    return this.rawYaml.metadata?.annotations;
  }
}
