import { useContext } from 'react';
import GlobalStoreContext from '../contexts/global-store';

export const useGlobalStore = (name = 'default') => {
  const globalStores = useContext(GlobalStoreContext);
  return globalStores[name];
};
