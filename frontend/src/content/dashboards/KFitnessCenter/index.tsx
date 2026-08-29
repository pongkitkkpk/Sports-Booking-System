import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import { Grid, Tabs, Tab, Box } from "@mui/material";
import Footer from "../../../components/Footer";
import PageTitleWrapper from "../../../components/PageTitleWrapper";
import { useState } from "react";

import CourtUsageSummaryPage from "./CourtUsageSummaryPage";
import CourtWalkInPage from "./CourtWalkInPage";
function DashboardHybrid() {
  const [rows, setRows] = useState<any[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <>
      <Helmet>
        <title>KMUTNB Fitness Center</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Box px={4}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="📊 สรุปการใช้งาน" />
          <Tab label="🚶‍♂️ ผู้ใช้บริการหน้างาน" />
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
            <CourtUsageSummaryPage onDataFetched={setRows} />
          </Grid>
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
          <Grid item xs={12}>
            <CourtWalkInPage />
          </Grid>
        </Grid>
      )}

      <Footer />
    </>
  );
}

export default DashboardHybrid;
