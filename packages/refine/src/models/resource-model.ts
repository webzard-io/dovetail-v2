import { GlobalStore, Unstructured } from 'k8s-api-provider';

export type IResourceModel = Unstructured & ResourceModel;

export class ResourceModel<T extends Unstructured = Unstructured> {
  public id!: string;
  public apiVersion!: T['apiVersion'];
  public kind!: T['kind'];
  public metadata!: T['metadata'];
  public declare _globalStore: GlobalStore;

  constructor(
    public _rawYaml: T,
    _globalStore: GlobalStore
  ) {
    Object.keys(_rawYaml).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return _rawYaml[key as keyof T];
        },
        enumerable: true,
      });
    });
    Object.defineProperty(this, '_globalStore', {
      get() {
        return _globalStore;
      },
      enumerable: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async init() {}

  get name() {
    return this._rawYaml.metadata?.name;
  }
  get namespace() {
    return this._rawYaml.metadata?.namespace || 'default';
  }
  get labels() {
    return this._rawYaml.metadata?.labels;
  }
  get annotations() {
    return this._rawYaml.metadata?.annotations;
  }

  restore() {
    return this._rawYaml;
  }

  updateLabel(labels: Record<string, string>) {
    const newYaml = this._globalStore.restoreItem(this);
    if (!newYaml.metadata) {
      newYaml.metadata = {};
    }
    newYaml.metadata.labels = labels;
    return newYaml;
  }

  updateAnnotation(annotations: Record<string, string>) {
    const newYaml = this._globalStore.restoreItem(this);
    if (!newYaml.metadata) {
      newYaml.metadata = {};
    }
    newYaml.metadata.annotations = annotations;
    return newYaml;
  }
}
