import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import axios from "axios";

interface Props {
  courtName: string;
  courtCount: number;
  courtIdStart: number;
}

function CloseByDateRange({ courtName, courtCount, courtIdStart }: Props) {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(1, "day"));
  const [selectedCourts, setSelectedCourts] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const handleCheck = (id: number, checked: boolean) => {
    setSelectedCourts((prev) =>
      checked ? [...prev, id] : prev.filter((c) => c !== id)
    );
  };
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setError("กรุณาเลือกวันเริ่มต้นและวันสิ้นสุด");
      return;
    }

    if (selectedCourts.length === 0) {
      setError("กรุณาเลือกสนามอย่างน้อย 1 สนาม");
      return;
    }

    const results: string[] = [];
    const errors: string[] = [];

    for (const courtId of selectedCourts) {
      try {
        const res = await axios.post(
          `${baseUrl}/api/admin/reservation-slots/close-court`,
          {
            court_id: courtId,
            start_date: startDate.format("YYYY-MM-DD"),
            end_date: endDate.format("YYYY-MM-DD"),
            reason: "ปิดสนามทั้งวันโดยผู้ดูแลระบบ",
            booking_status_id: purpose,
          }
        );

        if (res.data?.message) {
          results.push(
            `✅ ${courtName} ${courtId - courtIdStart + 1}: ${res.data.message}`
          );
        } else if (res.data?.error) {
          errors.push(
            `❌ ${courtName} ${courtId - courtIdStart + 1}: ${res.data.error}`
          );
        }
      } catch (err) {
        console.error(err);
        errors.push(
          `❌ ${courtName} ${
            courtId - courtIdStart + 1
          }: เกิดข้อผิดพลาดในการส่งข้อมูล`
        );
      }
    }

    setResult(results.join("\n"));
    setError(errors.length > 0 ? errors.join("\n") : null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ px: 4 }}>
        <Typography variant="h5" gutterBottom>
          🔒 ปิดปรับปรุง {courtName} แบบระบุช่วงวัน
        </Typography>

        {/* 🗓 เลือกช่วงวัน */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="วันเริ่มต้น"
              value={startDate}
              onChange={(newValue) => {
                if (newValue) {
                  setStartDate(newValue);

                  if (endDate && newValue.isAfter(endDate)) {
                    setEndDate(newValue);
                  }
                }
              }}
              maxDate={endDate}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="วันสิ้นสุด"
              value={endDate}
              onChange={(newValue) => {
                if (newValue) {
                  setEndDate(newValue);
                  if (startDate && newValue.isBefore(startDate)) {
                    setStartDate(newValue);
                  }
                }
              }}
              minDate={startDate}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </Grid>
          <TextField
            label="จุดประสงค์ในการจอง"
            fullWidth
            margin="normal"
            select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <MenuItem value="3">กิจกรรมทั้งวัน</MenuItem>
            <MenuItem value="4">ปรับปรุง</MenuItem>
            <MenuItem value="5">ปิดมหาวิทยาลัย</MenuItem>
            <MenuItem value="6">ปิดaaa</MenuItem>
          </TextField>
        </Grid>

        {/* ✅ เลือกสนาม */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          เลือกสนามที่ต้องการปิด:
        </Typography>
        <Grid container spacing={1}>
          {Array.from({ length: courtCount }).map((_, i) => {
            const id = courtIdStart + i;
            const label = `${courtName} ${i + 1}`;
            return (
              <Grid item key={id} xs={6} sm={4} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCourts.includes(id)}
                      onChange={(e) => handleCheck(id, e.target.checked)}
                    />
                  }
                  label={label}
                />
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={selectedCourts.length === 0 || !startDate || !endDate}
          >
            🚨 ยืนยันปิดสนามตามช่วงวัน
          </Button>
        </Box>
        {result && (
          <Box mt={2}>
            <Typography color="success.main" whiteSpace="pre-line">
              {result}
            </Typography>
          </Box>
        )}
        {error && (
          <Box mt={2}>
            <Typography color="error" whiteSpace="pre-line">
              {error}
            </Typography>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
}

export default CloseByDateRange;
