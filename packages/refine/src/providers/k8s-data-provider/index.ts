import { DataProvider } from "@refinedev/core";
import { KubeSdk, Unstructured } from "./kube-api";
import { filterData } from "./utils/filter-data";
import { sortData } from "./utils/sort-data";
import { GlobalStore } from "./global-store";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

export function getId(obj: Unstructured) {
  if (!obj.metadata.namespace) {
    return obj.metadata.name || "";
  }
  return `${obj.metadata.namespace}/${obj.metadata.name}`;
}

function getApiVersion(resourceBasePath: string): string {
  return resourceBasePath.replace(/^(\/api\/)|(\/apis\/)/, "")
}

export const dataProvider = (
  globalStore: GlobalStore
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany" | "custom"
> => {
  const getOne: DataProvider["getOne"] = async ({ resource, id, meta }) => {
    const idParts = id.toString().split("/");
    const [namespace, name] =
      idParts.length === 1 ? [undefined, idParts[0]] : idParts;
    const { items, kind, apiVersion } = await globalStore.get(resource, meta);

    const data = items.find(
      (item) =>
        item.metadata.name === name && item.metadata.namespace === namespace
    );

    return {
      data: (data
        ? {
            ...data,
            id: getId(data),
            kind: kind.replace(/List$/g, ""),
            apiVersion: apiVersion,
          }
        : null) as any,
    };
  };

  return {
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      let { items } = await globalStore.get(resource, meta);

      if (filters) {
        items = filterData(filters, items);
      }

      if (sorters) {
        items = sortData(sorters, items);
      }

      return {
        data: items.map((item) => ({
          ...item,
          id: getId(item),
        })) as any,
        total: items.length,
      };
    },

    getMany: async ({ ids, ...rest }) => {
      const data = await Promise.all(
        ids.map((id) => getOne({ id, ...rest }).then((v) => v.data))
      );

      return {
        data: data as any,
      };
    },

    create: async ({ variables, meta }) => {
      const sdk = new KubeSdk({
        basePath: globalStore.options.apiUrl,
      });

      const data = await sdk.applyYaml([
        {
          ...(variables as Unstructured),
          apiVersion: getApiVersion(meta?.resourceBasePath),
          kind: meta?.kind,
        },
      ]);

      return {
        data: data[0] as any,
      };
    },

    update: async ({ variables, meta }) => {
      const sdk = new KubeSdk({
        basePath: globalStore.options.apiUrl,
      });

      const data = await sdk.applyYaml([
        {
          ...(variables as Unstructured),
          apiVersion: getApiVersion(meta?.resourceBasePath),
          kind: meta?.kind,
        },
      ]);

      return {
        data: data[0] as any,
      };
    },

    getOne,

    deleteOne: async ({ resource, id, meta, ...rest }) => {
      const sdk = new KubeSdk({
        basePath: globalStore.options.apiUrl,
      });

      const { data: current } = await getOne({ id, resource, meta, ...rest });

      const data = await sdk.deleteYaml([
        {
          ...(current as Unstructured),
        },
      ]);

      return {
        data: data[0] as any,
      };
    },

    getApiUrl: () => {
      return globalStore.options.apiUrl;
    },
  };
};
