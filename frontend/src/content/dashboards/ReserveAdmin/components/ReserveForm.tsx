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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Tabs, Tab } from "@mui/material"; // เพิ่มตรง import
import CloseByDateRange from "./CloseByDateRange";
type SlotStatus =
  | "available"
  | "reserved"
  | "teaching"
  | "event"
  | "maintenance"
  | "closed"
  | "aaa";

interface Props {
  courtType: string;
  courtInfo: {
    name: string;
    imageUrl: string;
    description: string;
    id: number;
  };
  courtCount?: number;
}

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

const STATUS_STYLE: Record<
  Exclude<SlotStatus, "available">,
  { bg: string; fg?: string; label?: string }
> = {
  reserved: { bg: "#8A1C12", fg: "#fff", label: "จองแล้ว" },
  teaching: { bg: "#146C43", fg: "#fff", label: "การเรียนการสอน" },
  event: { bg: "#3B6285", fg: "#fff", label: "กิจกรรม" },
  maintenance: { bg: "#92620A", fg: "#fff", label: "ปิดปรับปรุง" },
  closed: { bg: "#4A4744", fg: "#fff", label: "ปิดบริการ" },
  aaa: { bg: "#6B5B4D", fg: "#fff", label: "อื่นๆ" },
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

function ReserveForm({ courtType, courtInfo, courtCount = 1 }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const baseLayout = location.pathname.split("/")[1];

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const slots = useMemo(() => buildTimeSlots(8, 20), []);
  const [lastUpdated, setLastUpdated] = useState<string>(
    dayjs().format("HH:mm:ss")
  );

  const [grid, setGrid] = useState<SlotStatus[][]>(
    Array.from({ length: courtCount }, () =>
      Array.from({ length: slots.length }, () => "available")
    )
  );
  const [message, setMessage] = useState<string>("");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [tabIndex, setTabIndex] = useState(0); // 0 = รายชม, 1 = ช่วงวัน
  function mapReasonCodeToStatus(code: number): SlotStatus {
    switch (code) {
      case 1:
        return "reserved"; // จองทั่วไป
      case 2:
        return "teaching"; // ✅ จองเพื่อการเรียนการสอน
      case 3:
        return "event"; // จองเพื่อกิจกรรม
      case 4:
        return "maintenance"; // ปิดปรับปรุง
      case 5:
        return "closed"; // ม. ปิด
      case 6:
        return "aaa";
      default:
        return "reserved";
    }
  }
  useEffect(() => {
    const fetchReservedSlots = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/reservation-slots/by-date?date=${selectedDate.format(
            "YYYY-MM-DD"
          )}`
        );
        const data = res.data;

        const newGrid: SlotStatus[][] = Array.from({ length: courtCount }, () =>
          Array.from({ length: slots.length }, () => "available")
        );

        const normalize = (str: string) =>
          str.toLowerCase().replace(/\s/g, "").replace("court", "");

        for (const slot of data) {
          const courtName: string = slot.court?.name || "";
          const courtNormalized = normalize(courtName);
          const currentTypeNormalized = normalize(courtType);

          // ✨ ตรวจสอบว่า slot นี้เป็นของสนามที่กำลังเปิดอยู่หรือไม่
          if (!courtNormalized.includes(currentTypeNormalized)) continue;

          // หาค่า index ของสนาม (courtNumber)
          const courtNumber = parseInt(courtName.replace(/[^\d]/g, ""), 10) - 1;
          const startTime = slot.timeSlot?.start_time?.substring(0, 5); // "08:00"
          const slotIndex = slots.findIndex((s) => s.startsWith(startTime));

          if (
            courtNumber >= 0 &&
            courtNumber < courtCount &&
            slotIndex >= 0 &&
            slotIndex < slots.length
          ) {
            const statusId = slot.reservation?.bookingStatus?.id || 0;
            const status: SlotStatus = mapReasonCodeToStatus(statusId);
            console.log(status);
            newGrid[courtNumber][slotIndex] = status;
          }
        }
        setGrid(newGrid);
        setMessage("📌 อัปเดตข้อมูลจากฐานข้อมูลแล้ว");
      } catch (err) {
        console.error("❌ โหลดข้อมูลไม่สำเร็จ", err);
        setMessage("⚠️ โหลดข้อมูลจองไม่สำเร็จ");
      }
    };

    fetchReservedSlots();

    const interval = setInterval(() => {
      fetchReservedSlots();
    }, 120000);

    return () => clearInterval(interval);
  }, [selectedDate, courtType]);

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const { enqueueSnackbar } = useSnackbar();
  const toggleSelect = (r: number, c: number, v: boolean) => {
    const key = `${r}-${c}`;
    setSelected((prev) => {
      const next = { ...prev };
      if (v) {
        // if (Object.keys(prev).length >= 5) {
        //   enqueueSnackbar("❗ คุณสามารถจองได้ไม่เกิน 5 ช่วงเวลา", {
        //     variant: "warning",
        //     autoHideDuration: 1500,
        //     anchorOrigin: {
        //       vertical: "top",
        //       horizontal: "center",
        //     },
        //   });
        //   return prev;
        // }
        next[key] = true;
      } else {
        delete next[key];
      }
      return next;
    });
  };

  useEffect(() => {
    const id = setInterval(() => {
      setLastUpdated(dayjs().format("HH:mm:ss"));
    }, 120000);
    return () => clearInterval(id);
  }, []);

  const selectedCount = Object.keys(selected).length;

  const handleSubmit = () => {
    const items = Object.keys(selected).map((k) => {
      const [r, c] = k.split("-").map(Number);
      return {
        type_court: courtType,
        court: `${courtInfo.name} ${r + 1}`,
        court_id: courtInfo.id + r,
        time: slots[c],
        time_slot_id: c + 1,
        date: selectedDate.format("YYYY-MM-DD"),
      };
    });
    // alert
    // enqueueSnackbar(
    //   items.length
    //     ? `📌 ช่องที่เลือกจอง:\n${items
    //         .map((x) => `• ${x.court} ${x.time}`)
    //         .join("\n")}`
    //     : "ยังไม่ได้เลือกช่วงเวลา",
    //   {
    //     variant: items.length ? "info" : "warning",
    //     anchorOrigin: {
    //       vertical: "top",
    //       horizontal: "center",
    //     },
    //   }
    // );

    navigate(`/${baseLayout}/dashboards/reserve-admin/${courtType}/submit`, {
      state: { items },
    });
  };

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  // ตรวจว่า row ถูกเลือกทั้งหมดหรือไม่
  const isRowFullySelected = (rIdx: number) =>
    slots.every((_, cIdx) => selected[`${rIdx}-${cIdx}`]);

  // ตรวจว่า row มีบางช่องถูกเลือก (เพื่อแสดง indeterminate)
  const isRowPartiallySelected = (rIdx: number) =>
    slots.some((_, cIdx) => selected[`${rIdx}-${cIdx}`]) &&
    !isRowFullySelected(rIdx);
  const toggleRowSelect = (rIdx: number) => {
    const rowHasReserved = slots.some((_, cIdx) => {
      const status = grid?.[rIdx]?.[cIdx];
      return status !== "available"; // มีสถานะอื่นที่ไม่สามารถเลือกได้
    });

    if (rowHasReserved) {
      enqueueSnackbar(
        "⚠️ ไม่สามารถเลือกปิดทั้งวันได้ เนื่องจากมีบางช่วงเวลาถูกจองอยู่ กรุณายกเลิกก่อน",
        { variant: "error" }
      );
      return;
    }

    const newSelected = { ...selected };
    const isAllSelected = isRowFullySelected(rIdx);

    slots.forEach((_, cIdx) => {
      const key = `${rIdx}-${cIdx}`;
      const isAvailable = grid?.[rIdx]?.[cIdx] === "available";

      if (isAvailable) {
        if (isAllSelected) {
          delete newSelected[key];
        } else {
          newSelected[key] = true;
        }
      }
    });

    setSelected(newSelected);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2.5, sm: 4 }, pb: 0 }}>
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
          <Typography variant="h4">
            {courtInfo.name} — ตารางจอง ({selectedDate.format("DD MMM YYYY")})
          </Typography>
        </Box>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="📊 ปิดปรับปรุงรายชม" />
          <Tab label="✅ ปิดปรับปรุงเป็นช่วงระยะเวลาวัน" />
        </Tabs>
      </Box>
      {tabIndex === 0 && (
        <Box sx={{ p: { xs: 2.5, sm: 4 }, pt: 0 }}>
          <DatePicker
            label="เลือกวันที่"
            value={selectedDate}
            minDate={dayjs()}
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
            {message}
          </Typography>

          <TableContainer
            component={Card}
            sx={{ overflow: "auto" }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <HeadCell>#</HeadCell>
                  <HeadCell sx={{ minWidth: 160, textAlign: "left" }}>
                    สนาม
                  </HeadCell>
                  {slots.map((s) => (
                    <HeadCell key={s}>{s}</HeadCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(courtCount)].map((_, rIdx) => (
                  <TableRow key={rIdx} hover>
                    <CourtCell>
                      <Checkbox
                        checked={isRowFullySelected(rIdx)}
                        indeterminate={isRowPartiallySelected(rIdx)}
                        onChange={() => toggleRowSelect(rIdx)}
                      />
                    </CourtCell>
                    <CourtCell>{`${courtInfo.name} ${rIdx + 1}`}</CourtCell>
                    {slots.map((_, cIdx) => {
                      const key = `${rIdx}-${cIdx}`;
                      const isAvailable = grid?.[rIdx]?.[cIdx] === "available";
                      return (
                        <BodyCell key={key}>
                          <CellContent
                            status={grid?.[rIdx]?.[cIdx] || "unavailable"}
                            checked={!!selected[key]}
                            onCheck={(v) =>
                              isAvailable && toggleSelect(rIdx, cIdx, v)
                            }
                          />
                        </BodyCell>
                      );
                    })}
                  </TableRow>
                ))}
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
                {Object.entries(STATUS_STYLE).map(([status, style]) => (
                  <Chip
                    key={status}
                    label={style.label}
                    sx={{ bgcolor: style.bg, color: style.fg || "#fff" }}
                  />
                ))}
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
      )}
      {tabIndex === 1 && (
        <Box sx={{ p: { xs: 2.5, sm: 4 }, pt: 0 }}>
          <CloseByDateRange
            courtName={courtInfo.name}
            courtCount={courtCount}
            courtIdStart={courtInfo.id}
          />
        </Box>
      )}
    </LocalizationProvider>
  );
}

export default ReserveForm;
