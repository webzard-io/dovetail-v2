import { useUIKit } from '@cloudtower/eagle';
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
  const kit = useUIKit();

  return (
    <kit.tabs className={className}>
      {tabs.map(tab => {
        return (
          <kit.tabsTabPane tab={tab.title} key={tab.title}>
            {tab.children}
          </kit.tabsTabPane>
        );
      })}
    </kit.tabs>
  );
}
