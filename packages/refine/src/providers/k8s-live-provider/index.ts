import { LiveEvent, LiveProvider } from "@refinedev/core";
import { KubeApi, StopWatchHandler } from "../k8s-data-provider/kube-api";
import { getId } from "../k8s-data-provider";
import { WatchEvent } from "kubernetes-types/meta/v1";
import {
  GlobalStore,
  getObjectConstructor,
} from "../k8s-data-provider/global-store";

const eventTypeMap: Record<WatchEvent["type"], LiveEvent["type"]> = {
  ADDED: "created",
  MODIFIED: "updated",
  DELETED: "deleted",
};

export const liveProvider = (globalStore: GlobalStore): LiveProvider => ({
  subscribe: ({ channel, params, types, callback }) => {
    const { resource } = params as any;

    const stop = globalStore.subscribe(resource, (event) => {
      const id = getId(event.object);
      callback({
        channel,
        type: eventTypeMap[event.type] || event.type,
        date: new Date(),
        payload: {
          ids: [id],
          object: event.object,
        },
      });
    });

    return {
      stop,
    };
  },
  unsubscribe: ({ stop }: Partial<{ stop: StopWatchHandler }>) => {
    // console.log("unsubscribe", { stop });
    stop?.();
  },
  publish: (event) => {
    // console.log("publish", { event });
  },
});
