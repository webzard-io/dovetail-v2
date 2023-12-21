import React, { createContext } from 'react';
import Table, { TableProps } from 'src/components/Table';
import { ResourceModel } from 'src/model/resource-model';

const ComponentContext = createContext<{
  Table?: typeof Table
}>({});

export default ComponentContext;
