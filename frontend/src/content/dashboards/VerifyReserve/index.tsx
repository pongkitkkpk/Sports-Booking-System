import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import { Grid, Tabs, Tab, Box } from "@mui/material";
import Footer from "../../../components/Footer";
import PageTitleWrapper from "../../../components/PageTitleWrapper";
import { useState } from "react";

import VerifyPage from "./VerifyPage";
import UnbanTable from "./UnbanTable";

function DashboardHybrid() {
  const [rows, setRows] = useState<any[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Helmet>
        <title>Verify Admin Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      {/* Tabs */}
      <Box px={4}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="📊 ยืนยันตัวตนเข้าใช้สนาม" />
          <Tab label="✅ จัดการสิทธิ์ผู้ขอใช้สนาม" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <Grid
          sx={{ px: 4, mt: 2 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          {/* KPI Report */}
          <Grid item xs={12}>
            <VerifyPage onDataFetched={setRows} />
          </Grid>
          {/* <Grid item xs={12}>
            <Block7 rows={rows} />
          </Grid> */}
        </Grid>
      )}

      {tabIndex === 1 && (
        <Grid
          sx={{ px: 4, mt: 2 }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          {/* Pending Approval */}
          <Grid item xs={12}>
            <UnbanTable />
          </Grid>
        </Grid>
      )}

      <Footer />
    </>
  );
}

export default DashboardHybrid;
