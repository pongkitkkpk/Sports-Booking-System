import { Fragment, SyntheticEvent, useEffect, useMemo, useState } from "react";
import {
  Button,
  Typography,
  Card,
  Box,
  CardContent,
  CardHeader,
  Link,
  Divider,
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  Avatar,
  Pagination,
  CardActions,
  TextField,
  CircularProgress,
  styled,
} from "@mui/material";
import { useSnackbar } from "notistack";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import TimerTwoToneIcon from "@mui/icons-material/TimerTwoTone";
import BlockTwoToneIcon from "@mui/icons-material/BlockTwoTone";
import AccessTimeTwoToneIcon from "@mui/icons-material/AccessTimeTwoTone";
import dayjs from "dayjs";
import axios from "axios";
import CancelReasonDialog from "./CancelReasonDialog";

// สถานะเดียวกับที่ใช้ใน KpiDashboard/KPIs.tsx เพื่อให้คำและสีตรงกันทั้งระบบ
const STATUS_CHIP: Record<
  string,
  {
    label: string;
    color: "error" | "success" | "warning" | "default" | "info";
  }
> = {
  pending: { label: "รอดำเนินการ", color: "warning" },
  approved: { label: "อนุมัติแล้ว", color: "success" },
  success: { label: "สำเร็จ", color: "success" },
  rejected: { label: "ถูกปฏิเสธ", color: "error" },
  no_show: { label: "ไม่มาใช้บริการ", color: "error" },
  close: { label: "ปิดสนาม", color: "default" },
  "walk-in": { label: "Walk-in", color: "info" },
};

const STATUS_ICON: Record<string, JSX.Element> = {
  warning: <TimerTwoToneIcon fontSize="small" />,
  error: <BlockTwoToneIcon fontSize="small" />,
  success: <CheckTwoToneIcon fontSize="small" />,
};

// สถานะที่ยังยกเลิกได้ด้วยตัวเอง — สถานะอื่น (สำเร็จ/ไม่มา/ถูกปฏิเสธ/ปิดสนาม) จบไปแล้วหรือไม่ใช่สิ่งที่ผู้ใช้ยกเลิกเองได้
const CANCELABLE_STATUSES = new Set(["pending", "approved"]);

// ลำดับความสำคัญของสถานะ เพื่อเลือกสถานะที่ควรเด่นที่สุดมาแสดงบนป้ายรวมของการจอง
const STATUS_PRIORITY = [
  "rejected",
  "no_show",
  "pending",
  "walk-in",
  "approved",
  "success",
  "close",
];

const worstStatus = (statuses: string[]): string => {
  for (const s of STATUS_PRIORITY) {
    if (statuses.includes(s)) return s;
  }
  return statuses[0] || "pending";
};

const TabsContainerWrapper = styled(CardContent)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
`
);

const CourtAvatar = styled(Avatar)(
  ({ theme }) => `
      background: linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light});
      color: #fff;
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
`
);

const PAGE_SIZE = 5;
const STUDENT_ID_STORAGE_KEY = "kmutnb.lastStudentId";

const getChipColor = (
  description: string
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (description) {
    case "จองเพื่อออกกำลังกาย":
      return "primary";
    case "จองเพื่อการเรียนการสอน":
      return "success";
    case "จองเพื่อกิจกรรม":
      return "info";
    case "ปิดปรับปรุง":
      return "warning";
    case "มหาวิทยาลัยปิด":
      return "default";
    default:
      return "secondary";
  }
};

function BookingStatus() {
  const [studentId, setStudentId] = useState(
    () => localStorage.getItem(STUDENT_ID_STORAGE_KEY) || ""
  );
  const [studentIdInput, setStudentIdInput] = useState(studentId);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [openCancel, setOpenCancel] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const fetchBookings = async (id: string) => {
    if (!id) {
      setBookings([]);
      return;
    }
    setLoading(true);
    try {
      // ✅ ดึงเฉพาะ active (default API จะตัด cancel ออกให้เอง)
      const res = await axios.get(
        `${baseUrl}/api/reservations/by-student/${id}`
      );
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch booking status", error);
      enqueueSnackbar("❌ ไม่สามารถดึงรายการจองได้", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(studentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const handleLookup = () => {
    const trimmed = studentIdInput.trim();
    if (!trimmed) return;
    localStorage.setItem(STUDENT_ID_STORAGE_KEY, trimmed);
    setStudentId(trimmed);
  };

  const [currentTab, setCurrentTab] = useState<string>("all");
  const [page, setPage] = useState(1);

  const tabs = [
    { value: "all", label: "ทั้งหมด" },
    { value: "active", label: "วันนี้" },
    { value: "upcoming", label: "กำลังจะถึง" },
  ];

  const handleTabsChange = (_event: SyntheticEvent, value: string): void => {
    setCurrentTab(value);
    setPage(1);
  };

  // ✅ group พร้อม embed approve_status ลงในแต่ละ slot
  const groupedBookings = bookings.reduce((acc, curr) => {
    const key = `${curr.court.name}-${curr.date}`;

    // สร้าง slot ที่มีสถานะจริงจาก reservation_slot
    const slotWithStatus = {
      ...(curr.timeSlot || {}), // start, end, id (ของ master timeslot)
      id: curr?.timeSlot?.id, // เผื่อ backend ไม่ส่ง id ใน timeSlot
      // backend (reservations.service.ts findByStudentId) ส่งฟิลด์ชื่อ `status`
      // ไม่ใช่ `approve_status` — ของเดิมอ่านผิดฟิลด์ทำให้ค่าเป็น undefined เสมอ
      status: curr.status, // ✅ สถานะจริงของ reservation slot (e.g., 'cancel', 'approved', 'pending')
      reservationId: curr.id, // ใช้ตอนยิง cancel
      date: curr.date,
    };

    if (!acc[key]) {
      acc[key] = {
        id: curr.id, // reservation.id (ใช้ตอน enrich)
        court: curr.court,
        date: curr.date,
        booking_status: curr.booking_status_id?.description || "ไม่ระบุ",
        timeSlots: [slotWithStatus],
      };
    } else {
      acc[key].timeSlots.push(slotWithStatus);
    }
    return acc;
  }, {} as Record<string, any>);

  const groupedList = Object.values(groupedBookings)
    .filter((item: any) =>
      item.timeSlots.some((slot: any) => slot.status !== "cancel")
    )
    .map((item: any) => ({
      ...item,
      // ✅ คำนวณสถานะรวมจาก slot ที่ยังไม่ถูกยกเลิกทุกครั้งที่ render แทนการอ่านจาก slot แรกเพียงตัวเดียว
      status: worstStatus(
        item.timeSlots
          .filter((slot: any) => slot.status !== "cancel")
          .map((slot: any) => slot.status)
      ),
    }));

  const filteredList = useMemo(() => {
    const today = dayjs().startOf("day");
    return groupedList.filter((item: any) => {
      const itemDate = dayjs(item.date).startOf("day");
      if (currentTab === "active") return itemDate.isSame(today);
      if (currentTab === "upcoming") return itemDate.isAfter(today);
      return true;
    });
  }, [groupedList, currentTab]);

  const pageCount = Math.max(1, Math.ceil(filteredList.length / PAGE_SIZE));
  const paginatedList = filteredList.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // ✅ อัปเดตสถานะใน local state ทันที (optimistic)
  const applyLocalCancel = (slot: {
    reservationId: number;
    id: number;
    date: string;
  }) => {
    setBookings((prev) =>
      prev.map((b: any) => {
        const isSameReservation = b.id === slot.reservationId;
        const isSameSlot = b.timeSlot?.id === slot.id;
        const isSameDate = b.date === slot.date;
        if (isSameReservation && isSameSlot && isSameDate) {
          return {
            ...b,
            status: "cancel", // สำคัญสุด — ต้องตรงกับฟิลด์ที่ backend ส่งมาจริง
          };
        }
        return b;
      })
    );
  };

  const handleCancelBooking = (slot: any) => {
    setSelectedSlot(slot);
    setOpenCancel(true);
  };

  const handleSubmitCancel = async (reason: string) => {
    if (!selectedSlot) return;

    const prevState = bookings;
    try {
      setSubmittingCancel(true);

      // Optimistic update
      applyLocalCancel(selectedSlot);

      await axios.post(`${baseUrl}/api/reservation-slots/cancel`, {
        id: selectedSlot.reservationId,
        timeSlot: { id: selectedSlot.id },
        date: selectedSlot.date,
        status: "cancel",
        reason,
      });

      enqueueSnackbar(" ยกเลิกการจองเรียบร้อย", { variant: "success" });
      setOpenCancel(false);
      setSelectedSlot(null);
      // ถ้าต้องการ sync จริง ๆ ค่อยเรียก: await fetchBookings(studentId);
    } catch (err) {
      setBookings(prevState); // rollback
      enqueueSnackbar("❌ เกิดข้อผิดพลาดในการยกเลิก", { variant: "error" });
      console.error("Cancel API error:", err);
    } finally {
      setSubmittingCancel(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="รายการจองของฉัน"
        subheader={`ทั้งหมด ${filteredList.length} รายการ`}
      />
      <Divider />
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          label="รหัสนักศึกษา"
          value={studentIdInput}
          onChange={(e) => setStudentIdInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLookup();
          }}
          sx={{ minWidth: 220 }}
        />
        <Button variant="contained" onClick={handleLookup} disabled={loading}>
          {loading ? "กำลังโหลด..." : "ดูรายการจอง"}
        </Button>
      </Box>
      <Divider />
      <TabsContainerWrapper>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>
      <Divider />

      {loading ? (
        <Box sx={{ textAlign: "center", py: 7, px: 3 }}>
          <CircularProgress size={32} />
        </Box>
      ) : filteredList.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 7, px: 3, color: "text.secondary" }}>
          <Typography sx={{ fontSize: "2rem", mb: 1, opacity: 0.5 }}>
            📭
          </Typography>
          <Typography>
            {studentId
              ? "ไม่มีรายการจองในหมวดนี้"
              : "กรอกรหัสนักศึกษาแล้วกด “ดูรายการจอง” เพื่อดูรายการของคุณ"}
          </Typography>
        </Box>
      ) : (
        <>
          <List disablePadding>
            {paginatedList.map((item: any, idx: number) => (
              <Fragment key={`${item.court?.name}-${item.date}-${idx}`}>
                <ListItem sx={{ display: "block", py: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <CourtAvatar>🏟</CourtAvatar>
                      <Box>
                        <Link
                          underline="none"
                          sx={{
                            "&:hover": {
                              color: "primary.dark",
                            },
                          }}
                          href="#"
                        >
                          <Typography variant="h4" component="span">
                            จองสนาม {item.court.name} วันที่{" "}
                            {dayjs(item.date).format("MMMM D, YYYY")}
                          </Typography>
                        </Link>
                        <Typography variant="body2" color="text.secondary">
                          📅 {dayjs(item.date).format("MMMM D, YYYY")}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      size="small"
                      variant="outlined"
                      color={STATUS_CHIP[item.status]?.color || "default"}
                      icon={STATUS_ICON[STATUS_CHIP[item.status]?.color]}
                      label={STATUS_CHIP[item.status]?.label || item.status}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 2,
                      pl: { sm: 9 },
                    }}
                  >
                    <Chip
                      size="small"
                      label={item.booking_status}
                      color={getChipColor(item.booking_status)}
                    />
                    {item.timeSlots
                      .filter((slot: any) => slot.status !== "cancel")
                      .map((slot: any, i: number) => {
                        const enrichedSlot = {
                          ...slot,
                          courtName: item.court?.name,
                          date: item.date,
                          itemStatus: item.status,
                          bookingStatus: item.booking_status,
                        };
                        const statusInfo = STATUS_CHIP[slot.status];
                        const timeLabel = `${String(slot.start).slice(
                          0,
                          5
                        )} - ${String(slot.end).slice(0, 5)}`;
                        return (
                          <Chip
                            key={`${slot.id}-${i}`}
                            size="small"
                            variant="outlined"
                            color={statusInfo?.color || "default"}
                            icon={<AccessTimeTwoToneIcon fontSize="small" />}
                            label={
                              statusInfo
                                ? `${timeLabel} · ${statusInfo.label}`
                                : timeLabel
                            }
                            onDelete={
                              CANCELABLE_STATUSES.has(slot.status)
                                ? () => handleCancelBooking(enrichedSlot)
                                : undefined
                            }
                          />
                        );
                      })}
                  </Box>
                </ListItem>

                <Divider component="li" />
              </Fragment>
            ))}
          </List>
          <CancelReasonDialog
            open={openCancel}
            slot={selectedSlot}
            onClose={() => {
              setOpenCancel(false);
              setSelectedSlot(null);
            }}
            onSubmit={handleSubmitCancel}
            submitting={submittingCancel}
          />

          <CardActions
            disableSpacing
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              size="large"
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </CardActions>
        </>
      )}
    </Card>
  );
}

export default BookingStatus;
