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
  styled,
  TextField,
  MenuItem,
  Button,
  Grid,
  Chip,
  TablePagination,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import NoShowReasonDialog from "./NoshowReasonDialog";
import { useSnackbar } from "notistack";
import { authHeader } from "../../../utils/authHeader";

const TableWrapper = styled(Table)(() => ``);

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

const APPROVE_STATUS_LABEL: Record<string, { label: string; color: any }> = {
  pending: { label: "รอดำเนินการ", color: "warning" },
  approved: { label: "อนุมัติแล้ว", color: "info" },
  success: { label: "สำเร็จ", color: "success" },
  rejected: { label: "ถูกระงับ", color: "error" },
  no_show: { label: "ไม่มาใช้บริการ", color: "default" },
  cancel: { label: "ยกเลิก", color: "default" },
  close: { label: "ปิด", color: "default" },
  "walk-in": { label: "หน้างาน", color: "secondary" },
};

function VerifyPage({
  onDataFetched,
}: {
  onDataFetched: (rows: ReservationSlot[]) => void;
}) {
  const { enqueueSnackbar } = useSnackbar();

  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;
  const [rows, setRows] = useState<ReservationSlot[]>([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      let url = `${baseAPIUrl}/api/admin/reservation-slots/kpis?from=${fromDate?.format(
        "YYYY-MM-DD"
      )}&to=${toDate?.format("YYYY-MM-DD")}`;

      if (courtType) url += `&courtType=${courtType}`;
      url += `&approve_status=approved`;

      const res = await fetch(url, { headers: authHeader() });
      const data = await res.json();
      setRows(data.data || []);
      onDataFetched(data.data || []);
      setPage(0);
    } catch (err) {
      console.error("Error fetching KPI data:", err);
      enqueueSnackbar("❌ ไม่สามารถดึงรายการได้", { variant: "error" });
    } finally {
      setLoading(false);
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
          headers: { "Content-Type": "application/json", ...authHeader() },
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
          headers: { "Content-Type": "application/json", ...authHeader() },
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
        { method: "PATCH", headers: authHeader() }
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
      <Box px={3} py={2}>
        <Typography variant="h4">รายการรอยืนยันตัวตน</Typography>
        <Typography variant="subtitle2">
          ค้นหาและยืนยันการเข้าใช้สนามตามช่วงวันที่
        </Typography>
      </Box>
      <Divider />

      {/* 🔎 Filter Controls */}
      <Box px={3} py={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <DatePicker
                label="วันที่เริ่มต้น"
                value={fromDate}
                onChange={(newVal) => setFromDate(newVal)}
                maxDate={toDate}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="วันที่สิ้นสุด"
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
                <MenuItem value="">ทุกสนาม</MenuItem>
                <MenuItem value="BADMINTON">แบดมินตัน</MenuItem>
                <MenuItem value="VOLLEYBALL">วอลเลย์บอล</MenuItem>
                <MenuItem value="BASKETBALL">บาสเกตบอล</MenuItem>
                <MenuItem value="FUTSAL">ฟุตซอล</MenuItem>
                <MenuItem value="BOXING">มวย</MenuItem>
                <MenuItem value="JUDO">ยูโด</MenuItem>
                <MenuItem value="TENNIS">เทนนิส</MenuItem>
                <MenuItem value="FOOTBALL">ฟุตบอล</MenuItem>
                <MenuItem value="GYM">ยิมออกกำลังกาย</MenuItem>

                {/* ✅ เพิ่ม courtType ได้ตามจริง */}
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

      <Box px={3} pb={1}>
        <TableContainer>
          <TableWrapper>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>วันที่ทำรายการ</TableCell>
                <TableCell>วันเวลาที่ใช้งาน</TableCell>
                <TableCell>สนาม</TableCell>
                <TableCell>การดำเนินการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      ไม่มีรายการรอยืนยันตัวตนในช่วงวันที่นี้
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          APPROVE_STATUS_LABEL[row.approve_status]?.label ??
                          row.approve_status
                        }
                        color={
                          APPROVE_STATUS_LABEL[row.approve_status]?.color ??
                          "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {row.createdAt
                        ? dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")
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
                          ไม่มาใช้บริการ
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
          labelRowsPerPage="แถวต่อหน้า:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} จาก ${count}`
          }
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
