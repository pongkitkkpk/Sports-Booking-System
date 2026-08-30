import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Checkbox,
  Stack,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { authHeader } from "../../../utils/authHeader";
interface ReservationSlot {
  id: number;
  date: string;
  reservation: { student_id: string; student_name: string };
  court: { name: string; location: string };
  timeSlot: { start_time: string; end_time: string };
  approve_status: string;
}

function UnbanTable() {
  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;
  const [rows, setRows] = useState<ReservationSlot[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const [courtType, setCourtType] = useState<string>("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(
    dayjs().subtract(6, "day")
  );
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const fetchPending = async () => {
    setLoading(true);
    try {
      const from = fromDate ? fromDate.format("YYYY-MM-DD") : "";
      const to = toDate ? toDate.format("YYYY-MM-DD") : "";

      let url = `${baseAPIUrl}/api/admin/reservation-slots/banned`;
      if (from) url += `?from=${from}`;
      if (to) url += `&to=${to}`;
      if (courtType) url += `&courtType=${courtType}`;

      const res = await fetch(url, { headers: authHeader() });
      const data = await res.json();
      setRows(data || []);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPending();
  }, [courtType, fromDate, toDate]);

  const handleUnban = async (id: number) => {
    await fetch(`${baseAPIUrl}/api/admin/reservation-slots/${id}/unban`, {
      method: "PATCH",
      headers: authHeader(),
    });
    fetchPending();
  };

  const handleBulkUnban = async () => {
    await Promise.all(
      selectedIds.map((id) =>
        fetch(`${baseAPIUrl}/api/admin/reservation-slots/${id}/unban`, {
          method: "PATCH",
          headers: authHeader(),
        })
      )
    );
    fetchPending();
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(rows.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Card>
        <Box p={3}>
          <Typography variant="h4">รายชื่อผู้ถูกระงับสิทธิ์</Typography>
          <Typography variant="subtitle2">
            ค้นหาและยกเลิกการระงับสิทธิ์การใช้สนามของนักศึกษา
          </Typography>
        </Box>

        {/* ✅ Filter */}
        <Box px={3} pb={2}>
          <Grid container spacing={2}>
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
              </TextField>
            </Grid>

            {/* ✅ From Date */}
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker<dayjs.Dayjs>
                  label="From Date"
                  value={fromDate}
                  onChange={(newVal) => setFromDate(newVal)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            {/* ✅ To Date */}
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker<dayjs.Dayjs>
                  label="To Date"
                  value={toDate}
                  onChange={(newVal) => setToDate(newVal)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedIds.length > 0 && selectedIds.length < rows.length
                    }
                    checked={
                      rows.length > 0 && selectedIds.length === rows.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>#</TableCell>
                <TableCell>นักศึกษา</TableCell>
                <TableCell>สนาม</TableCell>
                <TableCell>เวลาที่ใช้งาน</TableCell>
                <TableCell align="center">การดำเนินการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      ไม่มีผู้ถูกระงับสิทธิ์ในช่วงวันที่นี้
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                rows.map((row: any, index) =>
                row.slots.map((slot: any, idx: number) => (
                  <TableRow key={`${row.id}-${slot.id}`} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onChange={() => handleSelectOne(row.id)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {row.student_name} <br />
                      <Typography variant="caption" color="text.secondary">
                        {row.student_id}
                      </Typography>
                    </TableCell>
                    <TableCell>{slot.court.name}</TableCell>
                    <TableCell>
                      {dayjs(slot.date).format("DD/MM/YYYY")} (
                      {slot.timeSlot.start_time.slice(0, 5)} -{" "}
                      {slot.timeSlot.end_time.slice(0, 5)})
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleUnban(row.id)}
                      >
                        ยกเลิกการระงับสิทธิ์
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Bulk Actions */}
        {selectedIds.length > 0 && (
          <Box px={3} pb={2}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                onClick={handleBulkUnban}
              >
                ยกเลิกการระงับสิทธิ์ที่เลือก ({selectedIds.length})
              </Button>
            </Stack>
          </Box>
        )}
      </Card>
    </>
  );
}

export default UnbanTable;
