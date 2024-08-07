import { Menu as BaseMenu, MenuItemGroup } from '@cloudtower/eagle';
import { css } from '@linaria/core';
import { useMenu, ITreeMenu } from '@refinedev/core';
import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuStyle = css`
  &.ant-menu {
    background: #edf0f7;
    padding: 8px;

    .ant-menu-item-selected {
      background: linear-gradient(90deg, #0080ff, #005ed1);
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(184, 192, 204, 0.6);
      color: #fff;

      a:hover {
        color: #fff;
      }
    }

    .ant-menu-item:not(.ant-menu-item-selected):hover {
      background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0.6));
      border-radius: 6px;
      box-shadow: 0 0 4px rgba(235, 239, 245, 0.6), 0 8px 16px rgba(129, 138, 153, 0.18);
    }
  }
`;

export const Menu = () => {
  const { menuItems, selectedKey } = useMenu();

  function renderMenuItems(items: ITreeMenu[]) {
    return items.map(item =>
      item.list ? (
        <BaseMenu.Item key={item.key}>
          <NavLink to={item.route || ''}>{item.label}</NavLink>
        </BaseMenu.Item>
      ) : (
        <MenuItemGroup key={item.key} title={item.name}>
          {renderMenuItems(item.children)}
        </MenuItemGroup>
      )
    );
  }

  return (
    <BaseMenu className={MenuStyle} theme="light" selectedKeys={[selectedKey]}>
      {renderMenuItems(menuItems)}
    </BaseMenu>
  );
};
