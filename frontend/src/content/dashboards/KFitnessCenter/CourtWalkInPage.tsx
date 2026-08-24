import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";

interface WalkInRecord {
  id: number;
  student_id: string;
  name: string;
  lastname: string;
  type: string;
  time_range: string;
}

function CourtWalkInPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [timeRange, setTimeRange] = useState("");
  const strnow = dayjs().format("DD-MM-YYYY");

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("TestWalkin");
  const [studentLastname, setStudentLastname] = useState("TestWalkin");
  const [studentType, setStudentType] = useState("TestWalkinicit");
  const [walkInRows, setWalkInRows] = useState<WalkInRecord[]>([]);
  const studentIdRef = useRef<HTMLInputElement>(null);
  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchData = async () => {
    try {
      const today = dayjs().format("YYYY-MM-DD"); // วันนี้

      let url = `${baseAPIUrl}/api/reservation-slots/usage-summary?courtId=13&start=${today}&end=${today}`;

      const res = await fetch(url);
      const data = await res.json();

      const newRecords: WalkInRecord[] = (data || []).flatMap((item: any) => {
        if (!item.user_list) return [];

        return item.user_list
          .split(",")
          .map((entry: string) => {
            const match = entry.trim().match(/^(.*)\s+\((.+)\)$/);
            if (!match) return null;

            return {
              id: Date.now() + Math.random(), // ให้ id ไม่ซ้ำ
              student_name: match[1].trim(),
              student_id: match[2].trim(),
              lastname: "",
              type: "",
              time_range: item.time_range,
            };
          })
          .filter(Boolean);
      });

      setWalkInRows((prev) => [...prev, ...newRecords]);
      console.log("✅ ข้อมูลใหม่:", newRecords);
    } catch (err) {
      console.error("Error fetching KPI data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const now = dayjs();
    const hour = now.hour();
    const minute = now.minute();
    const startHour = minute >= 0 ? hour : hour - 1;
    const timeStr = `${String(startHour).padStart(2, "0")}:00 - ${String(
      startHour + 1
    ).padStart(2, "0")}:00`;
    setTimeRange(timeStr);
  }, []);

  const handleStudentIdChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const id = e.target.value;
    setStudentId(id);
  };

  const handleSave = async () => {
    if (!studentId || !studentName || !timeRange) return;

    try {
      const startHour = parseInt(timeRange.split(":")[0], 10);
      const timeSlotId = startHour - 7; // 08:00 → 1

      const payload = {
        student_id: studentId,
        student_name: studentName,
        icit: studentType,
        bookingStatusId: 7, // walk-in
        slots: [
          {
            court_id: 13, // Gym
            time_slot_id: timeSlotId,
            date: dayjs().format("YYYY-MM-DD"),
            approve_status: "walk-in",
          },
        ],
      };

      const res = await axios.post(`${baseAPIUrl}/api/reservations`, payload);

      const newItem: WalkInRecord = {
        id: Date.now(),
        student_id: studentId,
        name: studentName,
        lastname: studentLastname,
        type: studentType,
        time_range: timeRange,
      };
      setWalkInRows((prev) => [...prev, newItem]);
      setStudentId("");
      studentIdRef.current?.focus();

      enqueueSnackbar("✅ บันทึกข้อมูล Walk-in สำเร็จ", { variant: "success" });
      console.log("✅ บันทึกสำเร็จ", res.data);
    } catch (err: any) {
      console.error("❌ บันทึกไม่สำเร็จ:", err);
      enqueueSnackbar("❌ การจองและ walkin ครบจำนวน 30 คนแล้ว", {
        variant: "error",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Typography variant="h5" gutterBottom>
          🚶‍♂️ แบบฟอร์ม Walk-in
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="วัน" value={strnow} disabled />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="ช่วงเวลา" value={timeRange} disabled />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="รหัสประจำตัวนักศึกษา"
              value={studentId}
              inputRef={studentIdRef}
              onChange={handleStudentIdChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="ชื่อ" value={studentName} disabled />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="นามสกุล"
              value={studentLastname}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="ประเภท" value={studentType} disabled />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              บันทึกการเข้าใช้งาน
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <Box sx={{ p: { xs: 2.5, sm: 4 }, pb: 2 }}>
          <Typography variant="h5">รายชื่อผู้ใช้บริการ Walk-in</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ลำดับ</TableCell>
                <TableCell>ช่วงเวลา</TableCell>
                <TableCell>รหัสนักศึกษา</TableCell>
                <TableCell>ชื่อ</TableCell>
                <TableCell>นามสกุล</TableCell>
                <TableCell>ประเภท</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {walkInRows.map((row, index) => (
                <TableRow key={row.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.time_range}</TableCell>
                  <TableCell>{row.student_id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.lastname}</TableCell>
                  <TableCell>{row.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default CourtWalkInPage;
