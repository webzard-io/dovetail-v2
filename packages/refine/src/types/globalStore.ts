import { MetaQuery } from '@refinedev/core';
import { CancelQueriesParams, IProviderPlugin, Unstructured, UnstructuredList } from 'k8s-api-provider';

interface GlobalStoreInitParams {
    apiUrl: string;
    fieldManager?: string;
    kubeApiTimeout?: false | number;
  }

export type GlobalStoreWatchEvent = {
    type: 'ADDED' | 'MODIFIED' | 'DELETED' | 'PING';
    object: UnstructuredList;
  };

export interface IGlobalStore {
    plugins: IProviderPlugin[];
    prefix?: string;
    fieldManager?: string;
  
    // Getters
    apiUrl: string;
    kubeApiTimeout: number | false | undefined;
  
    // Methods
    get<T = UnstructuredList>(resource: string, meta?: MetaQuery): Promise<T>;
    subscribe(resource: string, onEvent: (event: GlobalStoreWatchEvent) => void): () => void;
    publish(resource: string, event: GlobalStoreWatchEvent): void;
    init(params: GlobalStoreInitParams): void;
    loadPlugins(plugins?: IProviderPlugin[]): void;
    restoreItem(item: Unstructured): Unstructured;
    restoreData(list: UnstructuredList): UnstructuredList;
    destroy(): void;
    cancelQueries(params?: CancelQueriesParams): void;
    refreshList?(resource: string): void;
  }
  