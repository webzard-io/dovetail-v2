import React, { createContext } from 'react';
import Table from 'src/components/InternalBaseTable';
import { Tabs } from 'src/components/Tabs';

export interface ComponentContextValue {
  Table?: typeof Table;
  Tabs?: typeof Tabs;
}

/**
 * 允许消费者替换框架内部使用的 Table 和 Tabs 组件。
 * 通过 ComponentContextProvider 注入自定义实现。
 */
const ComponentContext = createContext<ComponentContextValue>({});

export function ComponentContextProvider({
  value,
  children,
}: {
  value: ComponentContextValue;
  children: React.ReactNode;
}) {
  return React.createElement(ComponentContext.Provider, { value }, children);
}

export default ComponentContext;
