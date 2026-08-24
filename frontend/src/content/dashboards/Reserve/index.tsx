// import PageHeader from "./PageHeader";
import Footer from "../../../components/Footer";
import PageTitleWrapper from "../../../components/PageTitleWrapper";
import { Helmet } from "react-helmet-async";

import SessionsByTime from "./SessionsByTime";
import CourtCard from "./components/CourtCard";
import { Grid, Typography, Box } from "@mui/material";

// 👉 นำเข้า courtData
import { courtData } from "./courtData";

function DashboardReserve() {
  // แปลง object -> array เพื่อ map ง่าย ๆ
  const courts = Object.entries(courtData); // [ ['futsal', {...}], ['badminton', {...}], ... ]

  return (
    <>
      <Helmet>
        <title>KMUTNB Court Booking</title>
      </Helmet>

      <PageTitleWrapper>{/* <PageHeader /> */}</PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        {/* ซ้าย: การ์ดสนาม */}
        <Grid item lg={8} md={6} xs={12}>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                flex: "none",
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                fontSize: "1.4rem",
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              }}
            >
              🏟
            </Box>
            <Box>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                ระบบจองสนามกีฬา KMUTNB
              </Typography>
              <Typography variant="body1" color="text.secondary">
                กรุณาเลือกสนามกีฬาที่คุณต้องการจอง จากตัวเลือกด้านล่าง
              </Typography>
            </Box>
          </Box>

          <Grid
            container
            spacing={4}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            {courts.map(([key, info]) => (
              <Grid item sm={6} xs={12} key={key}>
                <CourtCard
                  title={info.name}
                  description={info.description}
                  imageUrl={info.imageUrl}
                  routeSuffix={key} // ใช้ key เป็น courtType ในเส้นทาง
                  id={info.id}
                />
              </Grid>
            ))}
            {/* gym only */}
          </Grid>
        </Grid>

        {/* ขวา: สรุปความหนาแน่น */}
        <Grid item lg={4} md={6} xs={12}>
          <SessionsByTime />
        </Grid>

        {/* ช่องว่างเผื่อขยาย */}
        <Grid item lg={4} md={6} xs={12}></Grid>
      </Grid>

      <Footer />
    </>
  );
}

export default DashboardReserve;
