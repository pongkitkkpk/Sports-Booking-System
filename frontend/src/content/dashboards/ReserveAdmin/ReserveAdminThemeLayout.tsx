import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Box, ThemeProvider, useTheme } from "@mui/material";
import { createKmutnbTheme } from "../../../theme/kmutnbTheme";

// Wraps every /reserve-admin/* route in the same KMUTNB-red theme used by
// the booking pages, without touching the base theme used by the rest of
// the admin template.
function ReserveAdminThemeLayout() {
  const baseTheme = useTheme();
  const adminTheme = useMemo(() => createKmutnbTheme(baseTheme), [baseTheme]);

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100%" }}>
        <Outlet />
      </Box>
    </ThemeProvider>
  );
}

export default ReserveAdminThemeLayout;
