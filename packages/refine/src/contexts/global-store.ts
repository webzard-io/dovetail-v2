import { WatchEvent } from 'k8s-api-provider';
import { createContext } from 'react';
import { IGlobalStore } from 'src/types/globalStore';

const GlobalStoreContext = createContext<Record<string, IGlobalStore<WatchEvent>>>({});

export default GlobalStoreContext;
