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
} from "@mui/material";
import { useEffect, useState } from "react";
import CancelReasonDialog from "./CancelReasonDialog";
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

function ApprovalTable() {
  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;
  const [rows, setRows] = useState<ReservationSlot[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openCancel, setOpenCancel] = useState(false);
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const [courtType, setCourtType] = useState<string>("");
  const [fromDate, setFromDate] = useState<Dayjs | null>(
    dayjs().subtract(6, "day")
  );
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const fetchPending = async () => {
    const from = fromDate ? fromDate.format("YYYY-MM-DD") : "";
    const to = toDate ? toDate.format("YYYY-MM-DD") : "";

    let url = `${baseAPIUrl}/api/admin/reservation-slots/kpis?approve_status=pending`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;
    if (courtType) url += `&courtType=${courtType}`;

    const res = await fetch(url, { headers: authHeader() });
    const data = await res.json();
    setRows(data.data || []);
    setSelectedIds([]);
  };
  useEffect(() => {
    fetchPending();
  }, [courtType, fromDate, toDate]);

  const handleApprove = async (id: number) => {
    await fetch(`${baseAPIUrl}/api/admin/reservation-slots/${id}/approve`, {
      method: "PATCH",
      headers: authHeader(),
    });
    fetchPending();
  };

  const handleBulkApprove = async () => {
    await Promise.all(
      selectedIds.map((id) =>
        fetch(`${baseAPIUrl}/api/admin/reservation-slots/${id}/approve`, {
          method: "PATCH",
          headers: authHeader(),
        })
      )
    );
    fetchPending();
  };

  const handleSubmitCancel = async (reason: string) => {
    try {
      setSubmittingCancel(true);
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`${baseAPIUrl}/api/admin/reservation-slots/${id}/reject`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", ...authHeader() },
            body: JSON.stringify({ reason }),
          })
        )
      );
      setOpenCancel(false);
      setSelectedIds([]);
      fetchPending();
    } finally {
      setSubmittingCancel(false);
    }
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
          <Typography variant="h4">Pending Approvals</Typography>
          <Typography variant="subtitle2">
            Manage reservations waiting for admin approval
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
                <TableCell>Student</TableCell>
                <TableCell>Court</TableCell>
                <TableCell>Usage Time</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {row.reservation.student_name} <br />
                    <Typography variant="caption" color="text.secondary">
                      {row.reservation.student_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {row.court.name} <br />
                    <Typography variant="caption" color="text.secondary">
                      {row.court.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {dayjs(row.date).format("DD/MM/YYYY")} (
                    {row.timeSlot.start_time.slice(0, 5)} -{" "}
                    {row.timeSlot.end_time.slice(0, 5)})
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleApprove(row.id)}
                    >
                      Approve
                    </Button>
                    &nbsp;
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        setSelectedIds([row.id]);
                        setOpenCancel(true);
                      }}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
                onClick={handleBulkApprove}
              >
                Approve Selected ({selectedIds.length})
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenCancel(true)}
              >
                Reject Selected ({selectedIds.length})
              </Button>
            </Stack>
          </Box>
        )}
      </Card>

      {/* ✅ Popup Dialog สำหรับ Bulk Reject */}
      <CancelReasonDialog
        open={openCancel}
        slot={null}
        onClose={() => {
          setOpenCancel(false);
          setSelectedIds([]);
        }}
        onSubmit={handleSubmitCancel}
        submitting={submittingCancel}
      />
    </>
  );
}

export default ApprovalTable;
