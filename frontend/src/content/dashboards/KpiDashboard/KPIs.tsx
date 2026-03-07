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
  TablePagination,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import { useTranslation } from "react-i18next";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const TableWrapper = styled(Table)(() => ``);

const LabelError = styled(Box)(
  ({ theme }) => `
    display: inline-block;
    background: ${theme.palette.error.main};
    color: ${theme.palette.error.contrastText};
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(10)};
    font-weight: bold;
    line-height: 23px;
    height: 22px;
    padding: ${theme.spacing(0, 2)};
    border-radius: ${theme.general.borderRadius};
  `
);

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

function Block2({
  onDataFetched,
}: {
  onDataFetched: (rows: ReservationSlot[]) => void;
}) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;
  const [rows, setRows] = useState<ReservationSlot[]>([]);

  const [fromDate, setFromDate] = useState<Dayjs | null>(
    dayjs().subtract(6, "day")
  );
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const [courtType, setCourtType] = useState<string>("");
  const [approveStatus, setApproveStatus] = useState<string>("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      let url = `${baseAPIUrl}/api/admin/reservation-slots/kpis?from=${fromDate?.format(
        "YYYY-MM-DD"
      )}&to=${toDate?.format("YYYY-MM-DD")}`;

      if (courtType) url += `&courtType=${courtType}`;
      if (approveStatus) url += `&approve_status=${approveStatus}`;

      const res = await fetch(url);
      const data = await res.json();
      setRows(data.data || []);
      onDataFetched(data.data || []);
      setPage(0);
      console.log(data.data);
    } catch (err) {
      console.error("Error fetching KPI data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="Approve Status"
                value={approveStatus}
                onChange={(e) => setApproveStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancel">Cancelled</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="no_show">No show</MenuItem>
                <MenuItem value="close">Close</MenuItem>
                <MenuItem value="walk-in">Walk-in</MenuItem>
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

      {/* 📊 Table */}
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
                <TableCell>{t("Remark")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.id} hover>
                    {/* ลำดับ (index running) */}
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    {/* สถานะ */}
                    <TableCell>
                      {row.approve_status === "cancel" ? (
                        <Chip
                          label="Cancelled"
                          color="error"
                          variant="outlined"
                          size="small"
                        />
                      ) : row.approve_status === "approved" ? (
                        <Chip
                          label="Approved"
                          color="success"
                          variant="filled"
                          size="small"
                        />
                      ) : row.approve_status === "pending" ? (
                        <Chip
                          label="Pending"
                          color="warning"
                          variant="outlined"
                          size="small"
                        />
                      ) : row.approve_status === "success" ? (
                        <Chip
                          label="Success"
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      ) : row.approve_status === "no_show" ? (
                        <Chip
                          label="No Show"
                          color="error"
                          variant="filled"
                          size="small"
                        />
                      ) : row.approve_status === "close" ? (
                        <Chip
                          label="Closed"
                          color="default"
                          variant="filled"
                          size="small"
                        />
                      ) : row.approve_status === "walk-in" ? (
                        <Chip
                          label="walk-in"
                          color="info"
                          variant="filled"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label={row.approve_status}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </TableCell>

                    {/* วันที่จอง (ต้องมี created_at ใน DB) */}
                    <TableCell>
                      {row.createdAt
                        ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")
                        : "-"}
                    </TableCell>
                    {/* วันที่ใช้สนาม */}
                    <TableCell>
                      {row.date ? dayjs(row.date).format("DD/MM/YYYY") : "-"} (
                      {row.timeSlot.start_time} - {row.timeSlot.end_time})
                    </TableCell>

                    {/* สนาม */}
                    <TableCell>
                      {row.court.name} <br />
                      <Typography variant="caption" color="text.secondary">
                        {row.court.location}
                      </Typography>
                    </TableCell>
                    {/* หมายเหตุ */}
                    <TableCell>{row.reason || "-"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </TableWrapper>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </Box>
    </Card>
  );
}

export default Block2;
