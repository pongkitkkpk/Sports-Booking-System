import { Suspense, lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";

import SuspenseLoader from "../components/SuspenseLoader";
import RequireRole from "../components/RequireRole";

const Loader = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Dashboards — the six real destinations of the booking product (kept in
// sync with config/bookingNav.ts)

const Reserve = Loader(lazy(() => import("../content/dashboards/Reserve")));
const ReserveDetail = Loader(
  lazy(() => import("../content/dashboards/Reserve/ReserveDetail"))
);
const ReserveInfoForm = Loader(
  lazy(() => import("../content/dashboards/Reserve/ReserveInfoForm"))
);

const ReservationStatusPage = Loader(
  lazy(() => import("../content/dashboards/ReservationStatus"))
);
const KpiDashboard = Loader(
  lazy(() => import("../content/dashboards/KpiDashboard"))
);
const VerifyReserve = Loader(
  lazy(() => import("../content/dashboards/VerifyReserve"))
);
const KFitnessCenter = Loader(
  lazy(() => import("../content/dashboards/KFitnessCenter"))
);
const ReserveAdmin = Loader(
  lazy(() => import("../content/dashboards/ReserveAdmin"))
);
const ReserveAdminDetail = Loader(
  lazy(() => import("../content/dashboards/ReserveAdmin/ReserveAdminDetail"))
);
const ReserveAdminInfoForm = Loader(
  lazy(() => import("../content/dashboards/ReserveAdmin/ReserveAdminInfoForm"))
);

const dashboardsRoutes = [
  {
    path: "",
    element: <Navigate to="reserve" replace />,
  },
  {
    path: "reserve",
    children: [
      {
        path: "",
        element: <Reserve />, // หน้ารวมเลือกสนาม
      },
      {
        path: ":courtType",
        children: [
          {
            path: "",
            element: <ReserveDetail />, // หน้ารายละเอียดการจองของสนาม เช่น /badminton
          },
          {
            path: "submit",
            element: <ReserveInfoForm />, // หน้ากรอกข้อมูล เช่น /badminton/submit
          },
        ],
      },
    ],
  },
  {
    path: "my-bookings",
    element: <ReservationStatusPage />,
  },
  {
    path: "report-kpis",
    // สรุปการใช้สนาม + คิวอนุมัติการจอง — admin เท่านั้น
    element: (
      <RequireRole roles={["admin"]}>
        <KpiDashboard />
      </RequireRole>
    ),
  },
  {
    path: "verify-reserve",
    element: <VerifyReserve />,
  },
  {
    path: "reserve-admin",
    // ระบบปิดสนาม/จองแทนหน้างาน — admin เท่านั้น
    element: (
      <RequireRole roles={["admin"]}>
        <Outlet />
      </RequireRole>
    ),
    children: [
      {
        path: "",
        element: <ReserveAdmin />, // หน้ารวมเลือกสนาม
      },
      {
        path: ":courtType",
        children: [
          {
            path: "",
            element: <ReserveAdminDetail />, // หน้ารายละเอียดการจองของสนาม เช่น /badminton
          },
          {
            path: "submit",
            element: <ReserveAdminInfoForm />, // หน้ากรอกข้อมูล เช่น /badminton/submit
          },
        ],
      },
    ],
  },
  {
    path: "KMUTNB-Fitness-Center",
    element: <KFitnessCenter />,
  },
];

export default dashboardsRoutes;
