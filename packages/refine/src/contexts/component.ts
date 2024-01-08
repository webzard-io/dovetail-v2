import { createContext } from 'react';
import Table from 'src/components/Table';

const ComponentContext = createContext<{
  Table?: typeof Table;
}>({});

export default ComponentContext;
