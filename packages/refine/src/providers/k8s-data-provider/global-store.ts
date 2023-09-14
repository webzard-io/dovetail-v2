import { MetaQuery } from "@refinedev/core";
import { KubeApi, UnstructuredList, WatchEvent } from "./kube-api";

export function getObjectConstructor(resource: string, meta: any) {
  return meta?.resourceBasePath
    ? {
        resourceBasePath: meta?.resourceBasePath,
        resource,
      }
    : {
        resourceBasePath: "/api/v1",
        resource: "namespaces",
      };
}

type Options = {
  apiUrl: string;
  watchApiUrl?: string;
}

export class GlobalStore {
  public options: Options;

  private store: Map<string, UnstructuredList>;
  private subscribers: Map<string, ((data: WatchEvent) => void)[]>;

  constructor(options: Options) {
    this.store = new Map();
    this.subscribers = new Map();
    this.options = options;
  }

  get<T = UnstructuredList>(resource: string, meta?: MetaQuery): Promise<T> {
    return new Promise((resolve) => {
      if (!this.store.has(resource)) {
        const api = new KubeApi({
          basePath: this.options.apiUrl,
          watchWsBasePath: this.options.watchApiUrl,
          objectConstructor: getObjectConstructor(resource, meta),
        });

        let resolved = false;

        api.listWatch({
          onResponse: (res) => {
            if (!resolved) {
              resolve(res as T);
              resolved = true;
            }
            this.store.set(resource, res);
          },
          onEvent: (event) => {
            this.notify(resource, event);
          },
        });
      } else {
        resolve(this.store.get(resource)! as T);
      }
    });
  }

  subscribe(resource: string, onEvent: (data: WatchEvent) => void) {
    if (!this.subscribers.has(resource)) {
      this.subscribers.set(resource, []);
    }

    this.subscribers.get(resource)!.push(onEvent);

    return () => {
      const handlers = this.subscribers.get(resource)!;
      this.subscribers.set(
        resource,
        handlers.filter((h) => h !== onEvent)
      );
    };
  }

  private notify(resource: string, data: WatchEvent) {
    const subscribers = this.subscribers.get(resource);
    if (subscribers) {
      for (const subscriber of subscribers) {
        subscriber(data);
      }
    }
  }
}
