import type { ReactNode } from "react";
import { useVisibleBookingNav } from "../../../../config/bookingNav";

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

export const useMenuItems = (): MenuItems[] => {
  const bookingNav = useVisibleBookingNav();

  return [
    {
      heading: "ระบบจองสนามกีฬา KMUTNB",
      items: bookingNav,
    },
  ];
};
