import { useMenu } from "@refinedev/core";
import { NavLink } from "react-router-dom";
import { useUIKit } from '@cloudtower/eagle';

export const Menu = () => {
  const kit = useUIKit();
  const { menuItems } = useMenu();

  return (
    <kit.menu className="menu" theme="light">
      {menuItems.map((item) => (
        <kit.menuItem key={item.key}>
          <NavLink to={item.route}>{item.label}</NavLink>
        </kit.menuItem>
      ))}
    </kit.menu>
  );
};
