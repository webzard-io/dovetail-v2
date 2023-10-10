import { useUIKit } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useMenu, ITreeMenu } from '@refinedev/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuStyle = css`
  &.ant-menu {
    background: #edf0f7;
    padding: 8px;

    .ant-menu-item-selected {
      background: linear-gradient(90deg,#0080ff,#005ed1);
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(184,192,204,.6);
      color: #fff;

      a:hover {
        color: #fff;
      }
    }

    .ant-menu-item:not(.ant-menu-item-selected):hover {
      background: linear-gradient(90deg,#fff,hsla(0,0%,100%,.6));
      border-radius: 6px;
      box-shadow: 0 0 4px rgba(235,239,245,.6), 0 8px 16px rgba(129,138,153,.18);
    }
  }
`;

export const Menu = () => {
  const kit = useUIKit();
  const { menuItems, selectedKey } = useMenu();

  function renderMenuItems(items: ITreeMenu[]) {
    return items.map((item) => item.list ? (
      <kit.menuItem key={item.key}>
        <NavLink to={item.route || ''}>{item.label}</NavLink>
      </kit.menuItem>
    ) : (
      <kit.menuItemGroup key={item.key} title={item.name}>
        {renderMenuItems(item.children)}
      </kit.menuItemGroup>
    ));
  }

  return (
    <kit.menu className={MenuStyle} theme="light" selectedKeys={[selectedKey]}>
      {renderMenuItems(menuItems)}
    </kit.menu>
  );
};
