import { GlobalStore } from 'k8s-api-provider';
import { createContext } from 'react';

const GlobalStoreContext = createContext<{
  globalStore?: GlobalStore;
}>({});

export default GlobalStoreContext;
