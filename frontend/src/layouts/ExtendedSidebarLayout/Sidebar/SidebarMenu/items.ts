import type { ReactNode } from "react";
import { bookingNav } from "../../../../config/bookingNav";

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  badgeTooltip?: string;

  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
}

const menuItems: MenuItems[] = [
  {
    heading: "ระบบจองสนามกีฬา KMUTNB",
    items: bookingNav,
  },
];

export default menuItems;
