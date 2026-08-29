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
  TextField,
  Button,
  Grid,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import ShowDialog from "./ShowDialog";

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

function CourtUsageSummaryPage({
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openCancel, setOpenCancel] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const fetchData = async () => {
    try {
      let url = `${baseAPIUrl}/api/reservation-slots/usage-summary?courtId=13&start=${fromDate?.format(
        "YYYY-MM-DD"
      )}&end=${toDate?.format("YYYY-MM-DD")}`;

      const res = await fetch(url);
      const data = await res.json();
      setRows(data || []);
      onDataFetched(data || []);
      setPage(0);
      console.log(data);
    } catch (err) {
      console.error("Error fetching KPI data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleshowdata = (slot: any) => {
    console.log("test", slot);
    setSelectedSlot(slot);
    setOpenCancel(true);
  };

  return (
    <>
      <Card>
        <Box
          px={3}
          py={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4">สรุปการใช้งานยิมออกกำลังกาย</Typography>
            <Typography variant="subtitle2">
              ค้นหาจำนวนผู้ใช้บริการตามช่วงวันที่
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
                  <TableCell>ลำดับ</TableCell>
                  <TableCell>วันที่</TableCell>
                  <TableCell>ช่วงเวลา</TableCell>
                  <TableCell>จำนวนผู้ใช้บริการ</TableCell>
                  <TableCell>รายชื่อผู้ใช้บริการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={`${row.date}-${row.time_slot_id}`} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        {dayjs(row.date).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>{row.time_range}</TableCell>
                      <TableCell>{row.total_users}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleshowdata(row)}
                        >
                          ดูรายชื่อ
                        </Button>
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
            labelRowsPerPage="แถวต่อหน้า:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} จาก ${count}`
            }
          />
        </Box>
      </Card>
      <ShowDialog
        open={openCancel}
        slot={selectedSlot}
        onClose={() => {
          setOpenCancel(false);
          setSelectedSlot(null);
        }}
      />
    </>
  );
}

export default CourtUsageSummaryPage;
