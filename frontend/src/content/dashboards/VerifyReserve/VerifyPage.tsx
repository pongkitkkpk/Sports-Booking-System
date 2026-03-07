import {
  Divider,
  Box,
  Card,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  IconButton,
  styled,
  useTheme,
  TextField,
  MenuItem,
  Button,
  Grid,
  Chip,
  TablePagination,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import { useTranslation } from "react-i18next";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import NoShowReasonDialog from "./NoshowReasonDialog";
import { useSnackbar } from "notistack";

const TableWrapper = styled(Table)(() => ``);

interface ReservationSlot {
  id: number;
  date: string;
  approve_status: string;
  created_at?: string;
  reservation: {
    student_id: string;
    student_name: string;
    icit: string;
    bookingStatus: { description: string };
  };
  court: {
    name: string;
    location: string;
  };
  timeSlot: {
    start_time: string;
    end_time: string;
  };
  reason?: string;
}

function VerifyPage({
  onDataFetched,
}: {
  onDataFetched: (rows: ReservationSlot[]) => void;
}) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;
  const [rows, setRows] = useState<ReservationSlot[]>([]);
  const [fromDate, setFromDate] = useState<Dayjs | null>(
    dayjs().subtract(6, "day")
  );
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const [courtType, setCourtType] = useState<string>("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openReason, setOpenReason] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ReservationSlot | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<"reject" | "noshow">("reject");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      let url = `${baseAPIUrl}/api/admin/reservation-slots/kpis?from=${fromDate?.format(
        "YYYY-MM-DD"
      )}&to=${toDate?.format("YYYY-MM-DD")}`;

      if (courtType) url += `&courtType=${courtType}`;
      url += `&approve_status=approved`;

      const res = await fetch(url);
      const data = await res.json();
      setRows(data.data || []);
      onDataFetched(data.data || []);
      setPage(0);
    } catch (err) {
      console.error("Error fetching KPI data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyNoShow = async (id: number, reason: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `${baseAPIUrl}/api/admin/reservation-slots/${id}/verifynoshow`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        }
      );
      if (!res.ok) throw new Error("No Show failed");
      enqueueSnackbar("บันทึก No Show สำเร็จ ✅", { variant: "success" });
      fetchData();
    } catch (err) {
      enqueueSnackbar("บันทึก No Show ล้มเหลว ❌", { variant: "error" });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyReject = async (id: number, reason: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `${baseAPIUrl}/api/admin/reservation-slots/${id}/reject`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        }
      );
      if (!res.ok) throw new Error("Reject failed");
      enqueueSnackbar("ระงับการจองสำเร็จ ✅", { variant: "success" });
      fetchData();
    } catch (err) {
      enqueueSnackbar("ระงับการจองล้มเหลว ❌", { variant: "error" });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySuccess = async (id: number) => {
    try {
      const res = await fetch(
        `${baseAPIUrl}/api/admin/reservation-slots/${id}/verifysuccess`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Success failed");
      enqueueSnackbar("บันทึกการใช้งานสำเร็จ ✅", { variant: "success" });
      fetchData();
    } catch (err) {
      enqueueSnackbar("บันทึกการใช้งานล้มเหลว ❌", { variant: "error" });
      console.error(err);
    }
  };

  return (
    <Card>
      <Box
        px={3}
        py={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h4">{t("Reservation KPIs")}</Typography>
          <Typography variant="subtitle2">
            {t("Summary of reservations by filters")}
          </Typography>
        </Box>
        <IconButton color="primary">
          <MoreVertTwoToneIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* 🔎 Filter Controls */}
      <Box px={3} py={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(newVal) => setFromDate(newVal)}
                maxDate={toDate}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newVal) => setToDate(newVal)}
                minDate={fromDate}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Court Type"
                value={courtType}
                onChange={(e) => setCourtType(e.target.value)}
                fullWidth
              >
                <MenuItem value="">All Courts</MenuItem>
                <MenuItem value="BADMINTON">Badminton</MenuItem>
                <MenuItem value="VOLLEYBALL">Volleyball</MenuItem>
                <MenuItem value="BASKETBALL">Basketball</MenuItem>
                <MenuItem value="FUTSAL">Futsal</MenuItem>
                <MenuItem value="BOXING">Boxing</MenuItem>
                <MenuItem value="JUDO">Judo</MenuItem>
                <MenuItem value="TENNIS">Tennis</MenuItem>
                <MenuItem value="FOOTBALL">Football</MenuItem>
                <MenuItem value="GYM">Gym</MenuItem>

                {/* ✅ เพิ่ม courtType ได้ตามจริง */}
              </TextField>
            </Grid>

            <Grid item xs={12} md={1}>
              <Button variant="contained" fullWidth onClick={fetchData}>
                Search
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>

      <Divider />

      <Box px={3} pb={1}>
        <TableContainer>
          <TableWrapper>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{t("Status")}</TableCell>
                <TableCell>{t("Booking Date")}</TableCell>
                <TableCell>{t("Usage Date & Time")}</TableCell>
                <TableCell>{t("Court")}</TableCell>
                <TableCell>{t("Actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Chip label={row.approve_status} size="small" />
                    </TableCell>
                    <TableCell>
                      {row.created_at
                        ? dayjs(row.created_at).format("DD/MM/YYYY HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {row.date ? dayjs(row.date).format("DD/MM/YYYY") : "-"} (
                      {row.timeSlot.start_time} - {row.timeSlot.end_time})
                    </TableCell>
                    <TableCell>
                      {row.court.name}
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {row.court.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleVerifySuccess(row.id)}
                        >
                          สำเร็จ
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            setSelectedSlot(row);
                            setDialogMode("reject");
                            setOpenReason(true);
                          }}
                        >
                          ระงับ
                        </Button>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={() => {
                            setSelectedSlot(row);
                            setDialogMode("noshow");
                            setOpenReason(true);
                          }}
                        >
                          No Show
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TableWrapper>
        </TableContainer>

        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />

        {/* Reason Dialog */}
        <NoShowReasonDialog
          open={openReason}
          slot={selectedSlot}
          onClose={() => setOpenReason(false)}
          onSubmit={async (reason: string) => {
            if (!selectedSlot) return;
            if (dialogMode === "noshow") {
              await handleVerifyNoShow(selectedSlot.id, reason);
            } else {
              await handleVerifyReject(selectedSlot.id, reason);
            }
            setOpenReason(false);
          }}
          submitting={submitting}
          mode={dialogMode}
        />
      </Box>
    </Card>
  );
}

export default VerifyPage;
