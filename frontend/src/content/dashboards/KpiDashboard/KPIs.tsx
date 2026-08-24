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
  TextField,
  MenuItem,
  Button,
  Grid,
  TablePagination,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const COURT_TYPES = [
  { value: "BADMINTON", label: "แบดมินตัน" },
  { value: "VOLLEYBALL", label: "วอลเลย์บอล" },
  { value: "BASKETBALL", label: "บาสเกตบอล" },
  { value: "FUTSAL", label: "ฟุตซอล" },
  { value: "BOXING", label: "มวย" },
  { value: "JUDO", label: "ยูโด" },
  { value: "TENNIS", label: "เทนนิส" },
  { value: "FOOTBALL", label: "ฟุตบอล" },
  { value: "GYM", label: "ยิม" },
];

const STATUS_CHIP: Record<
  string,
  { label: string; color: "error" | "success" | "warning" | "default" | "info"; variant: "filled" | "outlined" }
> = {
  cancel: { label: "ยกเลิก", color: "error", variant: "outlined" },
  approved: { label: "อนุมัติแล้ว", color: "success", variant: "filled" },
  pending: { label: "รออนุมัติ", color: "warning", variant: "outlined" },
  success: { label: "สำเร็จ", color: "success", variant: "outlined" },
  no_show: { label: "ไม่มาใช้บริการ", color: "error", variant: "filled" },
  close: { label: "ปิด", color: "default", variant: "filled" },
  "walk-in": { label: "Walk-in", color: "info", variant: "filled" },
};

interface ReservationSlot {
  id: number;
  date: string;
  approve_status: string;
  createdAt?: string;
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
      <Box px={3} py={2}>
        <Typography variant="h4">ตารางรายการจอง</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          กรองรายการจองตามช่วงวันที่ ประเภทสนาม และสถานะ
        </Typography>
      </Box>
      <Divider />

      {/* 🔎 Filter Controls */}
      <Box px={3} py={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <DatePicker
                label="ตั้งแต่วันที่"
                value={fromDate}
                onChange={(newVal) => setFromDate(newVal)}
                maxDate={toDate}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="ถึงวันที่"
                value={toDate}
                onChange={(newVal) => setToDate(newVal)}
                minDate={fromDate}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="ประเภทสนาม"
                value={courtType}
                onChange={(e) => setCourtType(e.target.value)}
                fullWidth
              >
                <MenuItem value="">ทุกประเภทสนาม</MenuItem>
                {COURT_TYPES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                select
                label="สถานะ"
                value={approveStatus}
                onChange={(e) => setApproveStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value="">ทุกสถานะ</MenuItem>
                {Object.entries(STATUS_CHIP).map(([value, { label }]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button variant="contained" fullWidth onClick={fetchData}>
                ค้นหา
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>

      <Divider />

      {/* 📊 Table */}
      <Box px={3} pb={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ลำดับ</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>วันที่จอง</TableCell>
                <TableCell>วันเวลาที่ใช้สนาม</TableCell>
                <TableCell>สนาม</TableCell>
                <TableCell>หมายเหตุ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      ไม่พบรายการจองตามเงื่อนไขที่เลือก
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const status =
                    STATUS_CHIP[row.approve_status] ?? {
                      label: row.approve_status,
                      color: "default" as const,
                      variant: "outlined" as const,
                    };
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          variant={status.variant}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {row.createdAt
                          ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {row.date ? dayjs(row.date).format("DD/MM/YYYY") : "-"}{" "}
                        ({row.timeSlot.start_time} - {row.timeSlot.end_time})
                      </TableCell>
                      <TableCell>
                        {row.court.name} <br />
                        <Typography variant="caption" color="text.secondary">
                          {row.court.location}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.reason || "-"}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
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
          labelRowsPerPage="แถวต่อหน้า"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} จาก ${count}`
          }
        />
      </Box>
    </Card>
  );
}

export default Block2;
