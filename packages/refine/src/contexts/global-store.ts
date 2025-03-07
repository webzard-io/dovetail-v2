import { createContext } from 'react';
import { IGlobalStore } from 'src/types/globalStore';

const GlobalStoreContext = createContext<Record<string, IGlobalStore>>({});

export default GlobalStoreContext;
