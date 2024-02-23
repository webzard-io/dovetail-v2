import { useUIKit, Typo } from '@cloudtower/eagle';
import { css, cx } from '@linaria/core';
import { PropsWithChildren, useState } from 'react';
import React from 'react';
import { Menu } from '../Menu';
import { NamespacesFilter } from '../NamespacesFilter';

const HeaderStyle = css`
  &.ant-layout-header {
    align-items: center;
    background: #fff;
    border-bottom: 2px solid #edf0f7;
    display: flex;
    height: 50px;
    justify-content: space-between;
    padding: 0 24px 0 14px;
    position: relative;
    z-index: 10;
  }
`;

const ContentLayoutStyle = css`
  height: 100%;
`;

const SiderStyle = css`
  &.ant-layout-sider {
    background: #edf0f7;
  }
`;

const ContentStyle = css`
  &.ant-layout-content {
    background: #fff;
  }
`;

export const Layout: React.FC<PropsWithChildren<Record<string, unknown>>> = ({
  children,
}) => {
  const kit = useUIKit();
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Content, Sider } = kit.layout;

  return (
    <kit.layout style={{ height: '100%' }}>
      <Header className={cx(HeaderStyle, Typo.Heading.h1_bold_title)}>
        Dovetail 2
        <div style={{ width: 300 }}>
          <NamespacesFilter />
        </div>
      </Header>
      <kit.layout className={ContentLayoutStyle}>
        <Sider
          width={256}
          className={SiderStyle}
          theme="light"
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
        >
          <Menu />
        </Sider>
        <Content className={ContentStyle}>{children}</Content>
      </kit.layout>
    </kit.layout>
  );
};
