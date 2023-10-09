import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { PropsWithChildren, useState } from 'react';
import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import { Menu } from '../Menu';

const ContentLayoutStyle = css`
  height: 100%;
`;

const BreadcrumbStyle = css`
  margin: 8px 0;
`;

const ContentStyle = css`
  margin: 0 16px;
  display: flex;
  flex-direction: column;
`;

const MainContentStyle = css`
  padding: 24px;
  background: #fff;
  flex: 1;
  min-height: 0;
`;

export const Layout: React.FC<PropsWithChildren<Record<string, unknown>>> = ({ children }) => {
  const kit = useUIKit();
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Content, Footer, Sider } = kit.layout;

  return (
    <kit.layout style={{ height: '100%' }}>
      <Sider collapsible theme="light" collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu />
      </Sider>
      <kit.layout className={ContentLayoutStyle}>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content className={ContentStyle}>
          <Breadcrumb className={BreadcrumbStyle} />
          <div className={MainContentStyle}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </kit.layout>
    </kit.layout>
  );
};
