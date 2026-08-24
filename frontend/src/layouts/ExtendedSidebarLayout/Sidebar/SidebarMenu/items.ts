import type { ReactNode } from "react";

import SportsTwoToneIcon from "@mui/icons-material/SportsTwoTone";
import EventAvailableTwoToneIcon from "@mui/icons-material/EventAvailableTwoTone";
import SummarizeTwoToneIcon from "@mui/icons-material/SummarizeTwoTone";
import VerifiedUserTwoToneIcon from "@mui/icons-material/VerifiedUserTwoTone";
import BlockTwoToneIcon from "@mui/icons-material/BlockTwoTone";
import FitnessCenterTwoToneIcon from "@mui/icons-material/FitnessCenterTwoTone";

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
    items: [
      {
        name: "จองสนาม",
        icon: SportsTwoToneIcon,
        link: "/extended-sidebar/dashboards/reserve",
      },
      {
        name: "สถานะการจอง",
        icon: EventAvailableTwoToneIcon,
        link: "/extended-sidebar/dashboards/my-bookings",
      },
      {
        name: "สรุปการใช้สนาม",
        icon: SummarizeTwoToneIcon,
        link: "/extended-sidebar/dashboards/report-kpis",
      },
      {
        name: "ยืนยันตัวตน",
        icon: VerifiedUserTwoToneIcon,
        link: "/extended-sidebar/dashboards/verify-reserve",
      },
      {
        name: "การปิดสนาม",
        icon: BlockTwoToneIcon,
        link: "/extended-sidebar/dashboards/reserve-admin",
      },
      {
        name: "KMUTNB Fitness Center",
        icon: FitnessCenterTwoToneIcon,
        link: "/extended-sidebar/dashboards/KMUTNB-Fitness-Center",
      },
    ],
  },
];

export default menuItems;
