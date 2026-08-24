import { Box, Typography, Grid } from "@mui/material";
import BookingStatus from "./BookingStatus";

function ReservationStatusPage() {
  return (
    <Grid
      sx={{ px: 4, mt: 2 }}
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={4}
    >
      <Grid item xs={12}>
        <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
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
            📅
          </Box>
          <Typography variant="h4">สถานะการจอง</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BookingStatus />
      </Grid>
    </Grid>
  );
}

export default ReservationStatusPage;
