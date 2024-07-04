import { Tabs as BaseTabs, TabsTabPane } from '@cloudtower/eagle';
import React from 'react';

export type TabsProps = {
  tabs: {
    title: string;
    key: string;
    children: React.ReactNode;
  }[];
  className?: string;
}

export function Tabs(props: TabsProps) {
  const { tabs, className } = props;

  return (
    <BaseTabs className={className}>
      {tabs.map(tab => {
        return (
          <TabsTabPane tab={tab.title} key={tab.title}>
            {tab.children}
          </TabsTabPane>
        );
      })}
    </BaseTabs>
  );
}
