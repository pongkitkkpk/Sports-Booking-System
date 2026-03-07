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

type SlotStatus = "available" | "reserved" | "closed" | "maintenance";

const HeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: theme.palette.grey[100],
    fontWeight: 600,
    textAlign: "center",
    borderRight: `1px solid ${theme.palette.grey[200]}`,
  },
}));

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
            bgcolor: "#e0e0e0",
            color: "#333",
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
            bgcolor: "#ffb300",
            color: "#333",
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
              bgcolor: "#e53935",
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
            <Chip
              label="เต็ม"
              sx={{ bgcolor: "#e53935", color: "#fff", mr: 1 }}
            />
            <Chip
              label="close"
              sx={{ bgcolor: "#e0e0e0", color: "#333", mr: 1 }}
            />
            <Chip
              label="งานช่างซ่อม"
              sx={{ bgcolor: "#ffb300", color: "#333", mr: 1 }}
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
