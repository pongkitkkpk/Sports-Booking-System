// The six real destinations of the booking product, shared by the sidebar
// menu, the header's quick-menu popover, and the profile page — kept in one
// place so they can't drift out of sync with each other.
import SportsTwoToneIcon from "@mui/icons-material/SportsTwoTone";
import EventAvailableTwoToneIcon from "@mui/icons-material/EventAvailableTwoTone";
import SummarizeTwoToneIcon from "@mui/icons-material/SummarizeTwoTone";
import VerifiedUserTwoToneIcon from "@mui/icons-material/VerifiedUserTwoTone";
import BlockTwoToneIcon from "@mui/icons-material/BlockTwoTone";
import FitnessCenterTwoToneIcon from "@mui/icons-material/FitnessCenterTwoTone";
import useAuth from "../hooks/useAuth";

export interface BookingNavItem {
  name: string;
  icon: typeof SportsTwoToneIcon;
  link: string;
  // เมื่อไม่ระบุ = ทุก role เห็นได้; ระบุแล้วต้องมี role ตรงกันจึงเห็นเมนูนี้
  roles?: string[];
}

export const bookingNav: BookingNavItem[] = [
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
    roles: ["admin"],
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
    roles: ["admin"],
  },
  {
    name: "KMUTNB Fitness Center",
    icon: FitnessCenterTwoToneIcon,
    link: "/extended-sidebar/dashboards/KMUTNB-Fitness-Center",
  },
];

// นักเรียน/บุคคลทั่วไปเห็นเฉพาะเมนูของตัวเอง ส่วน admin เห็นทุกเมนู
// (รวมหน้าอนุมัติ "สรุปการใช้สนาม" และ "การปิดสนาม")
export const useVisibleBookingNav = (): BookingNavItem[] => {
  const { user } = useAuth();
  return bookingNav.filter((item) => !item.roles || item.roles.includes(user?.role));
};
