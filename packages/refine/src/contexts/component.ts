import { createContext } from 'react';
import Table from 'src/components/Table';
import { Tabs } from 'src/components/Tabs';

const ComponentContext = createContext<{
  Table?: typeof Table;
  Tabs?: typeof Tabs;
}>({});

export default ComponentContext;
