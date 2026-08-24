import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import { Grid, Tabs, Tab, Box } from "@mui/material";
import Footer from "../../../components/Footer";
import PageTitleWrapper from "../../../components/PageTitleWrapper";
import { useState } from "react";

import Block2 from "./KPIs"; // KPI Table
import Block7 from "./Block7"; // KPI Chart
import ApprovalTable from "./ApprovalTable";

function DashboardHybrid() {
  const [rows, setRows] = useState<any[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Helmet>
        <title>สรุปการใช้สนาม - ระบบจองสนามกีฬา KMUTNB</title>
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
          <Tab label="📊 รายงานสรุป" />
          <Tab label="✅ รออนุมัติ" />
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
            <Block7 rows={rows} />
          </Grid>
          <Grid item xs={12}>
            <Block2 onDataFetched={setRows} />
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
          {/* Pending Approval */}
          <Grid item xs={12}>
            <ApprovalTable />
          </Grid>
        </Grid>
      )}

      <Footer />
    </>
  );
}

export default DashboardHybrid;
