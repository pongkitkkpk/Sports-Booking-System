// src/content/dashboards/Reserve/components/ReserveInfoForm.tsx

import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import EventAvailableTwoToneIcon from "@mui/icons-material/EventAvailableTwoTone";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import { useSnackbar } from "notistack";

interface ReserveItem {
  court: string;
  date: string;
  time: string;
  court_id: number;
  time_slot_id: number;
}

const RULES_BY_COURT: { match: string; rules: string[] }[] = [
  {
    match: "ยิม",
    rules: [
      "กรุณาใส่รองเท้ากีฬาเท่านั้น",
      "งดใช้เครื่องเสียงรบกวนผู้อื่น",
      "ห้ามกินอาหารและเครื่องดื่มในสนาม",
    ],
  },
  {
    match: "แบดมินตัน",
    rules: [
      "ใช้อุปกรณ์ส่วนตัวเท่านั้น (ไม้/ลูก)",
      "งดใส่รองเท้าที่พื้นดำหรือมีตะปู",
      "ห้ามลากเก้าอี้หรืออุปกรณ์บนพื้นสนาม",
    ],
  },
  {
    match: "ฟุตซอล",
    rules: [
      "ใช้รองเท้าพื้นเรียบเท่านั้น",
      "ไม่อนุญาตให้เตะบอลใส่กำแพง",
      "ห้ามเล่นเกินจำนวนคนที่กำหนด",
    ],
  },
  {
    match: "เทนนิส",
    rules: [
      "งดใช้รองเท้าหนาม",
      "ห้ามเล่นขณะฝนตก",
      "เคารพสิทธิ์ผู้อื่นและไม่ส่งเสียงดัง",
    ],
  },
  {
    match: "basketball",
    rules: [
      "งดใช้รองเท้าหนาม",
      "ห้ามเล่นขณะฝนตก",
      "เคารพสิทธิ์ผู้อื่นและไม่ส่งเสียงดัง",
    ],
  },
];

const STEPS = ["เลือกสนาม", "กรอกข้อมูล", "ยืนยันการจอง"];

function ReserveInfoForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems: ReserveItem[] = location.state?.items || [];
  const { enqueueSnackbar } = useSnackbar();

  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [icit, setIcit] = useState("");
  const [icitOptions, setIcitOptions] = useState<string[]>([]);

  //teest
  useEffect(() => {
    // TODO: fetch from backend; ใช้ mock ไปก่อน
    setTimeout(() => {
      setIcitOptions([
        "ICIT คณะเทคโนโลยีอุตสาหกรรม",
        "FIT คณะเทคโนโลยีสารสนเทศ",
        "FTE คณะวิศวกรรมศาสตร์",
        "FIB คณะบริหารธุรกิจ",
        "อื่น ๆ",
      ]);
    }, 500);
  }, []);

  const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    if (!studentId || !studentName || !purpose || !icit) {
      enqueueSnackbar("❗ กรุณากรอกข้อมูลให้ครบถ้วน", {
        variant: "warning",
        autoHideDuration: 1500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    try {
      const payload = {
        // type_court: selectedItems[0].type_court,
        student_id: studentId,
        student_name: studentName,
        icit: icit,
        bookingStatusId: parseInt(purpose),
        slots: selectedItems.map((x) => ({
          court_id: x.court_id,
          time_slot_id: x.time_slot_id,
          date: dayjs(x.date).format("YYYY-MM-DD"),
        })),
      };
      console.log(payload);
      const res = await axios.post(`${baseAPIUrl}/api/reservations`, payload);

      enqueueSnackbar(
        `✅ ส่งคำขอจองเรียบร้อย:
ชื่อ: ${studentName}
รหัส: ${studentId}
ICIT: ${icit}
สถานะ: ${purpose}
รายการ:
${selectedItems
  .map((x) => `• ${x.court} ${dayjs(x.date).format("DD MMM YYYY")} ${x.time}`)
  .join("\n")}`,
        {
          variant: "success",
          autoHideDuration: 3000,
          style: {
            whiteSpace: "pre-line",
            fontSize: "0.95rem",
          },
        }
      );

      navigate(
        `/extended-sidebar/dashboards/reserve/${selectedItems[0].type_court}`
      );
    } catch (error) {
      console.error("❌ ไม่สามารถส่งคำขอได้", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งคำขอ หรือ ตารางจองไม่ว่างแล้วครับ");
      navigate(
        `/extended-sidebar/dashboards/reserve/${selectedItems[0].type_court}`
      );
    }
  };

  const backTo = `/extended-sidebar/dashboards/reserve/${selectedItems[0]?.type_court}`;
  const activeRules =
    selectedItems.length > 0
      ? RULES_BY_COURT.find((r) => selectedItems[0].court.includes(r.match))
          ?.rules
      : undefined;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          ✍️
        </Box>
        <Typography variant="h4">กรอกรายละเอียดการจอง</Typography>
      </Box>

      <Stepper activeStep={1} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* ฟอร์มข้อมูลผู้จอง */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Typography variant="h6" gutterBottom>
              ข้อมูลผู้จอง
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="รหัสนักศึกษา"
                  fullWidth
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ชื่อนักศึกษา"
                  fullWidth
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="หน่วยงาน / คณะ (ICIT)"
                  select
                  fullWidth
                  value={icit}
                  onChange={(e) => setIcit(e.target.value)}
                >
                  {icitOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="จุดประสงค์ในการจอง"
                  fullWidth
                  select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  <MenuItem value="1">ออกกำลังกาย</MenuItem>
                  <MenuItem value="2">การเรียนการสอน</MenuItem>
                  <MenuItem value="3">กิจกรรม</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box
              sx={{ mt: 2 }}
              display={{ xs: "none", md: "block" }}
            >
              <Button
                variant="outlined"
                color="error"
                component={RouterLink}
                to={backTo}
                startIcon={<ArrowBackTwoToneIcon />}
                sx={{ mt: 2 }}
              >
                ยกเลิก
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* สรุปรายการจอง */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: { xs: 2.5, sm: 3 }, position: { md: "sticky" }, top: { md: 88 } }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <EventAvailableTwoToneIcon color="primary" />
              <Typography variant="h6">สรุปรายการจอง</Typography>
            </Box>

            {selectedItems.length === 0 ? (
              <Typography color="text.secondary">
                ยังไม่มีรายการสนามที่เลือก
              </Typography>
            ) : (
              <List dense disablePadding>
                {selectedItems.map((item, idx) => (
                  <ListItem
                    key={idx}
                    disableGutters
                    sx={{
                      py: 1,
                      borderBottom: (theme) =>
                        idx < selectedItems.length - 1
                          ? `1px dashed ${theme.palette.divider}`
                          : "none",
                    }}
                  >
                    <ListItemText
                      primary={item.court}
                      secondary={`${dayjs(item.date).format(
                        "DD MMM YYYY"
                      )} • ${item.time}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {activeRules && (
              <>
                <Divider sx={{ my: 2.5 }} />
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => `${theme.palette.primary.main}0d`,
                    border: (theme) => `1px solid ${theme.palette.primary.main}33`,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    📌 เงื่อนไขการใช้สนาม
                  </Typography>
                  <List dense disablePadding>
                    {activeRules.map((txt, i) => (
                      <ListItem key={i} disableGutters sx={{ py: 0.3 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FiberManualRecordIcon
                            sx={{ fontSize: 6, color: "primary.main" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primaryTypographyProps={{ variant: "body2" }}
                          primary={txt}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            )}

            <Divider sx={{ my: 2.5 }} />

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleSubmit}
              disabled={selectedItems.length === 0}
            >
              ✅ ยืนยันการส่งคำขอจอง
            </Button>
            <Button
              fullWidth
              variant="text"
              color="error"
              component={RouterLink}
              to={backTo}
              startIcon={<ArrowBackTwoToneIcon />}
              sx={{ mt: 1, display: { xs: "flex", md: "none" } }}
            >
              ยกเลิก
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ReserveInfoForm;
