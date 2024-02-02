import { createContext } from 'react';
import { ResourceConfig } from 'src/types';

const ConfigsContext = createContext<Record<string, ResourceConfig>>({});

export default ConfigsContext;
