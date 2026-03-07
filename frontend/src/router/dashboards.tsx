import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

import SuspenseLoader from "../components/SuspenseLoader";

const Loader = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Dashboards

const Automation = Loader(
  lazy(() => import("../content/dashboards/Automation"))
);
const Analytics = Loader(lazy(() => import("../content/dashboards/Analytics")));
const Reports = Loader(lazy(() => import("../content/dashboards/Reports")));
const Banking = Loader(lazy(() => import("../content/dashboards/Banking")));
const Commerce = Loader(lazy(() => import("../content/dashboards/Commerce")));
const Expenses = Loader(lazy(() => import("../content/dashboards/Expenses")));
const Crypto = Loader(lazy(() => import("../content/dashboards/Crypto")));
const Finance = Loader(lazy(() => import("../content/dashboards/Finance")));
const Fitness = Loader(lazy(() => import("../content/dashboards/Fitness")));
const HealthcareDoctor = Loader(
  lazy(() => import("../content/dashboards/Healthcare"))
);
const HealthcareHospital = Loader(
  lazy(() => import("../content/dashboards/Healthcare/HospitalView"))
);
const Helpdesk = Loader(lazy(() => import("../content/dashboards/Helpdesk")));
const Learning = Loader(lazy(() => import("../content/dashboards/Learning")));
const Monitoring = Loader(
  lazy(() => import("../content/dashboards/Monitoring"))
);
const Products = Loader(lazy(() => import("../content/dashboards/Products")));
const Statistics = Loader(
  lazy(() => import("../content/dashboards/Statistics"))
);
const Tasks = Loader(lazy(() => import("../content/dashboards/Tasks")));
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
    element: <Analytics />,
  },
  {
    path: "automation",
    element: <Automation />,
  },
  {
    path: "analytics",
    element: <Analytics />,
  },
  {
    path: "reports",
    element: <Reports />,
  },
  {
    path: "banking",
    element: <Banking />,
  },
  {
    path: "commerce",
    element: <Commerce />,
  },
  {
    path: "expenses",
    element: <Expenses />,
  },
  {
    path: "crypto",
    element: <Crypto />,
  },
  {
    path: "finance",
    element: <Finance />,
  },
  {
    path: "fitness",
    element: <Fitness />,
  },
  {
    path: "healthcare",
    children: [
      {
        path: "",
        element: <Navigate to="hospital" replace />,
      },
      {
        path: "hospital",
        element: <HealthcareHospital />,
      },
      {
        path: "doctor",
        element: <HealthcareDoctor />,
      },
    ],
  },
  {
    path: "helpdesk",
    element: <Helpdesk />,
  },
  {
    path: "learning",
    element: <Learning />,
  },
  {
    path: "monitoring",
    element: <Monitoring />,
  },
  {
    path: "products",
    element: <Products />,
  },
  {
    path: "statistics",
    element: <Statistics />,
  },
  {
    path: "tasks",
    element: <Tasks />,
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
    element: <KpiDashboard />,
  },
  {
    path: "verify-reserve",
    element: <VerifyReserve />,
  },
  {
    path: "reserve-admin",
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
  ReservationStatusPage,
];

export default dashboardsRoutes;
