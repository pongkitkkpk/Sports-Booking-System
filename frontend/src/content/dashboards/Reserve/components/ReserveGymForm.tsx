import {
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  Paper,
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

type SlotStatus =
  | "available"
  | "reserved"
  | "teaching"
  | "event"
  | "maintenance"
  | "closed"
  | "aaa"
  | "block-staff"
  | "block-grad";

const BodyCell = styled(TableCell)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.grey[200]}`,
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  textAlign: "center",
  padding: theme.spacing(0.5),
}));

const CourtCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  whiteSpace: "nowrap",
  borderRight: `1px solid ${theme.palette.grey[200]}`,
}));

const STATUS_STYLE: Record<
  Exclude<SlotStatus, "available">,
  { bg: string; fg?: string; label?: string }
> = {
  reserved: { bg: "#e53935", fg: "#fff", label: "reserved" },
  teaching: { bg: "#43a047", fg: "#fff", label: "teaching" },
  event: { bg: "#1e88e5", fg: "#fff", label: "event" },
  maintenance: { bg: "#ffb300", fg: "#333", label: "maintenance" },
  closed: { bg: "#9e9e9e", fg: "#fff", label: "closed" },
  aaa: { bg: "#c62828", fg: "#fff", label: "aaa" },
  "block-staff": { bg: "#8e24aa", fg: "#fff", label: "ช.บุคลากร" },
  "block-grad": { bg: "#1565c0", fg: "#fff", label: "กศ." },
};

function CellContent({
  status,
  checked,
  onCheck,
}: {
  status: SlotStatus;
  checked?: boolean;
  onCheck?: (v: boolean) => void;
}) {
  if (status === "available") {
    return (
      <Checkbox
        checked={checked}
        onChange={(e) => onCheck?.(e.target.checked)}
      />
    );
  }
  const s = STATUS_STYLE[status];
  return (
    <Box
      sx={{
        bgcolor: s.bg,
        color: s.fg || "#fff",
        borderRadius: 1,
        minHeight: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
        fontWeight: 600,
      }}
    >
      {s.label}
    </Box>
  );
}

const HeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: theme.palette.grey[100],
    fontWeight: 600,
    textAlign: "center",
    borderRight: `1px solid ${theme.palette.grey[200]}`,
  },
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
  const [bookingStatusIdRow, setBookingStatusIdRow] = useState<number[]>(
    Array(slots.length).fill(0)
  );

  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const toggleSelect = (slotIdx: number, v: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };

      setReservedCounts((prevCounts) => {
        const newCounts = [...prevCounts];
        if (v) {
          if (Object.keys(prev).length >= 3) {
            enqueueSnackbar("❗ คุณสามารถจองได้ไม่เกิน 3 ช่วงเวลา", {
              variant: "warning",
              autoHideDuration: 1500,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
            });
            return prev;
          }
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

  // รีเฟรชเวลาแสดงผลทุก 2 นาที
  useEffect(() => {
    const id = setInterval(
      () => setLastUpdated(dayjs().format("HH:mm:ss")),
      120000
    );
    return () => clearInterval(id);
  }, []);

  const selectedCount = Object.keys(selected).length;

  const [studentName, setStudentName] = useState("รอเชื่อม API typeA");
  const [studentId, setStudentId] = useState("65010001");
  const [purpose, setPurpose] = useState("1");
  const [icit, setIcit] = useState("CIT");
  const handleSubmit = async () => {
    if (!selectedCount) return;

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

      navigate(`/${baseLayout}/dashboards/reserve`, {
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
    const bookingStatusId = bookingStatusIdRow[slotIdx];

    const statusMap: Record<number, SlotStatus> = {
      1: "reserved",
      2: "teaching",
      3: "event",
      4: "maintenance",
      5: "closed",
      6: "aaa",
      7: "block-staff",
      8: "block-grad",
    };

    const mappedStatus = statusMap[bookingStatusId];

    if (mappedStatus && STATUS_STYLE[mappedStatus]) {
      const { bg, fg, label } = STATUS_STYLE[mappedStatus];

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
              bgcolor: bg,
              color: fg || "#fff",
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
            {label}
          </Box>
          {/* ✅ แสดงจำนวน */}
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

        const data: {
          time_slot_id: number;
          reserved: number;
          booking_status_id: number;
        }[] = res.data;

        const newCounts = Array(slots.length).fill(0);
        const newStatus: SlotStatus[] = Array(slots.length).fill("available");
        const bookingStatusIds = Array(slots.length).fill(0);

        const hourToIndex = (hour: number) => hour - 6;

        const reservedMap: { [index: number]: number } = {};

        for (const { time_slot_id, reserved, booking_status_id } of data) {
          const slotHour = time_slot_id + 5;
          const idx = hourToIndex(slotHour);
          if (idx >= 0 && idx < slots.length) {
            if ([1, 7].includes(booking_status_id)) {
              reservedMap[idx] = (reservedMap[idx] || 0) + reserved;
              const full = reservedMap[idx] >= capacityPerSlot;
              if (full) {
                bookingStatusIds[idx] = 1;
              }
            } else {
              newStatus[idx] = "maintenance";
              reservedMap[idx] = 0;
              bookingStatusIds[idx] = booking_status_id;
            }
          }
        }

        for (let i = 0; i < slots.length; i++) {
          const count = reservedMap[i] || 0;
          newCounts[i] = count;
          if (count >= capacityPerSlot) {
            newStatus[i] = "reserved";
          }
        }

        setReservedCounts(newCounts);
        setStatusRow(newStatus);
        setBookingStatusIdRow(bookingStatusIds);
      } catch (err) {
        console.error("โหลดข้อมูล gym ผิดพลาด:", err);
      }
    };

    fetchGymData();
  }, [selectedDate, slots, capacityPerSlot]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          🏟 {courtInfo.name} — ตารางจอง ({selectedDate.format("DD MMM YYYY")})
        </Typography>
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {courtInfo.description}
        </Typography>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, overflow: "auto" }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
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
            <Chip
              label="reserved"
              sx={{ bgcolor: "#e53935", color: "#fff", mr: 1 }}
            />
            <Chip
              label="teaching"
              sx={{ bgcolor: "#43a047", color: "#fff", mr: 1 }}
            />
            <Chip
              label="event"
              sx={{ bgcolor: "#1e88e5", color: "#fff", mr: 1 }}
            />
            <Chip
              label="maintenance"
              sx={{ bgcolor: "#ffb300", color: "#333", mr: 1 }}
            />
            <Chip
              label="closed"
              sx={{ bgcolor: "#9e9e9e", color: "#fff", mr: 1 }}
            />
            <Chip
              label="aaa"
              sx={{ bgcolor: "#c62828", color: "#fff", mr: 1 }}
            />
            <Chip
              label="ช.บุคลากร"
              sx={{ bgcolor: "#8e24aa", color: "#fff", mr: 1 }}
            />
            <Chip
              label="กศ."
              sx={{ bgcolor: "#1565c0", color: "#fff", mr: 1 }}
            />
            <Chip label="ว่าง (เช็คบ็อกซ์)" variant="outlined" />
          </Grid>

          <Grid item xs />
          <Grid item>
            <Typography variant="caption" color="text.secondary">
              อัปเดตล่าสุด {lastUpdated} • ตารางรีเฟรชทุก 2 นาที
            </Typography>
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
