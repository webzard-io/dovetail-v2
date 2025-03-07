import { LiveEvent, LiveProvider } from '@refinedev/core';
import { StopWatchHandler, Unstructured } from 'k8s-api-provider';
import { IGlobalStore, GlobalStoreWatchEvent } from 'src/types/globalStore';

const eventTypeMap: Record<GlobalStoreWatchEvent['type'], LiveEvent['type']> = {
  ADDED: 'created',
  MODIFIED: 'updated',
  DELETED: 'deleted',
  PING: 'ping',
};

function getKey<T extends GlobalStoreWatchEvent['type']>(value: LiveEvent['type']): T {
  return (Object.keys(eventTypeMap) as Array<keyof typeof eventTypeMap>).find(
    key => eventTypeMap[key] === value
  ) as T;
}

export const D2LiveProvider = (
  globalStoreMap: Record<string, IGlobalStore>
): LiveProvider => ({
  subscribe: ({ channel, params, callback }) => {
    // 当收到 useList 之类的调用时，执行subscribe 函数，开始监听数据更新
    const { resource } = params ?? {};
    if (!resource) {
      throw new Error(
        '[WatchApi]: `resource` is required in `params` for k8s watch and globalStore'
      );
    }
    const globalStore = globalStoreMap[params?.meta?.dataProviderName || 'default'];

    if (!globalStore) {
      throw new Error(
        '[WatchApi]: `GlobalStore` is required in `params` for k8s live provider, can not find matched `GlobalStore`'
      );
    }
    // 监听 globalStore 发出的事件，并调用 callback 方法更新数据
    const stop = globalStore.subscribe(resource, event => {
      const eventType = getKey(event.type);
      const id = genResourceId(event.object);
      callback({
        channel,
        type: eventType || event.type,
        date: new Date(),
        payload: {
          // TODO：如果是编辑单个的id是什么？
          ids: id ? [id] : [],
          // event.object 是新的值，可以是单个的，也可以是数组，具体视事件类型而定
          object: event.object,
        },
      });
    });

    return {
      stop,
    };
  },
  unsubscribe: ({ stop }: Partial<{ stop: StopWatchHandler }>) => {
    stop?.();
  },
  publish: (event: LiveEvent) => {
    const globalStore = globalStoreMap[event.meta?.dataProviderName || 'default'];
    if (!globalStore) {
      throw new Error(
        '[WatchApi]: `GlobalStore` is required in `params` for k8s live provider, can not find matched `GlobalStore`'
      );
    }

    if (!globalStore.refreshList) return;

    const [, resource] = event.channel.split('/');
    if (!resource) {
      throw new Error(
        '[WatchApi]: `resource` is required in `params` for k8s watch and globalStore'
      );
    }

    // 显式地手动刷新列表
    globalStore.refreshList?.(resource);
  },
});


function genResourceId(obj: Partial<Unstructured>) {
    if (!obj.metadata?.namespace) {
      return obj.metadata?.name || '';
    }
    return `${obj.metadata?.namespace}/${obj.metadata?.name}`;
  }
  