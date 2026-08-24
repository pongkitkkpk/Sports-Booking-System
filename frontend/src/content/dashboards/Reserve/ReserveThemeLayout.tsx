import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Box, ThemeProvider, useTheme } from "@mui/material";
import { createKmutnbTheme } from "../../../theme/kmutnbTheme";

// Wraps every /reserve/* route in the KMUTNB-red theme borrowed from DMS_c,
// without touching the base theme used by the rest of the admin template.
function ReserveThemeLayout() {
  const baseTheme = useTheme();
  const reserveTheme = useMemo(() => createKmutnbTheme(baseTheme), [baseTheme]);

  return (
    <ThemeProvider theme={reserveTheme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100%" }}>
        <Outlet />
      </Box>
    </ThemeProvider>
  );
}

export default ReserveThemeLayout;
