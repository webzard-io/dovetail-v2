import { createContext } from 'react';

type Constants = {
  schemaUrlPrefix: string;
}

const ConstantsContext = createContext<Constants>({
  schemaUrlPrefix: '',
});

export default ConstantsContext;
