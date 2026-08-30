import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  TextField,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";

interface Props {
  courtType: string;
  courtInfo: {
    name: string;
    imageUrl: string;
    description: string;
  };

  capacityPerSlot?: number;
}

const MAX_DEFAULT = 30;

const ICIT_OPTIONS = [
  "ICIT คณะเทคโนโลยีอุตสาหกรรม",
  "FIT คณะเทคโนโลยีสารสนเทศ",
  "FTE คณะวิศวกรรมศาสตร์",
  "FIB คณะบริหารธุรกิจ",
  "อื่น ๆ",
];

type SlotStatus = "available" | "reserved" | "closed" | "maintenance";

const HeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 600,
    textAlign: "center",
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const BodyCell = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  textAlign: "center",
  padding: theme.spacing(0.5),
}));

const CourtCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  whiteSpace: "nowrap",
  borderRight: `1px solid ${theme.palette.divider}`,
}));

function buildTimeSlots(start = 8, end = 20) {
  const slots: string[] = [];
  for (let h = start; h < end; h++) {
    const from = `${String(h).padStart(2, "0")}:00`;
    const to = `${String(h + 1).padStart(2, "0")}:00`;
    slots.push(`${from} - ${to}`);
  }
  return slots;
}

function ReserveGymForm({
  courtType,
  courtInfo,
  capacityPerSlot = MAX_DEFAULT,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const baseLayout = location.pathname.split("/")[1];

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const { enqueueSnackbar } = useSnackbar();
  const slots = useMemo(() => buildTimeSlots(8, 20), []);
  const [lastUpdated, setLastUpdated] = useState(dayjs().format("HH:mm:ss"));

  const [statusRow, setStatusRow] = useState<SlotStatus[]>(() =>
    Array(slots.length).fill("available")
  );

  const [reservedCounts, setReservedCounts] = useState<number[]>(() =>
    Array(slots.length).fill(0)
  );

  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const toggleSelect = (slotIdx: number, v: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };

      setReservedCounts((prevCounts) => {
        const newCounts = [...prevCounts];
        if (v) {
          // if (Object.keys(prev).length >= 3) {
          //   enqueueSnackbar("❗ คุณสามารถจองได้ไม่เกิน 3 ช่วงเวลา", {
          //     variant: "warning",
          //     autoHideDuration: 1500,
          //     anchorOrigin: {
          //       vertical: "top",
          //       horizontal: "center",
          //     },
          //   });
          //   return prev;
          // }
          newCounts[slotIdx] += 1;
          next[slotIdx] = true;
        } else {
          newCounts[slotIdx] = Math.max(0, newCounts[slotIdx] - 1);
          delete next[slotIdx];
        }
        return newCounts;
      });

      return next;
    });
  };

  useEffect(() => {
    const id = setInterval(
      () => setLastUpdated(dayjs().format("HH:mm:ss")),
      120000
    );
    return () => clearInterval(id);
  }, []);

  const selectedCount = Object.keys(selected).length;

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [icit, setIcit] = useState("");
  const handleSubmit = async () => {
    if (!selectedCount) return;
    if (!studentId || !studentName || !icit) {
      enqueueSnackbar("❗ กรุณากรอกข้อมูลให้ครบถ้วน", { variant: "warning" });
      return;
    }

    try {
      const payload = {
        student_id: studentId,
        student_name: studentName,
        icit: icit,
        bookingStatusId: 1,
        slots: Object.keys(selected).map((slotIdxStr) => {
          const time_slot_id = Number(slotIdxStr) + 1;
          return {
            court_id: 13,
            time_slot_id,
            date: selectedDate.format("YYYY-MM-DD"),
          };
        }),
      };

      const res = await axios.post(`${baseAPIUrl}/api/reservations`, payload);

      enqueueSnackbar("✅ จองสำเร็จ", { variant: "success" });

      navigate(`/${baseLayout}/dashboards/reserve-admin`, {
        state: { items: payload.slots },
      });
    } catch (err: any) {
      console.error("❌ จองไม่สำเร็จ:", err);
      const msg =
        err?.response?.data?.message || "เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่";
      enqueueSnackbar(`❌ ${msg}`, { variant: "error" });
    }
  };

  const renderCell = (slotIdx: number) => {
    const st = statusRow[slotIdx];
    const reserved = reservedCounts[slotIdx];
    const full = reserved >= capacityPerSlot;

    if (st === "closed") {
      return (
        <Box
          sx={{
            bgcolor: "#4A4744",
            color: "#fff",
            borderRadius: 1,
            minHeight: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 1,
            fontWeight: 600,
          }}
        >
          close
        </Box>
      );
    }

    if (st === "maintenance") {
      return (
        <Box
          sx={{
            bgcolor: "#92620A",
            color: "#fff",
            borderRadius: 1,
            minHeight: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 1,
            fontWeight: 600,
          }}
        >
          งานช่างซ่อม
        </Box>
      );
    }

    if (full) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "#8A1C12",
              color: "#fff",
              borderRadius: 1,
              minHeight: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              fontWeight: 600,
              width: "100%",
            }}
          >
            เต็ม
          </Box>
          <Typography variant="caption" sx={{ mt: 0.5 }}>
            ({reserved}/{capacityPerSlot})
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Checkbox
          checked={!!selected[slotIdx]}
          onChange={(e) => toggleSelect(slotIdx, e.target.checked)}
        />
        <Typography variant="caption" sx={{ mt: -0.5 }}>
          ({reserved}/{capacityPerSlot})
        </Typography>
      </Box>
    );
  };
  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const res = await axios.get(
          `${baseAPIUrl}/api/reservation-slots/gym-by-date?date=${selectedDate.format(
            "YYYY-MM-DD"
          )}`
        );

        const data: { timeSlotId: number; count: number }[] = res.data;

        const timeSlotIdToIndex: Record<number, number> = {};
        slots.forEach((_, idx) => {
          timeSlotIdToIndex[idx + 1] = idx;
        });

        const newCounts = Array(slots.length).fill(0);
        const newStatus: SlotStatus[] = Array(slots.length).fill("available");

        const hourToIndex = (hour: number) => hour - 6;

        for (const { time_slot_id, reserved } of res.data) {
          const slotHour = time_slot_id + 5;
          const idx = hourToIndex(slotHour);
          if (idx >= 0 && idx < slots.length) {
            newCounts[idx] = reserved;
            if (reserved >= capacityPerSlot) {
              newStatus[idx] = "reserved";
            }
          }
        }

        setReservedCounts(newCounts);
        setStatusRow(newStatus);
      } catch (err) {
        console.error("โหลดข้อมูล gym ผิดพลาด:", err);
      }
    };

    fetchGymData();
  }, [selectedDate, slots, capacityPerSlot]);
  const isAllSelectable = () =>
    statusRow.every((s) => s === "available" || selected[statusRow.indexOf(s)]);

  const isAllSelected = () =>
    statusRow.every((s, idx) => (s === "available" ? selected[idx] : true));

  const isPartialSelected = () =>
    statusRow.some((s, idx) => selected[idx]) && !isAllSelected();

  const toggleAll = () => {
    const allAvailable = statusRow.filter((s) => s === "available");
    if (allAvailable.length === 0) {
      enqueueSnackbar(
        "❗ ไม่สามารถเลือกทั้งวันได้ มีบางช่วงเวลาถูกจองหรือปิด",
        {
          variant: "warning",
        }
      );
      return;
    }

    const next = { ...selected };
    const selectAll = !isAllSelected();

    statusRow.forEach((s, idx) => {
      if (s === "available") {
        if (selectAll) {
          next[idx] = true;
        } else {
          delete next[idx];
        }
      }
    });

    setSelected(next);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
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
            🏟
          </Box>
          <Box>
            <Typography variant="h4">
              {courtInfo.name} — ตารางจอง ({selectedDate.format("DD MMM YYYY")})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {courtInfo.description}
            </Typography>
          </Box>
        </Box>

        <DatePicker
          label="เลือกวันที่"
          value={selectedDate}
          minDate={dayjs()}
          // maxDate={dayjs().add(14, "day")}
          onChange={(newValue) => {
            if (newValue) {
              setSelectedDate(newValue);
              setSelected({});
            }
          }}
          renderInput={(params) => (
            <TextField {...params} size="small" sx={{ mb: 2 }} />
          )}
        />

        <TableContainer
          component={Card}
          sx={{ overflow: "auto" }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <HeadCell>#</HeadCell>
                <HeadCell sx={{ minWidth: 160, textAlign: "left" }}>
                  พื้นที่
                </HeadCell>
                {slots.map((s) => (
                  <HeadCell key={s}>{s}</HeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <CourtCell>
                  <Checkbox
                    checked={isAllSelected()}
                    indeterminate={isPartialSelected()}
                    onChange={toggleAll}
                  />
                </CourtCell>
                <CourtCell>{courtInfo.name}</CourtCell>
                {slots.map((_, cIdx) => (
                  <BodyCell key={cIdx}>{renderCell(cIdx)}</BodyCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container alignItems="center" sx={{ mt: 2 }} spacing={1}>
          <Grid item xs={12} md="auto">
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              เลือกไว้: <b>{selectedCount}</b> ช่วงเวลา
            </Typography>
          </Grid>
          <Grid item xs={12} md="auto">
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip label="เต็ม" sx={{ bgcolor: "#8A1C12", color: "#fff"}} />
              <Chip label="close" sx={{ bgcolor: "#4A4744", color: "#fff" }} />
              <Chip
                label="งานช่างซ่อม"
                sx={{ bgcolor: "#92620A", color: "#fff" }}
              />
              <Chip label="ว่าง (เช็คบ็อกซ์)" variant="outlined" />
            </Box>
          </Grid>
          <Grid item xs />
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              อัปเดตล่าสุด {lastUpdated} • ตารางรีเฟรชทุก 2 นาที
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="รหัสประจำตัวนักศึกษา"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ชื่อ-นามสกุล"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="สังกัด"
              value={icit}
              onChange={(e) => setIcit(e.target.value)}
            >
              {ICIT_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!selectedCount}
          >
            ยืนยันการจอง
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default ReserveGymForm;
