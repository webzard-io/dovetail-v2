import { PropsWithChildren, useState } from "react";
import { useUIKit } from '@cloudtower/eagle';
import { Breadcrumb } from '../Breadcrumb';
import { Menu } from "../Menu";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const kit = useUIKit();
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Content, Footer, Sider } = kit.layout;

  return (
    <kit.layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="light" collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu />
      </Sider>
      <kit.layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb>

          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </kit.layout>
    </kit.layout>
  );
};
