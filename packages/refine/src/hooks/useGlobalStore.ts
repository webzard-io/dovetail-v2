import { useContext } from 'react';
import GlobalStoreContext from '../contexts/global-store';

export const useGlobalStore = () => {
  return useContext(GlobalStoreContext);
};
