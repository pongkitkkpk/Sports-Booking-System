import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
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
  IconButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  useTheme,
  Pagination,
  CardActions,
  styled,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import Text from "../../../components/Text";
import PendingTwoToneIcon from "@mui/icons-material/PendingTwoTone";
import LocalFireDepartmentTwoToneIcon from "@mui/icons-material/LocalFireDepartmentTwoTone";
import TimerTwoToneIcon from "@mui/icons-material/TimerTwoTone";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import InsertInvitationTwoToneIcon from "@mui/icons-material/InsertInvitationTwoTone";
import MarkEmailReadTwoToneIcon from "@mui/icons-material/MarkEmailReadTwoTone";
import dayjs from "dayjs";
import axios from "axios";
import CancelReasonDialog from "./CancelReasonDialog";

const TabsContainerWrapper = styled(CardContent)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color: ${theme.colors.success.main};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      margin-right: ${theme.spacing(1)};
`
);

const AvatarPending = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.warning.lighter};
      color: ${theme.colors.warning.main};
      width: ${theme.spacing(10)};
      height: ${theme.spacing(10)};
      margin: 0 auto ${theme.spacing(2)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(42)};
      }
`
);

const AvatarEvents = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.info.lighter};
      color: ${theme.colors.info.main};
      width: ${theme.spacing(10)};
      height: ${theme.spacing(10)};
      margin: 0 auto ${theme.spacing(2)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(42)};
      }
`
);

const AvatarInfo = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.info.lighter};
      color: ${theme.colors.info.main};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      margin-right: ${theme.spacing(1)};
`
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
      color: ${theme.colors.alpha.black[70]};
      
      &:hover {
        color: ${theme.colors.alpha.black[100]};
      }
`
);

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
      return "success";
    case "จองเพื่อการเรียนการสอน":
      return "info";
    case "จองเพื่อกิจกรรม":
      return "warning";
    case "ปิดปรับปรุง":
      return "error";
    case "มหาวิทยาลัยปิด":
      return "default";
    default:
      return "secondary";
  }
};

function BookingStatus() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const student_id = "65010001";
  const [bookings, setBookings] = useState<any[]>([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [openCancel, setOpenCancel] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const fetchBookings = async () => {
    try {
      // ✅ ดึงเฉพาะ active (default API จะตัด cancel ออกให้เอง)
      const res = await axios.get(
        `${baseUrl}/api/reservations/by-student/${student_id}`
      );
      setBookings(res.data);

      // ✅ ถ้าอยากรวม cancel ด้วย (เช่นไปทำหน้า "ประวัติการจอง")
      // const res = await axios.get(
      //   `${baseUrl}/api/reservations/by-student/${student_id}?includeCanceled=true`
      // );
      // setBookings(res.data);

      // ✅ หรือถ้าจะดูเฉพาะ cancel
      // const res = await axios.get(
      //   `${baseUrl}/api/reservations/by-student/${student_id}?status=cancel`
      // );
      // setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch booking status", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = () => {
    enqueueSnackbar(t("You clicked on delete!"), {
      variant: "error",
    });
  };

  const handleClick = () => {
    enqueueSnackbar(t("You clicked on the chip!"), {
      variant: "success",
    });
  };

  const [currentTab, setCurrentTab] = useState<string>("all");

  const tabs = [
    { value: "all", label: t("All Courses") },
    { value: "active", label: t("Active") },
    { value: "upcoming", label: t("Upcoming") },
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  // ✅ group พร้อม embed approve_status ลงในแต่ละ slot
  const groupedBookings = bookings.reduce((acc, curr) => {
    const key = `${curr.court.name}-${curr.date}`;

    // สร้าง slot ที่มีสถานะจริงจาก reservation_slot
    const slotWithStatus = {
      ...(curr.timeSlot || {}), // start, end, id (ของ master timeslot)
      id: curr?.timeSlot?.id, // เผื่อ backend ไม่ส่ง id ใน timeSlot
      status: curr.approve_status, // ✅ สถานะจริงของ reservation slot (e.g., 'cancel', 'approved', 'pending')
      reservationId: curr.id, // ใช้ตอนยิง cancel
      date: curr.date,
    };

    if (!acc[key]) {
      acc[key] = {
        id: curr.id, // reservation.id (ใช้ตอน enrich)
        court: curr.court,
        date: curr.date,
        status: curr.status, // ถ้ามี (เช่น overall reservation status)
        booking_status: curr.booking_status_id?.description || "ไม่ระบุ",
        timeSlots: [slotWithStatus],
      };
    } else {
      acc[key].timeSlots.push(slotWithStatus);
    }
    return acc;
  }, {} as Record<string, any>);

  const groupedList = Object.values(groupedBookings);

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
            approve_status: "cancel", // สำคัญสุด
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
      // ถ้าต้องการ sync จริง ๆ ค่อยเรียก: await fetchBookings();
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
      <CardHeader title={t("Recent Courses")} />
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

      {currentTab === "all" && (
        <>
          {bookings.length === 0 ? (
            <Typography sx={{ p: 3, textAlign: "center" }}>
              ยังไม่มีการจอง
            </Typography>
          ) : (
            <>
              <List disablePadding>
                {groupedList
                  // ✅ แสดงเฉพาะ group ที่ยังมี slot ที่ไม่ถูก cancel
                  .filter((item: any) =>
                    item.timeSlots.some((slot: any) => slot.status !== "cancel")
                  )
                  .map((item: any, idx: number) => (
                    <Fragment key={`${item.court?.name}-${item.date}-${idx}`}>
                      <ListItem
                        sx={{
                          display: { xs: "block", md: "flex" },
                          py: 3,
                        }}
                      >
                        <ListItemAvatar sx={{ mr: 2 }}>
                          <Link underline="none" href="#">
                            <img
                              src={`/static/images/placeholders/fitness/${
                                (idx % 3) + 1
                              }.jpg`}
                              alt="..."
                            />
                          </Link>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <>
                              <Box
                                sx={{
                                  pb: 1,
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {item.timeSlots
                                  .filter(
                                    (slot: any) => slot.status !== "cancel"
                                  )
                                  .map((slot: any, i: number) => {
                                    const enrichedSlot = {
                                      ...slot, // มี id, start, end, status, reservationId, date
                                      courtName: item.court?.name, // ✅ เพิ่มชื่อสนาม
                                      date: item.date, // ✅ ใช้ต่อใน dialog และ API
                                      itemStatus: item.status, // ✅ สถานะระดับรายการ (pending/success)
                                      bookingStatus: item.booking_status, // (ถ้าต้องการด้วย)
                                    };
                                    return (
                                      <Chip
                                        key={`${slot.id}-${i}`}
                                        size="small"
                                        label={`⏰ ${String(slot.start).slice(
                                          0,
                                          5
                                        )} - ${String(slot.end).slice(0, 5)}`}
                                        color="secondary"
                                        onClick={handleClick}
                                        onDelete={() =>
                                          handleCancelBooking(enrichedSlot)
                                        }
                                      />
                                    );
                                  })}

                                <Chip
                                  size="small"
                                  label={item.booking_status}
                                  color={getChipColor(item.booking_status)}
                                  onClick={handleClick}
                                  // onDelete={handleDelete}
                                />
                              </Box>
                              <Link
                                underline="none"
                                sx={{
                                  "&:hover": {
                                    color: theme.colors.primary.dark,
                                  },
                                }}
                                href="#"
                              >
                                จองสนาม {item.court.name} วันที่{" "}
                                {dayjs(item.date).format("MMMM D, YYYY")}
                              </Link>
                            </>
                          }
                          primaryTypographyProps={{ variant: "h3" }}
                          secondary={
                            <>
                              📅 {dayjs(item.date).format("MMMM D, YYYY")}
                              <br />
                              <Box
                                display="flex"
                                alignItems="center"
                                sx={{ pt: 1 }}
                              >
                                <AvatarInfo>
                                  {item.status === "pending" ? (
                                    <TimerTwoToneIcon />
                                  ) : (
                                    <CheckTwoToneIcon />
                                  )}
                                </AvatarInfo>
                                <Text
                                  color={
                                    item.status === "pending"
                                      ? "info"
                                      : "success"
                                  }
                                >
                                  <b>
                                    {item.status === "pending"
                                      ? "รอดำเนินการ"
                                      : "เสร็จสิ้น"}
                                  </b>
                                </Text>
                              </Box>
                            </>
                          }
                          secondaryTypographyProps={{
                            variant: "subtitle2",
                            sx: {
                              pt: 1,
                            },
                          }}
                        />

                        <Box
                          sx={{
                            my: { xs: 2, md: 0 },
                          }}
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-right"
                        >
                          <Box display="flex" alignItems="center">
                            <Text color="warning">
                              <LocalFireDepartmentTwoToneIcon />
                            </Text>
                            <b>
                              {9 + (idx % 2)}.{idx % 10}
                            </b>
                          </Box>
                          <Button
                            sx={{ mx: 2 }}
                            variant="outlined"
                            size="small"
                          >
                            รายละเอียด
                          </Button>
                          <IconButtonWrapper size="small" color="secondary">
                            <PendingTwoToneIcon />
                          </IconButtonWrapper>
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
                <Pagination size="large" count={7} color="primary" />
              </CardActions>
            </>
          )}
        </>
      )}

      {currentTab === "active" && (
        <Box
          sx={{
            py: { xs: 2, md: 6, lg: 8 },
            textAlign: "center",
          }}
        >
          <AvatarPending>
            <NotificationsActiveTwoToneIcon />
          </AvatarPending>
          <Typography variant="h2">{t("Start learning today")}!</Typography>
          <Typography
            variant="h4"
            sx={{
              pt: 1,
              pb: 3,
            }}
            fontWeight="normal"
            color="text.secondary"
          >
            {t(
              "Browse over 500 quality courses to start learning something useful today"
            )}
            !
          </Typography>
          <Button
            color="warning"
            variant="outlined"
            sx={{
              borderWidth: "2px",
              "&:hover": {
                borderWidth: "2px",
              },
            }}
          >
            {t("Browse courses")}
          </Button>
        </Box>
      )}

      {currentTab === "upcoming" && (
        <Box
          sx={{
            py: { xs: 2, md: 6, lg: 8 },
            textAlign: "center",
          }}
        >
          <AvatarEvents>
            <InsertInvitationTwoToneIcon />
          </AvatarEvents>
          <Typography variant="h2">{t("Upcoming events")}</Typography>
          <Typography
            variant="h4"
            sx={{
              pt: 1,
              pb: 3,
            }}
            fontWeight="normal"
            color="text.secondary"
          >
            {t("Right now there are no upcoming events available")}!
          </Typography>
          <Button
            color="info"
            variant="outlined"
            startIcon={<MarkEmailReadTwoToneIcon />}
            sx={{
              borderWidth: "2px",
              "&:hover": {
                borderWidth: "2px",
              },
            }}
          >
            {t("Subscribe to newsletter")}
          </Button>
        </Box>
      )}
    </Card>
  );
}

export default BookingStatus;
